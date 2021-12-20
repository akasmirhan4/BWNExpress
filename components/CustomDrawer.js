import { Button, Typography, Box, useTheme, IconButton, Drawer } from "@mui/material";
import Image from "next/image";
import Logo from "../public/svgs/logo.svg";
import styles from "../styles/main.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Dashboard, Inbox, Logout, Settings, SwapHoriz } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import useMediaQuery from "@mui/material/useMediaQuery";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { selectUserData } from "lib/slices/userSlice";
import { useSelector } from "react-redux";

export default function CustomDrawer(props) {
	const { palette } = useTheme();
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
	const userData = useSelector(selectUserData);
	const [verifyStatus, setVerifyStatus] = useState("...");

	useEffect(() => {
		if (userData) {
			switch (userData.userVerifiedLevel) {
				case 0:
				case 1:
					setVerifyStatus("unverified");
					break;
				case 1.5:
					setVerifyStatus("pending");
					break;
				case 2:
				case 3:
					setVerifyStatus("verified");
					break;
				default:
					setVerifyStatus("unknown");
					break;
			}
		}
	}, [userData]);

	return (
		<Drawer {...props} anchor="left" variant={isLargeScreen ? "permanent" : "temporary"}>
			<Box {...props} bgcolor={palette.offWhite.main} display="flex" flexDirection="column" alignItems="center" pb={4} px={2} minWidth={256} flex={1}>
				{/* Top part of the drawer */}
				<Box display="flex" flexDirection="column" alignItems="center" mb={2} width="100%">
					<Link prefetch={false} href="dashboard" passHref>
						<IconButton sx={{ borderRadius: 4, p: 1, m: 1 }}>
							<Image src={Logo} alt="Company Logo" />
						</IconButton>
					</Link>
					<Typography className={styles.companyName}>{"BWNEXPRESS"}</Typography>
					<Button fullWidth sx={{ color: "secondaryAccent.main" }}>
						<Typography variant="caption" sx={{ color: palette.lightGrey.main }}>
							{"member"} <span className={styles[verifyStatus]}>{verifyStatus}</span>
						</Typography>
					</Button>
				</Box>

				{/* CTA Button */}
				{/* <Link href="new-order" prefetch={false}> */}
				<Button
					disabled={verifyStatus !== "verified"}
					variant="outlined"
					color="secondaryAccent"
					className={styles.dropShadow}
					startIcon={<ShoppingCartIcon />}
					fullWidth
					onClick={() => toast.success("Order Placed!")}
				>
					{"PLACE AN ORDER"}
				</Button>
				{/* </Link> */}

				{/* main nav */}
				<Box display="flex" flexDirection="column" width="100%" mt={4} flex={1}>
					<DrawerButton startIcon={<Dashboard />} href="dashboard" label="Dashboard" />
					<DrawerButton startIcon={<Inbox />} href="my-orders" label="My Orders" />
					<DrawerButton startIcon={<SwapHoriz />} href="my-transactions" label="My Transactions" />
				</Box>

				{/* setting nav */}
				<Box display="flex" flexDirection="column" width="100%">
					<Button
						onClick={() => {
							toast.promise(auth.signOut(), { loading: "logging out...", success: " log out successful", error: "error logging out" });
						}}
						startIcon={<Logout />}
						fullWidth
						color="lightGrey"
						sx={{ mb: 1 }}
						style={{ justifyContent: "flex-start", paddingLeft: "1em" }}
					>
						{"Logout"}
					</Button>
					<Button startIcon={<Settings />} fullWidth color="lightGrey" sx={{ mb: 1 }} style={{ justifyContent: "flex-start", paddingLeft: "1em" }}>
						{"settings"}
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
}

function DrawerButton(props) {
	const { startIcon, href, label } = props;
	const { route } = useRouter();
	const isActive = route.substring(1) == href;
	const { palette } = useTheme();

	if (isActive) {
		return (
			<Link href={href} prefetch={false} passHref>
				<Button
					variant="contained"
					startIcon={startIcon}
					fullWidth
					color="secondaryAccent"
					sx={{ mb: 1 }}
					style={{ justifyContent: "flex-start", paddingLeft: "1em", color: palette.offWhite.main }}
					className={styles.dropShadow}
				>
					{label}
				</Button>
			</Link>
		);
	} else {
		return (
			<Link href={href} prefetch={false} passHref>
				<Button startIcon={startIcon} fullWidth color="lightGrey" sx={{ mb: 1 }} style={{ justifyContent: "flex-start", paddingLeft: "1em" }}>
					{label}
				</Button>
			</Link>
		);
	}
}
