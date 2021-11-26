import { FacebookRounded } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Link } from "@mui/material";
import LandingTopbar from "../components/LandingTopbar";
import styles from "../styles/main.module.scss";
import Link2 from "next/link";
import GoogleGLogo from "../components/GoogleGLogo";
import { UserContext } from "../lib/context";
import { useContext, useEffect, useState } from "react";
import router from "next/router";
import GoogleSignInBtn from "../components/GoogleSignInBtn";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

export default function Login(params) {
	const { user, loading, userData } = useContext(UserContext);
	useEffect(() => {
		if (!loading) {
			if (user) {
				const { userVerifiedLevel } = userData || {};
				if (!userVerifiedLevel) {
					router.push("/register/new-user");
				} else {
					router.push("/dashboard");
				}
			}
		}
	}, [loading, user, userData]);

	return (
		<Box>
			<LandingTopbar bgcolor="transparent" />
			<LoginContainer pt={"4em"} />
		</Box>
	);
}

function LoginContainer(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	return (
		<Box
			{...props}
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			display="flex"
			sx={{ background: "url(svgs/background.svg) no-repeat", backgroundSize: "cover" }}
		>
			<Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
				<Typography sx={{ textTransform: "uppercase", fontSize: "2.4rem", letterSpacing: "0.1em", color: "#FFFFFF", fontWeight: 800, lineHeight: "1em" }}>
					Welcome Back
				</Typography>
				<Typography sx={{ textTransform: "uppercase", fontSize: "1.8rem", color: "#FFFFFF", letterSpacing: "0.22em", fontWeight: 800, mb: "1.2em", ml: "4px" }}>
					Selamat Kembali
				</Typography>
				<TextField
					label="Email"
					type="email"
					InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
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
					InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
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
					sx={{ maxWidth: 384, borderRadius: 2, mt: "2em", color: "#FFFFFF", py: 1.5, fontWeight: "800", fontSize: "1rem" }}
					color="secondary"
					fullWidth
					className={styles.dropShadow}
					onClick={async () => {
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
							const methods = await auth.fetchSignInMethodsForEmail(email).catch((error) => {
								console.log(error);
								switch (error.code) {
									case "auth/invalid-email":
										setEmailError("The email address is badly formatted");
										break;
									default:
										break;
								}
							});
							if (methods.includes("google.com")) {
								toast.error("You registered with Google. Continue With Google instead");
							}
							if (!methods.length) {
								const response = await auth.signInWithEmailAndPassword(email, password).catch((error) => {
									console.log(error);
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
									console.log(JSON.stringify(error));
								});
								console.log(response);
							}
						}
					}}
				>
					Log In
				</Button>
				<Box width="100%" maxWidth="384px" justifyContent="flex-end" display="flex">
					<Link color="#FFFFFF" fontWeight="bold" my="0.8em">
						Forget Password
					</Link>
				</Box>

				<GoogleSignInBtn />
				<Button
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
					}}
					fullWidth
					className={styles.dropShadow}
				>
					<FacebookRounded fontSize="large" sx={{ mr: 3, ml: -0.5 }} />
					Continue with Facebook
				</Button>
				<Box maxWidth={384}>
					<Typography variant="body2" my="2em" sx={{ color: "#FFFFFF" }}>
						By logging in, you agree to our Membership Agreement and to receive BWNEXPRESS emails and updates.
					</Typography>
					<Typography variant="body2" sx={{ color: "#FFFFFF" }}>
						Not a member yet?{" "}
						<Link2 href="/register" prefetch={false}>
							<Link color="#FFFFFF" sx={{ fontWeight: 700 }}>
								Sign Up
							</Link>
						</Link2>
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
