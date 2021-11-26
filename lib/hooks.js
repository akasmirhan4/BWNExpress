import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { auth, firestore } from "../lib/firebase";

export function useUserData() {
	const [user, loading] = useAuthState(auth);
	const [userData, setUserData] = useState(null);
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		if (user) {
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
		}
	}, [user]);
	return { user, loading: loading || !dataLoaded, userData };
}
