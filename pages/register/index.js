import { FacebookRounded } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Link } from "@mui/material";
import LandingTopbar from "../../components/LandingTopbar";
import styles from "../../styles/main.module.scss";

import { UserContext } from "../../lib/context";
import { useContext, useEffect } from "react";
import router from "next/router";
import GoogleSignInBtn from "../../components/GoogleSignInBtn";
import { auth, FacebookAuthProvider } from "../../lib/firebase";

export default function Register(params) {
	const { user, loading, userData } = useContext(UserContext);
	useEffect(() => {
		if (!loading) {
			if (user) {
				console.log({ user });
				console.log({ userData });
				const { IC, address, age, deliveryAddress, fullName, gender, phoneNo, preferredName } = userData;
				if (!IC || !address || !age || !deliveryAddress || !fullName || !gender || !phoneNo || !preferredName) {
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
					className={styles.dropShadow}
				>
					<Box px={8} py={4} display="flex" flexDirection="column">
						<Typography
							sx={{
								textTransform: "uppercase",
								fontSize: "3.7rem",
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
								fontSize: "2.15rem",
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
							inputProps={{ sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputLabelProps={{ sx: { color: "text.secondary" } }}
							fullWidth
							sx={{ maxWidth: 384, borderRadius: 2, mb: 2 }}
							className={styles.dropShadow}
							variant="filled"
							color="secondary"
							margin="dense"
						/>
						<TextField
							label="Password"
							type="password"
							inputProps={{ sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputLabelProps={{ sx: { color: "text.secondary" } }}
							fullWidth
							sx={{ maxWidth: 384, borderRadius: 2 }}
							className={styles.dropShadow}
							variant="filled"
							color="secondary"
							margin="dense"
						/>
						<TextField
							label="Verify Password"
							type="password"
							inputProps={{ sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputLabelProps={{ sx: { color: "text.secondary" } }}
							fullWidth
							sx={{ maxWidth: 384, borderRadius: 2 }}
							className={styles.dropShadow}
							variant="filled"
							color="secondary"
							margin="dense"
						/>
						<Button
							variant="contained"
							sx={{ maxWidth: 384, borderRadius: 2, mt: "2em", color: "#FFFFFF", py: 1.5, fontWeight: "800", fontSize: "1rem" }}
							color="secondary"
							fullWidth
							className={styles.dropShadow}
						>
							Register
						</Button>
						<Box width="100%" maxWidth="384px" justifyContent="flex-end" display="flex">
							<Link color="secondary" fontWeight="bold" my="0.8em">
								Forget Password
							</Link>
						</Box>
					</Box>
					<Box
						bgcolor="primary.main"
						width="100%"
						px={8}
						pb={4}
						display="flex"
						flexDirection="column"
						alignItems="center"
						borderTop="1px dashed"
						borderColor="secondary.main"
					>
						{/* <Typography
							variant="body2"
							fontWeight="bold"
							color="secondary"
							display="inline-flex"
							sx={{
								mt: "-1em",
								bgcolor: "#FFFFFF",
								borderColor: "secondary.main",
								borderWidth: 1,
								borderStyle: "solid",
								justifyContent: "center",
								borderRadius: 1,
								alignItems: "center",
								px: 2,
								py: 0.5,
							}}
							className={styles.dropShadow}
						>
							{"ALTERNATIVELY  👇"}
						</Typography> */}
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
							onClick={() => {
								auth.signInWithPopup(FacebookAuthProvider);
							}}
						>
							<FacebookRounded fontSize="large" sx={{ mr: 3, ml: -0.5 }} />
							Continue with Facebook
						</Button>
						<Box maxWidth={384} mt={4}>
							<Typography variant="body2" sx={{ color: "#FFFFFF", lineHeight: "1.5em" }}>
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
			</Container>
		</Box>
	);
}