import {
	AppBar,
	Box,
	Button,
	Container,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	SwipeableDrawer,
	Typography,
	useScrollTrigger,
} from "@mui/material";
import Link from "next/link";
import BrandWithLogo from "./BrandWithLogo";
import { cloneElement, useState } from "react";
import styles from "../styles/main.module.scss";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import { CollectionsBookmarkRounded, HomeRounded, LoginRounded, MenuRounded, PeopleRounded, PersonAddRounded } from "@mui/icons-material";
import { useRouter } from "next/router";
import { selectLang, setLang } from "lib/slices/prefSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "lib/slices/userSlice";

export default function LandingTopbar(props) {
	const lang = useSelector(selectLang);
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	return (
		<ElevationScroll bgcolor={props.bgcolor}>
			<AppBar elevation={0}>
				<Container sx={{ py: 2, position: "relative" }}>
					<Grid container spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
						<Grid item md={3} alignItems="center" display="flex">
							<Link href="/home" prefetch={false} passHref>
								<IconButton sx={{ borderRadius: 4 }} centerRipple={false}>
									<BrandWithLogo textColor={props.darkText ? "secondaryAccent.main" : null} />
								</IconButton>
							</Link>
						</Grid>
						<Grid item md={4} justifyContent="flex-start" alignItems="center" display="flex">
							<Link href="/home" prefetch={false} passHref>
								<Button color={props.darkText ? "text" : "white"} sx={{ mr: 2 }}>
									Home
								</Button>
							</Link>
							<Link href="/about-us" prefetch={false} passHref>
								<Button color={props.darkText ? "text" : "white"} sx={{ mr: 2 }}>
									About Us
								</Button>
							</Link>
							<Link href="/resources" prefetch={false} passHref>
								<Button color={props.darkText ? "text" : "white"}>Resources</Button>
							</Link>
						</Grid>
						<Grid item md={5} justifyContent="flex-end" alignItems="center" display="flex">
							<Box display="flex" alignItems="center" sx={{ mr: "2em" }}>
								<Button
									color={props.darkText ? "text" : "white"}
									size="small"
									sx={{ maxWidth: "2.5em", minWidth: "2.5em" }}
									onClick={() => {
										document.cookie = "lang=EN";
										dispatch(setLang("EN"));
									}}
								>
									EN
								</Button>
								<Typography color={props.darkText ? "text.main" : "white.main"} sx={{ mx: "0.2em" }}>
									|
								</Typography>
								<Button
									color={props.darkText ? "text" : "white"}
									size="small"
									sx={{ maxWidth: "2.5em", minWidth: "2.5em" }}
									onClick={() => {
										document.cookie = "lang=BM";
										dispatch(setLang("BM"));
									}}
								>
									BM
								</Button>
							</Box>
							{!user.uid ? (
								<Box>
									<Link href="/auth/login" prefetch={false} passHref>
										<Button color={props.darkText ? "text" : "white"}>Login</Button>
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
					<Box sx={{ display: { md: "none", xs: "flex" }, justifyContent: "center" }}>
						<BrandWithLogo textColor={props.darkText ? "secondaryAccent.main" : null} />
						<Box sx={{ right: 0, position: "absolute", mr: 2 }}>
							<IconButton
								color="white"
								sx={{ borderRadius: "50%", height: "2em", width: "2em" }}
								centerRipple={false}
								onClick={() => setIsDrawerOpen(!isDrawerOpen)}
							>
								<MenuRounded color={props.darkText ? "secondaryAccent" : "white"} />
							</IconButton>
						</Box>
					</Box>
				</Container>
				<SwipeableDrawer
					anchor={"left"}
					open={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
					onOpen={() => setIsDrawerOpen(true)}
					disableBackdropTransition
				>
					<Box
						sx={{ width: 320, height: "100%" }}
						role="presentation"
						onClick={() => setIsDrawerOpen(false)}
						// bgcolor={props.bgcolor ?? "primary.main"}
					>
						<Box p={2} bgcolor={props.bgcolor ?? "primary.main"} display="flex" justifyContent={"center"}>
							<BrandWithLogo textColor={props.darkText ? "secondaryAccent.main" : null} />
						</Box>
						<List>
							<DrawerLink href="/home" title="Home" icon={<HomeRounded />} />
							<DrawerLink href="/about-us" title="About Us" icon={<PeopleRounded />} />
							<DrawerLink href="/resources" title="Resources" icon={<CollectionsBookmarkRounded />} />
						</List>
						<Divider />
						<List>
							<DrawerLink href="/auth/login" title="Login" icon={<LoginRounded />} />
							<DrawerLink href="/auth/register" title="Register" icon={<PersonAddRounded />} />
							<ListItem display="flex" alignItems="center" sx={{ mr: "2em" }}>
								<Button
									color={props.darkText ? "text" : "white"}
									size="small"
									sx={{ maxWidth: "2.5em", minWidth: "2.5em" }}
									onClick={() => {
										document.cookie = "lang=EN";
										dispatch(setLang("EN"));
									}}
								>
									EN
								</Button>
								<Typography color={props.darkText ? "text.main" : "white.main"} sx={{ mx: "0.2em" }}>
									|
								</Typography>
								<Button
									color={props.darkText ? "text" : "white"}
									size="small"
									sx={{ maxWidth: "2.5em", minWidth: "2.5em" }}
									onClick={() => {
										document.cookie = "lang=BM";
										dispatch(setLang("BM"));
									}}
								>
									BM
								</Button>
							</ListItem>
						</List>
					</Box>
				</SwipeableDrawer>
			</AppBar>
		</ElevationScroll>
	);
}

function DrawerLink(props) {
	const { href, title, icon } = props;
	const { route } = useRouter();
	let routeTitle = routeToString(route);
	const Icon = () => cloneElement(icon, { color: routeTitle == title ? "secondary" : "text" });

	return (
		<Link href={href} prefetch={false} passHref>
			<ListItem button>
				<ListItemIcon>
					<Icon />
				</ListItemIcon>
				<ListItemText
					disableTypography
					primary={
						<Typography type="body2" fontWeight={routeTitle == title ? "bold" : "normal"} color={routeTitle == title ? "secondary" : "text"}>
							{title}
						</Typography>
					}
				/>
			</ListItem>
		</Link>
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

function routeToString(route) {
	route = route.split("/")[route.split("/").length - 1];
	route = route.replace(/\-/g, " ");
	var splitStr = route.toLowerCase().split(" ");
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(" ");
}
