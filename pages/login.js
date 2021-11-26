import { FacebookRounded } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Link } from "@mui/material";
import LandingTopbar from "../components/LandingTopbar";
import styles from "../styles/main.module.scss";
import Link2 from "next/link";
import GoogleGLogo from "../components/GoogleGLogo";
import { UserContext } from "../lib/context";
import { useContext, useEffect } from "react";
import router from "next/router";
import GoogleSignInBtn from "../components/GoogleSignInBtn";

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
	const responseGoogle = (response) => {
		console.log(response);
	};

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
					inputProps={{ sx: { bgcolor: "#FFFFFF", borderRadius: 2 } }}
					InputProps={{ disableUnderline: true, sx: { bgcolor: "#FFFFFF", borderRadius: 2 } }}
					InputLabelProps={{ sx: { color: "text.secondary" } }}
					fullWidth
					sx={{ maxWidth: 384, borderRadius: 2 }}
					className={styles.dropShadow}
					variant="filled"
					color="primary"
					margin="dense"
				/>
				<TextField
					label="Password"
					type="password"
					inputProps={{ sx: { bgcolor: "#FFFFFF", borderRadius: 2 } }}
					InputProps={{ disableUnderline: true, sx: { bgcolor: "#FFFFFF", borderRadius: 2 } }}
					InputLabelProps={{ sx: { color: "text.secondary" } }}
					fullWidth
					sx={{ maxWidth: 384, borderRadius: 2 }}
					className={styles.dropShadow}
					variant="filled"
					color="primary"
					margin="dense"
				/>
				<Button
					variant="contained"
					sx={{ maxWidth: 384, borderRadius: 2, mt: "2em", color: "#FFFFFF", py: 1.5, fontWeight: "800", fontSize: "1rem" }}
					color="secondary"
					fullWidth
					className={styles.dropShadow}
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
