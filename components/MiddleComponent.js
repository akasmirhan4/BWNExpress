import React, { useEffect, useState } from "react";
import { auth, firestore, getAvatarURL, getUserData, perf } from "lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectUserData, setAvatarURL, setNotifications, setUser, setUserData } from "lib/slices/userSlice";
import { routeManager } from "lib/routeManager";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import { Backdrop, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

function MiddleComponent(props) {
	const [lang, setLang] = useState("EN");
	const userData = useSelector(selectUserData);
	const [isLoading, setIsLoading] = useState(true);
	const [cacheHas, setCacheHas] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const user = useSelector(selectUser);
	const router = useRouter();
	const { route } = router;
	const dispatch = useDispatch();

	useEffect(() => {
		setLang(cookieCutter.get("lang") ?? "EN");
	}, [lang]);

	useEffect(() => {
		if (!isLoading) {
			routeManager(user, userData, route);
			setPageLoaded(true);
		} else {
			setPageLoaded(false);
		}
		const trace = perf.trace(route);
		trace.start();
		return () => {
			trace.stop();
		};
	}, [route, userData, user, isLoading]);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
			setIsLoading(true);
			dispatch(setUser({ uid: user?.uid, emailVerified: user?.emailVerified }));
			if (user) {
				dispatch(setAvatarURL(await getAvatarURL()));
				firestore
					.collection("users")
					.doc(user.uid)
					.onSnapshot((doc) => {
						const userData = doc.data();
						console.log("userData update", userData);
						dispatch(setUserData(userData));
						if (isLoading) setIsLoading(false);
					});
				firestore
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
			} else {
				setIsLoading(false);
			}
		});
	}, []);

	return !pageLoaded ? (
		<div>
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	) : (
		<div>{props.children}</div>
	);
}

export default MiddleComponent;
