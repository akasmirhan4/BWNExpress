import { AppBar, Box, Button, Container, Grid, IconButton, Typography, useScrollTrigger } from "@mui/material";
import Link from "next/link";
import BrandWithLogo from "./BrandWithLogo";
import { cloneElement, useContext, useEffect } from "react";
import styles from "../styles/main.module.scss";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

export default function LandingTopbar(props) {
	const { user, loading, lang, setLang } = useContext(UserContext);
	return (
		<ElevationScroll bgColorScroll={props.bgColorScroll} bgcolor={props.bgcolor}>
			<AppBar elevation={0}>
				<Container>
					<Grid container spacing={2}>
						<Grid item md={3} alignItems="center">
							<Link href="/home" prefetch={false} passHref>
								<IconButton sx={{ borderRadius: 4, my: 1 }} centerRipple={false}>
									<BrandWithLogo />
								</IconButton>
							</Link>
						</Grid>
						<Grid item md={4} display="flex" justifyContent="flex-start" alignItems="center">
							<Link href="/home" prefetch={false} passHref>
								<Button color="white" sx={{ mr: 2 }}>
									Home
								</Button>
							</Link>
							<Button color="white" sx={{ mr: 2 }}>
								About Us
							</Button>
							<Button color="white">Resources</Button>
						</Grid>
						<Grid item md={5} display="flex" justifyContent="flex-end" alignItems="center">
							<Box display="flex" alignItems="center" sx={{ mr: "2em" }}>
								<Button
									color="white"
									size="small"
									sx={{ maxWidth: "2.5em", minWidth: "2.5em" }}
									onClick={() => {
										document.cookie = "lang=EN";
										setLang("EN");
									}}
								>
									EN
								</Button>
								<Typography color="#FFFFFF" sx={{ mx: "0.2em" }}>
									|
								</Typography>
								<Button
									color="white"
									size="small"
									sx={{ maxWidth: "2.5em", minWidth: "2.5em" }}
									onClick={() => {
										document.cookie = "lang=BM";
										setLang("BM");
									}}
								>
									BM
								</Button>
							</Box>
							{!user ? (
								<Box>
									<Link href="/auth/login" prefetch={false} passHref>
										<Button color="white">Login</Button>
									</Link>
									<Link href="/auth/register" prefetch={false} passHref>
										<Button variant="contained" color="secondary" sx={{ ml: 2 }} style={{ color: "white" }} className={styles.dropShadow}>
											Register
										</Button>
									</Link>
								</Box>
							) : (
								<Box>
									<Button
										color="white"
										onClick={() => toast.promise(auth.signOut(), { loading: "Logging out...", success: "Logged Out", error: "Error logging out" })}
									>
										Logout
									</Button>
									<Link href="/member/dashboard" prefetch={false} passHref>
										<Button variant="contained" color="secondary" sx={{ ml: 2 }} style={{ color: "white" }} className={styles.dropShadow}>
											Dashboard
										</Button>
									</Link>
								</Box>
							)}
						</Grid>
					</Grid>
				</Container>
			</AppBar>
		</ElevationScroll>
	);
}

function ElevationScroll(props) {
	const { children, window, bgColorScroll, bgcolor } = props;

	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 0,
		target: window ? window() : undefined,
	});

	return cloneElement(children, {
		className: trigger ? styles.dropShadow : null,
		sx: { bgcolor: trigger ? bgColorScroll ?? bgcolor ?? "primary.main" : bgcolor ?? "primary.main" },
	});
}
