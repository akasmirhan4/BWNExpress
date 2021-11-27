import { useAuthState } from "react-firebase-hooks/auth";
import { useContext, useEffect, useState } from "react";
import { auth, firestore } from "../lib/firebase";
import { UserContext } from "./context";
import router, { useRouter } from "next/router";
import toast from "react-hot-toast";

export function useUserData() {
	const [user, setUser] = useState(auth.currentUser);
	const [userData, setUserData] = useState(null);
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setUser(user);
				setDataLoaded(false);
				firestore
					.collection("users")
					.doc(user.uid)
					.get()
					.then((doc) => {
						if (!doc.exists) return;
						const userData = doc.data();
						setUserData(userData);
						setDataLoaded(true);
					});
			} else {
				setUserData(null);
				setDataLoaded(true);
				console.log("no user detected");
				setUser(null);
			}
		});
	}, []);
	return { user, loading: !dataLoaded, userData };
}

export function useAuthCheck() {
	const { user, loading, userData } = useContext(UserContext);
	const { route } = useRouter();

	useEffect(() => {
		(async () => {
			let redirect;
			if (!loading) {
				if (user) {
					if (auth.currentUser.emailVerified) {
						if (userData) {
							const { userVerifiedLevel, verified } = userData;
							if (userVerifiedLevel < 1) {
								redirect = "/register/new-user";
							} else if (verified.IC !== true) {
								redirect = "/register/upload-ic";
							} else {
								redirect = "/dashboard";
							}
						}
					} else {
						if (route !== "/register/complete-verification") redirect = "/register/send-verification";
					}
				} else {
					redirect = "/home";
				}
			}
			if (!redirect) return;
			if (route == redirect) return;
			if (["/login", "/register"].includes(route)) {
				if (redirect == "/home") return;
			}
			console.log({ route, redirect });
			router.push(redirect);
			toast("Redirected");
		})();
	}, [loading, user, userData]);

	return { loading, user, userData };
}
