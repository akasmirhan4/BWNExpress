import { Button, Typography, Box, useTheme, IconButton, Drawer, Tooltip } from "@mui/material";
import Image from "next/image";
import Logo from "public/svgs/logo.svg";
import styles from "styles/main.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Dashboard, Inbox, Logout, Settings, SwapHoriz } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import useMediaQuery from "@mui/material/useMediaQuery";
import { auth } from "lib/firebase";
import { useEffect, useState } from "react";
import { selectUserData } from "lib/slices/userSlice";
import { useSelector } from "react-redux";

export default function CustomDrawer(props) {
	const { palette } = useTheme();
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
	const userData = useSelector(selectUserData);
	const [verifyStatus, setVerifyStatus] = useState("...");

	useEffect(() => {
		if (userData?.verified) {
			switch (userData.verified?.IC) {
				case "pending":
					setVerifyStatus("pending");
					break;
				case true:
					setVerifyStatus("verified");
					break;
				case "unverified":
				default:
					setVerifyStatus("unverified");
			}
		}
	}, [userData]);

	return (
		<Drawer {...props} anchor="left" variant={isLargeScreen ? "permanent" : "temporary"}>
			<Box
				{...props}
				sx={{ backgroundImage: `url("/svgs/background.svg")`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "left" }}
				display="flex"
				flexDirection="column"
				alignItems="center"
				pb={4}
				px={2}
				minWidth={256}
				flex={1}
			>
				{/* Top part of the drawer */}
				<Box display="flex" flexDirection="column" alignItems="center" mb={2} width="100%">
					<Link href="/member/dashboard" passHref>
						<IconButton sx={{ borderRadius: 4, p: 1, m: 1 }}>
							<Image src={Logo} alt="Company Logo" />
						</IconButton>
					</Link>
					<Typography className={styles.companyName} color="white.main">
						{"BWNEXPRESS"}
					</Typography>
					<Link href="/member/verification" passHref>
						<Button fullWidth sx={{ color: "secondaryAccent.main" }}>
							<Typography variant="caption" sx={{ color: palette.white.main }}>
								{"member"} <span className={styles[verifyStatus]}>{verifyStatus}</span>
							</Typography>
						</Button>
					</Link>
				</Box>

				{/* CTA Button */}
				<Tooltip title={verifyStatus !== "verified" ? `Verify account first` : ""} placement="right" arrow enterTouchDelay={0}>
					<span>
						<Link href="/member/new-order/acknowledgement" passHref>
							<Button
								disabled={verifyStatus !== "verified"}
								variant="outlined"
								color="secondaryAccent"
								sx={{ boxShadow: (theme) => theme.shadows[1] }}
								startIcon={<ShoppingCartIcon />}
								fullWidth
							>
								{"PLACE AN ORDER"}
							</Button>
						</Link>
					</span>
				</Tooltip>

				{/* main nav */}
				<Box display="flex" flexDirection="column" width="100%" mt={4} flex={1}>
					<DrawerButton startIcon={<Dashboard />} href="/member/dashboard" label="Dashboard" />
					<DrawerButton startIcon={<Inbox />} href="/member/my-orders" label="My Orders" />
					<DrawerButton startIcon={<SwapHoriz />} href="/member/my-transactions" label="My Transactions" />
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
	const isActive = route.substring(1).split("/")[1] == href;
	const { palette } = useTheme();

	if (isActive) {
		return (
			<Link href={href} passHref>
				<Button
					onClick={() => {
						router.push(href);
					}}
					variant="contained"
					startIcon={startIcon}
					fullWidth
					color="accent"
					sx={{ boxShadow: (theme) => theme.shadows[1], mb: 1 }}
					style={{ justifyContent: "flex-start", paddingLeft: "1em", color: "white" }}
				>
					{label}
				</Button>
			</Link>
		);
	} else {
		return (
			<Link href={href} passHref>
				<Button startIcon={startIcon} fullWidth color="white" sx={{ mb: 1 }} style={{ justifyContent: "flex-start", paddingLeft: "1em" }}>
					{label}
				</Button>
			</Link>
		);
	}
}
