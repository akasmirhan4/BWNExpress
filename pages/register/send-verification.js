import { ArrowBack, ArrowForward, FamilyRestroomRounded } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Link, IconButton, Grid, MenuItem, Checkbox, FormHelperText } from "@mui/material";
import styles from "../../styles/main.module.scss";
import { UserContext } from "../../lib/context";
import { useContext, useEffect, useState } from "react";
import router from "next/router";
import Link2 from "next/link";
import toast from "react-hot-toast";
import { auth, firestore, storage } from "../../lib/firebase";

export default function SendVerification(params) {
	const { user, loading, userData } = useContext(UserContext);
	const [isUploadingLater, setIsUploadingLater] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState(null);
	const [isValid, setIsValid] = useState(true);
	const TIMER = 20;
	const [counter, setCounter] = useState(TIMER);
	const [startTimer, setStartTimer] = useState(false);

	useEffect(() => {
		(async () => {
			if (!loading) {
				if (user && userData) {
					if (user.emailVerified) {
						toast.error("Your email already verified");
						const { userVerifiedLevel, verified } = userData;
						if (userVerifiedLevel < 1) {
							router.push("/register/new-user");
						} else if (verified.IC !== true) {
							router.push("/register/upload-ic");
						} else {
							router.push("/dashboard");
						}
					} else {
						// setStartTimer(true);
						// toast.success("Verification link has been sent to your email", { style: { textAlign: "center" } });
					}
				} else {
					toast("Redirecting...");
					router.push("/home");
				}
			}
		})();
	}, [loading, user, userData]);

	useEffect(() => {
		if (!startTimer) return;
		if (!counter) return;
		const timeOut = setTimeout(() => {
			if (counter - 1 > 0) {
				setCounter(counter - 1);
			} else {
				setStartTimer(false);
				setCounter(TIMER);
			}
		}, 1000);

		return () => {
			if (!startTimer) return;
			clearTimeout(timeOut);
		};
	}, [startTimer, counter]);

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
					<Button
						sx={{ minWidth: "16em", color: "#FFFFFF" }}
						variant="contained"
						disabled={startTimer}
						className={styles.dropShadow}
						onClick={() => {
							auth.currentUser.sendEmailVerification({ url: "http://localhost:3000//register/complete-verification", handleCodeInApp: true }).then(() => {
								// The link was successfully sent. Inform the user.
								// Save the email locally so you don't need to ask the user for it again
								// if they open the link on the same device.
								window.localStorage.setItem("emailForSignIn", auth.currentUser.email);
								// ...
								setStartTimer(true);
								toast.success("Verification link has been sent to your email", { style: { textAlign: "center" } });
							});
						}}
					>
						{startTimer ? counter : "Send Verification"}
					</Button>
				</Container>
			</Box>
		</Box>
	);
}
