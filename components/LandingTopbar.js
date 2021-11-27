import { AppBar, Button, Container, Grid, IconButton, useScrollTrigger } from "@mui/material";
import Link from "next/link";
import BrandWithLogo from "./BrandWithLogo";
import { cloneElement, useContext, useEffect } from "react";
import styles from "../styles/main.module.scss";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

export default function LandingTopbar(props) {
	const { user, loading } = useContext(UserContext);
	return (
		<ElevationScroll bgColorScroll={props.bgColorScroll} bgcolor={props.bgcolor}>
			<AppBar elevation={0}>
				<Container>
					<Grid container spacing={2}>
						<Grid item md={3} alignItems="center">
							<Link href="home" prefetch={false} passHref>
								<IconButton sx={{ borderRadius: 4, my: 1 }} centerRipple={false}>
									<BrandWithLogo />
								</IconButton>
							</Link>
						</Grid>
						<Grid item md={4} display="flex" justifyContent="flex-start" alignItems="center">
							<Link href="home" prefetch={false} passHref>
								<Button color="white" sx={{ mr: 2 }}>
									Home
								</Button>
							</Link>
							<Button color="white" sx={{ mr: 2 }}>
								About Us
							</Button>
							<Button color="white">Resources</Button>
						</Grid>
						{!user ? (
							<Grid item md={5} display="flex" justifyContent="flex-end" alignItems="center">
								<Link href="login" prefetch={false} passHref>
									<Button color="white">Login</Button>
								</Link>
								<Link href="register" prefetch={false} passHref>
									<Button variant="contained" color="secondary" sx={{ ml: 2 }} style={{ color: "white" }} className={styles.dropShadow}>
										Register
									</Button>
								</Link>
							</Grid>
						) : (
							<Grid item md={5} display="flex" justifyContent="flex-end" alignItems="center">
								<Button
									color="white"
									onClick={() => toast.promise(auth.signOut(), { loading: "Logging out...", success: "Logged Out", error: "Error logging out" })}
								>
									Logout
								</Button>
								<Link href="dashboard" prefetch={false} passHref>
									<Button variant="contained" color="secondary" sx={{ ml: 2 }} style={{ color: "white" }} className={styles.dropShadow}>
										Dashboard
									</Button>
								</Link>
							</Grid>
						)}
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
