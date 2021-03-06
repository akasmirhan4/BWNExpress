import { FacebookRounded } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Link } from "@mui/material";
import LandingTopbar from "components/LandingTopbar";
import Link2 from "next/link";

import { useState } from "react";
import GoogleSignInBtn from "components/GoogleSignInBtn";
import { auth, facebookAuthProvider } from "lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register(params) {
	return (
		<Box>
			<LandingTopbar bgColorScroll="primary.main" bgcolor="transparent" />
			<RegisterContainer pt={"4em"} />
		</Box>
	);
}

function RegisterContainer(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [verifyPassword, setVerifyPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [generalError, setGeneralError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [verifyPasswordError, setVerifyPasswordError] = useState("");

	return (
		<Box
			{...props}
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			display="flex"
			sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover" }}
		>
			<Container disableGutters>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
					<Box
						bgcolor="#FFFFFF"
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						borderRadius={4}
						overflow="hidden"
						mt={4}
						mb={8}
						sx={{ boxShadow: (theme) => theme.shadows[1] }}
					>
						<Box sx={{ px: { sm: 4, xs: 2 } }} py={4} display="flex" flexDirection="column" width="100%">
							<Typography
								sx={{
									textTransform: "uppercase",
									fontSize: { sm: "3rem", xs: "2rem" },
									letterSpacing: "0.16em",
									color: "secondary.main",
									fontWeight: 800,
									lineHeight: "1em",
									textAlign: "center",
								}}
							>
								Welcome
							</Typography>
							<Typography
								sx={{
									textTransform: "uppercase",
									fontSize: { sm: "1.8rem", xs: "1.2rem" },
									color: "secondary.main",
									letterSpacing: "0.1em",
									fontWeight: 800,
									mb: "1.2em",
									textAlign: "center",
								}}
							>
								Selamat Datang
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
							<TextField
								label="Verify Password"
								type="password"
								InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
								InputLabelProps={{ sx: { color: "text.secondary" } }}
								fullWidth
								sx={{ maxWidth: 384, borderRadius: 2 }}
								variant="filled"
								color="secondary"
								margin="dense"
								onChange={(e) => setVerifyPassword(e.target.value)}
								value={verifyPassword}
								helperText={verifyPasswordError}
								error={!!verifyPasswordError}
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
								onClick={async () => {
									let isValid = true;
									setEmailError("");
									setPasswordError("");
									setVerifyPasswordError("");
									setGeneralError("");

									if (!email) {
										isValid = false;
										setEmailError("Please enter an email address");
									}
									if (!password) {
										isValid = false;
										setPasswordError("Please enter a password");
									}
									if (!verifyPassword) {
										isValid = false;
										setVerifyPasswordError("Please enter a second password to verify");
									}
									if (!!password && !!verifyPassword && password !== verifyPassword) {
										isValid = false;
										setPasswordError("Passwords are not the same");
										setVerifyPasswordError("Passwords are not the same");
									}

									if (isValid) {
										const response = await createUserWithEmailAndPassword(auth, email, password).catch((error) => {
											switch (error.code) {
												case "auth/invalid-email":
													setEmailError("The email address is badly formatted");
													break;
												case "auth/weak-password":
													setPasswordError("Password should be at least 6 characters");
													break;
												case "auth/email-already-in-use":
													setEmailError("Email already in use. Try logging in instead");
													break;
												default:
													break;
											}
										});
									}
								}}
							>
								Sign Up
							</Button>
						</Box>
						<Box
							bgcolor="primary.main"
							width="100%"
							sx={{ px: { sm: 4, xs: 2 } }}
							pb={4}
							display="flex"
							flexDirection="column"
							alignItems="center"
							borderTop="1px dashed"
							borderColor="secondary.main"
						>
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
								onClick={() => {
									auth.signInWithPopup(facebookAuthProvider);
								}}
							>
								<FacebookRounded fontSize="large" sx={{ mr: 3, ml: -0.5 }} />
								In Progress
							</Button>
							<Box maxWidth={384} mt={4}>
								<Typography variant="body2" sx={{ color: "#FFFFFF", lineHeight: "1.5em", textAlign: { xs: "center", sm: "left" } }}>
									{"By clicking continue, you agree to our "}
									<Link color="secondary" sx={{ fontWeight: 700 }}>
										{"Membership Agreement"}
									</Link>
									{" & "}
									<Link color="secondary" sx={{ fontWeight: 700 }}>
										{"Terms & Conditions"}
									</Link>
									{" and to receive BWNEXPRESS emails and updates."}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
