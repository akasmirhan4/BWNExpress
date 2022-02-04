import { auth } from "lib/firebase";
import router from "next/router";
import toast from "react-hot-toast";

export function routeManager(userData, route, role) {
	if (!["auth", "member", "moderator", "employee"].includes(route.split("/")[1])) return;
	let redirect;
	if (auth.currentUser) {
		if (auth.currentUser.emailVerified) {
			if (userData) {
				const { userVerifiedLevel } = userData;
				if (userVerifiedLevel < 1) {
					redirect = "/auth/register/new-user";
				} else if (userVerifiedLevel < 1.5) {
					redirect = "/auth/register/upload-ic";
				} else {
					if (route.split("/")[1] === "moderator") {
						if (role !== "moderator") {
							redirect = "/member/dashboard";
						}
					} else if (route.split("/")[1] === "employee") {
						if (role !== "moderator" && role !== "employee") {
							redirect = "/member/dashboard";
						}
					} else if (route.split("/")[1] !== "member") {
						redirect = "/member/dashboard";
					} else if (route.split("/")[1] == "member") {
						const secondDirectory = route.split("/")[2];
						if (secondDirectory == "upload-ic") {
							if (["pending", true].includes(userData.verified.IC)) {
								redirect = "/member/dashboard";
							}
						}
					}
				}
			} else {
				redirect = "/auth/register/new-user";
			}
		} else {
			redirect = "/auth/register/send-verification";
		}
	} else {
		if (!["/auth/login", "/auth/register", "/auth/forget-password"].includes(route)) redirect = "/home";
	}

	if (!redirect) return;
	if (route == redirect) return;
	console.log({ route, redirect });
	if (route == "/auth/register/new-user" && redirect == "/auth/register/upload-ic") return;
	router.push(redirect);
	toast("Redirecting...", { duration: 1500 });
}
