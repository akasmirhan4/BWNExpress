import { useEffect, useState } from "react";
import { auth, firestore } from "lib/firebase";
import router from "next/router";
import toast from "react-hot-toast";

export function routeManager(user, userData, route) {
	if (!["auth", "member"].includes(route.split("/")[1])) return;
	let redirect;
	console.log({ user: !!user?.uid, userData: !!userData, route });
	if (user?.uid) {
		if (user.emailVerified) {
			if (userData) {
				const { userVerifiedLevel, verified } = userData;
				if (userVerifiedLevel < 1) {
					redirect = "/auth/register/new-user";
				} else if (userVerifiedLevel < 1.5) {
					redirect = "/auth/register/upload-ic";
				} else {
					if (route.split("/")[1] !== "member") redirect = "/member/dashboard";
				}
				if (!verified.email) {
					console.log("verifying email");
					firestore.collection("users").doc(auth.currentUser.uid).update({ "verified.email": true });
				}
				if (route == "/member/upload-ic") {
					if (["pending", true].includes(userData.verified.IC)) {
						redirect = "/member/dashboard";
					}
				}
			} else {
				redirect = "/auth/register/new-user";
			}
		} else {
			if (route !== "/auth/register/complete-verification") redirect = "/auth/register/send-verification";
		}
	} else {
		if (!["/auth/login", "/auth/register"].includes(route)) redirect = "/home";
	}

	console.log({ route, redirect });
	if (!redirect) return;
	if (route == redirect) return;
	router.push(redirect);
	toast("Redirecting...", { duration: 1500 });
}
