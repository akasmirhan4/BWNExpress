import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getPerformance } from "firebase/performance";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, EmailAuthProvider } from "firebase/auth";
import toast from "react-hot-toast";

const firebaseConfig = {
	apiKey: "AIzaSyDQlyaZdyKomZCwJddA1fxm31ZQK6kDOcw",
	authDomain: "bwnexpress-website.firebaseapp.com",
	databaseURL: "https://bwnexpress-website-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "bwnexpress-website",
	storageBucket: "bwnexpress-website.appspot.com",
	messagingSenderId: "804874832937",
	appId: "1:804874832937:web:6834f965b75d8739932038",
	measurementId: "G-SXBTECSH1Y",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "asia-southeast1");
export const perf = getPerformance(app);

export const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
	console.log("Message received. ", payload);
	// ...
});

export const googleAuthProvider = new GoogleAuthProvider().setCustomParameters({ prompt: "select_account" });
export const facebookAuthProvider = new FacebookAuthProvider();
export const emailAuthProvider = new EmailAuthProvider();

export const getUserData = async () => {
	if (!auth.currentUser) return;
	const _doc = await getDoc(doc(firestore, "users", auth.currentUser.uid));
	if (!_doc.exists) return;
	return _doc.data();
};

export const getOrders = async () => {
	if (!auth.currentUser) return;
	const docs = await getDocs(collection(firestore, "users", auth.currentUser.uid, "orders"));
	if (docs.empty) return;
	let batchPromises = [];
	docs.forEach((_doc) => {
		const { orderRef } = _doc.data();
		batchPromises.push(getDoc(orderRef));
	});
	const results = await Promise.all(batchPromises);
	const orders = results.map((result) => result.data());
	return orders;
};

export const getOrder = async (orderID) => {
	if (!auth.currentUser) return;
	try {
		console.log("test");
		const _doc = await getDoc(doc(firestore, "allOrders", orderID));
		console.log(_doc.exists);
		if (!_doc.exists) return;
		return _doc.data();
	} catch (err) {
		console.warn(err);
		return;
	}
};

export const getTransactions = async () => {
	if (!auth.currentUser) return;
	const docs = await getDocs(collection(firestore, "users", auth.currentUser.uid, "transactions"));
	if (docs.empty) return;
	let batchPromises = [];
	docs.forEach((_doc) => {
		const { orderRef } = _doc.data();
		batchPromises.push(getDoc(orderRef));
	});
	const results = await Promise.all(batchPromises);
	const transactions = results.map((result) => result.data());
	return transactions;
};

export const getTransaction = async (transactionID) => {
	if (!auth.currentUser) return;
	try {
		const _doc = await getDoc(_doc(firestore, "users", auth.currentUser.uid, "transactions", transactionID));
		if (!_doc.exists) return;
		return _doc.data();
	} catch {
		return;
	}
};

export const getPendingPayments = async () => {
	if (!auth.currentUser) return;
	try {
		const docs = await getDocs(query(collection(firestore, "users", auth.currentUser.uid, "pendingPayments"), orderBy("timestamp", "asc")));
		if (docs.empty) return;
		let pendingPayments = [];
		docs.forEach((doc) => {
			pendingPayments.push(doc.data());
		});
		return pendingPayments;
	} catch (err) {
		console.error(err);
		return;
	}
};

export const getPendingActionOrders = async () => {
	if (!auth.currentUser) return [];
	try {
		const orders = await getOrders();
		if (orders?.length > 0) {
			return orders.filter((order) => order.status == "pendingAction");
		}
		return [];
	} catch {
		return [];
	}
};

export const getNotifications = async () => {
	if (!auth.currentUser) return;
	try {
		const docs = await getDocs(query(collection(firestore, "users", auth.currentUser.uid, "notifications"), orderBy("timestamp", "desc")));
		if (docs.empty) return [];
		let notifications = [];
		docs.forEach((doc) => {
			notifications.push({ ...doc.data(), id: doc.id });
		});
		return notifications;
	} catch (err) {
		console.error(err);
		return;
	}
};

export const seeNotification = async (notificationID) => {
	if (!auth.currentUser) return;
	try {
		await updateDoc(doc(firestore, "users", auth.currentUser.uid, "notifications", notificationID), { seen: true });
	} catch (err) {
		console.warn(err);
		return;
	}
};

export const archiveNotification = async (notificationID, setArchived = true) => {
	if (!auth.currentUser) return;
	try {
		await updateDoc(doc(firestore, "users", auth.currentUser.uid, "notifications", notificationID), { seen: true, archived: setArchived });
	} catch (err) {
		console.warn(err);
		return;
	}
};

export const getLogTracker = async (orderID) => {
	if (!auth.currentUser) return;
	const docs = await getDocs(query(collection(firestore, "allOrders", orderID, "logTracker"), orderBy("timestamp", "desc")));
	if (docs.empty) return;
	let logs = [];
	docs.forEach((doc) => {
		logs.push(doc.data());
	});
	return logs;
};

export const getReceiptURL = async (orderID) => {
	if (!auth.currentUser) return;
	try {
		return await getDownloadURL(ref(storage, `/users/${auth.currentUser.uid}/receipts/${orderID}`));
	} catch {
		return null;
	}
};

export const getAvatarURL = async () => {
	if (!auth.currentUser) return;
	try {
		return await getDownloadURL(ref(storage, `/users/${auth.currentUser.uid}/profile/avatar`));
	} catch {
		return null;
	}
};

export const setFCM = async () => {
	console.log("updating fcm");
	await getToken(messaging, { vapidKey: process.env.VAPID_KEY })
		.then(async (currentToken) => {
			if (currentToken) {
				console.log(currentToken);
				await updateDoc(doc(firestore, "users", auth.currentUser.uid), { FCM: { token: currentToken, timestamp: serverTimestamp() } });
				console.log("sent to server...");
				return true;
			} else {
				// Show permission request UI
				console.log("No registration token available. Request permission to generate one.");
				return false;
				// ...
			}
		})
		.catch((err) => {
			console.log(JSON.stringify(err));
			if (err.code == "messaging/permission-blocked") {
				toast.error("Notification is blocked. Unblock by changing the permissions in your browser settings", { icon: "😢" });
			}
			console.log("An error occurred while retrieving token. ", err);
			// ...
			return false;
		});
};
