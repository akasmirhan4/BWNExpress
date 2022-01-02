importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js");

firebase.initializeApp({
	apiKey: "AIzaSyDQlyaZdyKomZCwJddA1fxm31ZQK6kDOcw",
	authDomain: "bwnexpress-website.firebaseapp.com",
	databaseURL: "https://bwnexpress-website-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "bwnexpress-website",
	storageBucket: "bwnexpress-website.appspot.com",
	messagingSenderId: "804874832937",
	appId: "1:804874832937:web:6834f965b75d8739932038",
	measurementId: "G-SXBTECSH1Y",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	console.log("[firebase-messaging-sw.js] Received background message ", payload);
	// Customize notification here
	const notificationTitle = "Repeating message";
	const notificationOptions = {
		body: "This is da body",
		icon: "/pngs/promotions/bojack-0.png",
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
