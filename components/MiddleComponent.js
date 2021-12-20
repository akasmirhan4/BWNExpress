import React, { useEffect, useState } from "react";
import { auth, getUserData } from "lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, selectUserData, setUser, setUserData } from "lib/slices/userSlice";
import { routeManager } from "lib/routeManager";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";

function MiddleComponent(props) {
	const [lang, setLang] = useState("EN");
	const userData = useSelector(selectUserData);
	const [isLoading, setIsLoading] = useState(true);
	const user = useSelector(selectUser);
	const { route } = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		setLang(cookieCutter.get("lang") ?? "EN");
	}, [lang]);

	useEffect(() => {
		if (!isLoading) routeManager(user, userData, route);
	}, [route, userData, user, isLoading]);

	useEffect(() => {
		auth.onAuthStateChanged(async (user) => {
            setIsLoading(true);
			console.log("user change: ", !!user);
			dispatch(setUser({ uid: user?.uid, emailVerified: user?.emailVerified }));
			let _userData;
			if (user) {
				_userData = await getUserData();
				dispatch(setUserData(_userData));
			}
            setIsLoading(false);
		});
	}, []);

	return <div>{props.children}</div>;
}

export default MiddleComponent;
