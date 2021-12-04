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
					if (user.emailVerified) {
						if (userData) {
							console.log(userData);
							const { userVerifiedLevel, verified } = userData;
							if (userVerifiedLevel < 1) {
								redirect = "/auth/register/new-user";
							} else if (userVerifiedLevel < 1.5) {
								redirect = "/auth/register/upload-ic";
							} else {
								redirect = "/member/dashboard";
							}
							if (!verified.email) {
								console.log("verifying email");
								firestore.collection("users").doc(auth.currentUser.uid).update({ "verified.email": true });
							}
						}
					} else {
						if (route !== "/auth/register/complete-verification") redirect = "/auth/register/send-verification";
					}
				} else {
					redirect = "/home";
				}
			}
			console.log({ route, redirect });
			if (!redirect) return;
			if (route == redirect) return;
			if (["/auth/login", "/auth/register"].includes(route)) {
				if (redirect == "/home") return;
			}
			router.push(redirect);
			toast("Redirected");
		})();
	}, [loading, user, userData]);

	return { loading, user, userData };
}
