import GoogleGLogo from "./GoogleGLogo";
import { auth, firestore, googleAuthProvider } from "lib/firebase";
import toast from "react-hot-toast";
import { Button, Box } from "@mui/material";

export default function GoogleSignInBtn(params) {
	return (
		<Button
			variant="contained"
			fullWidth
			sx={{
				":hover": {
					bgcolor: "#4285F4",
					color: "#FFFFFF",
				},
				maxWidth: 384,
				borderRadius: 1,
				mt: "2em",
				color: "text.main",
				p: "1px",
				bgcolor: "#FFFFFF",
				justifyContent: "flex-start",
				fontSize: "0.8rem",
				alignItems: "center",
				display: "flex",
				mb: 2,
				boxShadow: (theme) => theme.shadows[1],
			}}
			onClick={() => {
				toast
					.promise(
						auth.signInWithPopup(googleAuthProvider).then(({ user, additionalUserInfo }) => {
							firestore.collection("users").doc(user.uid).get();
						}),
						{
							loading: "Awaiting to sign in...",
							success: "Signed In 👌",
							error: "Unsuccessful",
						}
					)
					.catch(console.warn);
			}}
			startIcon={
				<Box
					sx={{
						mr: "12px",
						bgcolor: "#FFFFFF",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						p: 1,
						ml: "4px",
						borderRadius: 1,
						fontSize: "0.8rem",
					}}
				>
					<GoogleGLogo size={24} />
				</Box>
			}
		>
			Continue With Google
		</Button>
	);
}
