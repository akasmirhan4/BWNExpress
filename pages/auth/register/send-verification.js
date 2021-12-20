
import { Box, Container, Button } from "@mui/material";
import styles from "../../../styles/main.module.scss";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth } from "../../../lib/firebase";
import { useSelector } from "react-redux";
import { selectUser, selectUserData } from "lib/slices/userSlice";

export default function SendVerification(params) {
	const TIMER = 20;
	const [counter, setCounter] = useState(TIMER);
	const [startTimer, setStartTimer] = useState(false);

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
							auth.currentUser.sendEmailVerification({ url: "http://localhost:3000/auth/register/complete-verification", handleCodeInApp: true }).then(() => {
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
