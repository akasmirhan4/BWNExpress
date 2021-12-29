import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/functions";

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

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.app().functions("asia-southeast1");

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters({ prompt: "select_account" });
export const FacebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export const EmailAuthProvider = firebase.auth.EmailAuthProvider;

export const getUserData = async () => {
	if (!auth.currentUser) return;
	const doc = await firestore.collection("users").doc(auth.currentUser.uid).get();
	if (!doc.exists) return;
	return doc.data();
};

export const getOrders = async () => {
	if (!auth.currentUser) return;
	const docs = await firestore.collection("users").doc(auth.currentUser.uid).collection("orders").get();
	if (docs.empty) return;
	let batchPromises = [];
	docs.forEach((doc) => {
		const { orderRef } = doc.data();
		batchPromises.push(orderRef.get());
	});
	const results = await Promise.all(batchPromises);
	const orders = results.map((result) => result.data());
	return orders;
};

export const getOrder = async (orderID) => {
	if (!auth.currentUser) return;
	try {
		const doc = await firestore.collection("allOrders").doc(orderID).get();
		if (!doc.exists) return;
		return doc.data();
	} catch {
		return;
	}
};

export const getReceiptURL = async (orderID) => {
	if (!auth.currentUser) return;
	try {
		const receiptRef = storage.ref().child(`/users/${auth.currentUser.uid}/receipts/${orderID}`);
		const url = await receiptRef.getDownloadURL();
		return url;
	} catch {
		return;
	}
};
