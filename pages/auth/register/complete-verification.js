import { Typography, Box, Container, Button } from "@mui/material";
import styles from "../../../styles/main.module.scss";
import { useEffect, useState } from "react";
import router from "next/router";
import toast from "react-hot-toast";
import { auth, firestore } from "../../../lib/firebase";
import { useAuthCheck } from "../../../lib/hooks";

export default function CompleteVerification(params) {
	const { user, userData } = useAuthCheck();
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (user && !user.emailVerified) {
			if (auth.isSignInWithEmailLink(window.location.href)) {
				let email = window.localStorage.getItem("emailForSignIn");
				if (!email) {
					email = window.prompt("Please provide your email for confirmation");
				}
				auth
					.signInWithEmailLink(email, window.location.href)
					.then(async (result) => {
						console.log("test");
						window.localStorage.removeItem("emailForSignIn");
						console.log("test");
						await firestore.collection("users").doc(auth.currentUser.uid).update({ "verified.email": true });
						setIsValid(true);
					})
					.catch((error) => {
						if (error.code == "auth/invalid-action-code") {
							toast.error("Invalid Auth. Please ensure you use the latest email link", { style: { textAlign: "center" } });
						}
						console.log(error);

						// Some error occurred, you can inspect the code: error.code
						// Common errors could be invalid email and invalid or expired OTPs.
					})
					.finally(() => {
						setIsLoading(false);
					});
			} else {
				toast.error("Permission Denied. Missing auth", { style: { textAlign: "center" } });
				router.push("/home");
				setIsLoading(false);
			}
		}
	}, [user]);

	return (
		<Box>
			<Box
				pt={"4em"}
				minHeight="100vh"
				alignItems="center"
				justifyContent="center"
				display="flex"
				sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover", backgroundColor: "grey" }}
			>
				<Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
					<Typography>{isLoading ? "loading..." : isValid ? "User Verification Complete" : "Error verifying..."}</Typography>
					<Button
						sx={{ minWidth: "16em", color: "#FFFFFF", mt: "1em" }}
						variant="contained"
						disabled={isLoading || isValid}
						className={styles.dropShadow}
						onClick={() => {
							router.push("/auth/register/send-verification");
						}}
					>
						Send Again
					</Button>
					<Button
						sx={{ minWidth: "16em", color: "#FFFFFF", mt: "1em" }}
						variant="contained"
						disabled={!isValid}
						className={styles.dropShadow}
						onClick={() => {
							console.log(auth.currentUser.emailVerified);
							router.push("/auth/register/new-user");
						}}
					>
						Continue
					</Button>
				</Container>
			</Box>
		</Box>
	);
}
