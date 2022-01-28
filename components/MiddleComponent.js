import React, { useEffect, useState } from "react";
import { auth, firestore, getAvatarURL, perf, setFCM } from "lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData, selectUserExists, setAvatarURL, setNotifications, setRole, setUserData, setUserExists } from "lib/slices/userSlice";
import { routeManager } from "lib/routeManager";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import { Backdrop, CircularProgress } from "@mui/material";
import { trace } from "firebase/performance";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";

function MiddleComponent(props) {
	const [lang, setLang] = useState("EN");
	const userData = useSelector(selectUserData);
	const [isLoading, setIsLoading] = useState(true);
	const [pageLoaded, setPageLoaded] = useState(false);
	const router = useRouter();
	const { route } = router;
	const [snapshots, setSnapshots] = useState([]);
	const userExists = useSelector(selectUserExists);
	const dispatch = useDispatch();

	useEffect(() => {
		setLang(cookieCutter.get("lang") ?? "EN");
	}, [lang]);

	useEffect(() => {
		if (!isLoading) {
			routeManager(userData, route);
			setPageLoaded(true);
		} else {
			setPageLoaded(false);
		}
	}, [route, userData, auth.currentUser, isLoading]);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			setIsLoading(true);
			console.log("user update", user);
			if (user) {
				user.getIdTokenResult().then(({ claims }) => {
					if (claims.moderator) {
						dispatch(setRole("moderator"));
					} else if (claims.employee) {
						dispatch(setRole("employee"));
					} else {
						dispatch(setRole("member"));
					}
				});
				dispatch(setUserExists(true));
				dispatch(setAvatarURL(await getAvatarURL()));
				const userSnapshot = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
					const userData = doc.data();
					console.log("userData update", userData);
					if (!userData) return;
					const dispatchData = {
						...userData,
						creationDate: userData?.creationDate.toDate().toISOString(),
					};
					if (userData.FCM) {
						dispatchData.FCM = { token: userData.FCM?.token, timestamp: userData.FCM?.timestamp?.toDate().getTime() };
					}
					dispatch(setUserData(dispatchData));
					if (isLoading) setIsLoading(false);
				});
				const notificationSnapshot = onSnapshot(query(collection(firestore, "users", user.uid, "notifications"), orderBy("timestamp", "desc")), (docs) => {
					if (docs.empty) return;
					let notifications = [];
					docs.forEach((doc) => {
						const data = doc.data();
						notifications.push({ ...data, timestamp: data.timestamp?.toDate().toISOString(), id: doc.id });
					});
					console.log("notifications update", notifications);
					dispatch(setNotifications(notifications));
				});
				setSnapshots([userSnapshot, notificationSnapshot]);
			} else {
				router.push("/home")
				console.log("logging out");
				dispatch(setUserExists(false));
				dispatch(setUserData(null));
				setIsLoading(false);
			}
		});
		const pageTrace = trace(perf, route);
		pageTrace.start();
		return () => {
			pageTrace.stop();
		};
	}, []);

	useEffect(() => {
		(async () => {
			if (!userData) return;

			if (userData.FCM) {
				console.log(userData.FCM?.timestamp);
				if (new Date().getTime() - userData.FCM?.timestamp > 2 * 7 * 24 * 60 * 60 * 1000) setFCM();
			} else {
				await setFCM();
			}
		})();
	}, [userData]);

	useEffect(() => {
		if (!userExists && snapshots.length) {
			snapshots.forEach((snapshot) => snapshot());
			setSnapshots([]);
		}
		return () => {
			snapshots.forEach((snapshot) => snapshot());
		};
	}, [userExists, snapshots]);

	return (
		<div>
			{!pageLoaded && (
				<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
					<CircularProgress color="inherit" />
				</Backdrop>
			)}
			{props.children}
		</div>
	);
}

export default MiddleComponent;
