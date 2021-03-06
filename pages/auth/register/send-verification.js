import { Box, Container, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth, firestore } from "lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";
import { useRouter } from "next/router";
import RegisterSteppers from "components/RegisterSteppers";
import { doc, updateDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";

export default function SendVerification(params) {
	const TIMER = 20;
	const router = useRouter();
	const [counter, setCounter] = useState(TIMER);
	const [startTimer, setStartTimer] = useState(false);
	const userData = useSelector(selectUserData);
	const dispatch = useDispatch();

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

	useEffect(() => {
		if (userData?.verified?.email) {
			router.push("/auth/register/new-user");
		}
	}, [userData]);

	useEffect(() => {
		let checkForVerifiedInterval = setInterval(() => {
			auth.currentUser.reload();
			if (auth.currentUser.emailVerified) {
				(async () => {
					console.log("verified!");
					await updateDoc(doc(firestore, "users", auth.currentUser.uid), { "verified.email": true });
					router.push("/auth/register/new-user");
				})();
			}
		}, 1000);
		return () => {
			clearInterval(checkForVerifiedInterval);
		};
	}, []);

	return (
		<Box pt={2} minHeight="100vh" display="flex" sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover", backgroundColor: "grey" }}>
			<Container sx={{ display: "flex", flexDirection: "column" }}>
				<RegisterSteppers sx={{ my: 4 }} activestep={0} />
				<Box
					bgcolor="white.main"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					borderRadius={4}
					overflow="hidden"
					my={4}
					width="100%"
					sx={{ boxShadow: (theme) => theme.shadows[1] }}
					mt={4}
					mb={8}
				>
					<Box sx={{ px: { sm: 4, xs: 2 } }} py={4} display="flex" flexDirection="column" width="100%">
						<Typography
							textAlign="center"
							sx={{
								textTransform: "uppercase",
								fontSize: { xs: "1em", sm: "1.3rem", md: "1.8rem" },
								color: "secondary.main",
								fontWeight: 800,
								lineHeight: "1.25em",
								whiteSpace: "pre-wrap",
							}}
						>
							{`Verify Your Email to Continue`}
						</Typography>
						<Typography textAlign="center" variant="caption" sx={{ mt: 1, mb: 2 }}>
							{startTimer ? "Check your email" : "Click the button below and we will send a link to your email"}
						</Typography>
						<Button
							sx={{ minWidth: "16em", color: "white.main", boxShadow: (theme) => theme.shadows[1] }}
							variant="contained"
							disabled={startTimer}
							onClick={() => {
								sendEmailVerification(auth.currentUser, { url: `${process.env.NEXT_URL}/auth/register/new-user`, handleCodeInApp: true }).then(() => {
									setStartTimer(true);
									toast.success("Verification link has been sent to your email", { style: { textAlign: "center" } });
								});
							}}
						>
							{startTimer ? counter : "Send Verification"}
						</Button>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
