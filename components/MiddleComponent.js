import React, { useEffect, useState } from "react";
import { auth, firestore, getAvatarURL, perf } from "lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { selectUserData, selectUserExists, setAvatarURL, setNotifications, setUserData, setUserExists } from "lib/slices/userSlice";
import { routeManager } from "lib/routeManager";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import { Backdrop, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

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
		const trace = perf.trace(route);
		trace.start();
		return () => {
			trace.stop();
		};
	}, [route, userData, auth.currentUser, isLoading]);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			setIsLoading(true);
			console.log("user update", user);
			if (user) {
				dispatch(setUserExists(true));
				dispatch(setAvatarURL(await getAvatarURL()));
				const userSnapshot = firestore
					.collection("users")
					.doc(user.uid)
					.onSnapshot((doc) => {
						const userData = doc.data();
						console.log("userData update", userData);
						dispatch(setUserData({ ...userData, creationDate: userData?.creationDate.toDate().toISOString() }));
						if (isLoading) setIsLoading(false);
					});
				const notificationSnapshot = firestore
					.collection("users")
					.doc(user.uid)
					.collection("notifications")
					.onSnapshot((docs) => {
						if (docs.empty) return;
						let notifications = [];
						docs.forEach((doc) => {
							const data = doc.data();
							notifications.push({ ...data, timestamp: data.timestamp.toDate().toISOString(), id: doc.id });
						});
						console.log("notifications update", notifications);
						dispatch(setNotifications(notifications));
					});
				setSnapshots([userSnapshot, notificationSnapshot]);
			} else {
				console.log("logging out");
				dispatch(setUserExists(false));
				dispatch(setUserData(null));
				setIsLoading(false);
			}
		});
	}, []);

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
