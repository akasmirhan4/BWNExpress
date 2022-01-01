import { FacebookRounded } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Link } from "@mui/material";
import LandingTopbar from "components/LandingTopbar";
import Link2 from "next/link";
import { useState } from "react";
import GoogleSignInBtn from "components/GoogleSignInBtn";
import { auth } from "lib/firebase";
import toast from "react-hot-toast";

export default function Login(params) {
	return (
		<Box>
			<LandingTopbar bgColorScroll="primary.main" bgcolor="transparent" />
			<LoginContainer pt={"4em"} />
		</Box>
	);
}

function LoginContainer(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	function logIn() {
		return new Promise(async (resolve, reject) => {
			let isValid = true;
			setEmailError("");
			setPasswordError("");

			if (!email) {
				isValid = false;
				setEmailError("Please enter an email address");
			}
			if (!password) {
				isValid = false;
				setPasswordError("Please enter a password");
			} else if (password.length < 6) {
				isValid = false;
				setPasswordError("Passwords are 6 characters min");
			}
			if (isValid) {
				await auth
					.signInWithEmailAndPassword(email, password)
					.then(resolve)
					.catch((error) => {
						switch (error.code) {
							case "auth/invalid-email":
								setEmailError("The email address is badly formatted");
								break;
							case "auth/user-not-found":
								setEmailError("No user exist. Register instead if you are new");
								break;
							case "auth/wrong-password":
								setPasswordError("The password is invalid");
								break;
							default:
								break;
						}
						reject(error);
					});
			} else {
				reject("Form invalid");
			}
		});
	}

	return (
		<Box
			{...props}
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			display="flex"
			sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover" }}
		>
			<Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
				<Typography
					sx={{
						textTransform: "uppercase",
						fontSize: { sm: "2.4rem", xs: "1.7rem" },
						letterSpacing: "0.1em",
						color: "#FFFFFF",
						fontWeight: 800,
						lineHeight: "1em",
						textAlign: "center",
					}}
				>
					Welcome Back
				</Typography>
				<Typography
					sx={{
						textTransform: "uppercase",
						fontSize: { sm: "1.8rem", xs: "1.2rem" },
						color: "#FFFFFF",
						letterSpacing: "0.22em",
						fontWeight: 800,
						mb: "1.2em",
						ml: "4px",
						textAlign: "center",
					}}
				>
					Selamat Kembali
				</Typography>
				<TextField
					label="Email"
					type="email"
					InputProps={{
						disableUnderline: true,
						sx: { bgcolor: "offWhite.secondary", borderRadius: 2, ":hover": { bgcolor: "offWhite.secondary", opacity: 0.5 } },
					}}
					InputLabelProps={{ sx: { color: "text.secondary" } }}
					fullWidth
					sx={{ maxWidth: 384, borderRadius: 2, mb: 2 }}
					variant="filled"
					color="secondary"
					margin="dense"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					helperText={emailError}
					error={!!emailError}
				/>
				<TextField
					label="Password"
					type="password"
					InputProps={{
						disableUnderline: true,
						sx: { bgcolor: "offWhite.secondary", borderRadius: 2, ":hover": { bgcolor: "offWhite.secondary", opacity: 0.5 } },
					}}
					InputLabelProps={{ sx: { color: "text.secondary" } }}
					fullWidth
					sx={{ maxWidth: 384, borderRadius: 2 }}
					variant="filled"
					color="secondary"
					margin="dense"
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					helperText={passwordError}
					error={!!passwordError}
				/>
				<Button
					variant="contained"
					sx={{
						maxWidth: 384,
						borderRadius: 2,
						mt: "2em",
						py: 1.5,
						fontWeight: "800",
						fontSize: "1rem",
					}}
					color="secondary"
					fullWidth
					onClick={() => {
						toast.promise(logIn(), { success: "Logged In", loading: "Logging In...", error: "Error Logging In" });
					}}
				>
					Log In
				</Button>
				<Box width="100%" maxWidth="384px" justifyContent="flex-end" display="flex">
					<Link2 href="/auth/forget-password" passHref>
						<Link color="white.main" fontWeight="bold" my="0.8em">
							Forget Password
						</Link>
					</Link2>
				</Box>

				<GoogleSignInBtn />
				<Button
					disabled={true}
					sx={{
						":hover": {
							bgcolor: "#1877F2",
							color: "#FFFFFF",
						},
						borderRadius: 1,
						width: "100%",
						color: "#1877F2",
						bgcolor: "#FFFFFF",
						px: 1,
						py: 0.5,
						maxWidth: 384,
						alignItems: "center",
						display: "flex",
						justifyContent: "flex-start",
						textTransform: "uppercase",
						fontSize: "0.8rem",
						boxShadow: (theme) => theme.shadows[1],
					}}
					fullWidth
				>
					<FacebookRounded fontSize="large" sx={{ mr: 3, ml: -0.5 }} />
					In Progress
				</Button>
				<Box maxWidth={384}>
					<Typography variant="body2" my="2em" sx={{ color: "#FFFFFF", textAlign: { sm: "left", xs: "center" } }}>
						By logging in, you agree to our Membership Agreement and to receive BWNEXPRESS emails and updates.
					</Typography>
					<Typography variant="body2" sx={{ color: "#FFFFFF", textAlign: { sm: "left", xs: "center" } }}>
						Not a member yet?{" "}
						<Link2 href="/auth/register">
							<Link color="#FFFFFF" sx={{ fontWeight: 700, cursor: "pointer" }}>
								Sign Up
							</Link>
						</Link2>
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
