import { Button, Typography, Box, useTheme, IconButton, Drawer, Tooltip } from "@mui/material";
import Image from "next/image";
import styles from "styles/main.module.scss";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { AdminPanelSettingsRounded, Dashboard, GroupAddRounded, Inbox, Logout, PendingActionsRounded, Settings, SwapHoriz } from "@mui/icons-material";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";
import useMediaQuery from "@mui/material/useMediaQuery";
import { auth } from "lib/firebase";
import { Fragment, useEffect, useState } from "react";
import { selectRole, selectUserData, setUserExists } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import RoleDialog from "./RoleDialog";
import Logo from "./Logo";

export default function ModeratorDrawer(props) {
	const { palette } = useTheme();
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
	const userData = useSelector(selectUserData);
	const [verifyStatus, setVerifyStatus] = useState("...");
	const dispatch = useDispatch();
	const role = useSelector(selectRole);
	const router = useRouter();
	const roleDirectory = router.route.split("/")[1];
	const [openRoleDialog, setOpenRoleDialog] = useState(false);

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
			<Box {...props} sx={{ bgcolor: "lightGrey.secondary" }} display="flex" flexDirection="column" alignItems="center" pb={4} px={2} minWidth={256} flex={1}>
				{/* Top part of the drawer */}
				<Box display="flex" flexDirection="column" alignItems="center" mb={2} width="100%">
					<Link href="/member/dashboard" passHref>
						<IconButton sx={{ borderRadius: 4, p: 1, m: 1 }}>
							<Logo width={128} fill={palette.primary.main}/>
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
					<DrawerButton startIcon={<Dashboard />} href="/moderator/dashboard" label="Dashboard" />
					<DrawerButton startIcon={<GroupAddRounded />} href="/moderator/verify-users" label="Verify Users" />
					<DrawerButton startIcon={<PendingActionsRounded />} href="/moderator/verify-orders" label="Verify Orders" />
				</Box>

				{/* setting nav */}
				<Box display="flex" flexDirection="column" width="100%">
					{(role == "moderator" || role == "employee") && (
						<Fragment>
							<Button
								fullWidth
								color="white"
								sx={{ mb: 1 }}
								style={{ justifyContent: "flex-start", paddingLeft: "1em" }}
								onClick={() => {
									setOpenRoleDialog(true);
								}}
								startIcon={<AdminPanelSettingsRounded />}
							>
								Select Role
							</Button>
							<RoleDialog
								selectedValue={roleDirectory}
								open={openRoleDialog}
								onClose={(role) => {
									setOpenRoleDialog(false);
									router.push(`/${role}/dashboard`);
								}}
							/>
						</Fragment>
					)}
					<DrawerButton startIcon={<Settings />} href="/member/settings" label="Settings" />
					<Button
						onClick={() => {
							dispatch(setUserExists(false));
							toast.promise(signOut(auth), { loading: "logging out...", success: " log out successful", error: "error logging out" });
						}}
						startIcon={<Logout />}
						fullWidth
						color="lightGrey"
						sx={{ mb: 1 }}
						style={{ justifyContent: "flex-start", paddingLeft: "1em" }}
					>
						{"Logout"}
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
}

function DrawerButton(props) {
	const { startIcon, href, label } = props;
	const { route } = useRouter();
	const isActive = route == href;
	const { palette } = useTheme();

	if (isActive) {
		return (
			<Link href={href} passHref>
				<Button
					onClick={() => {
						props.onClick ? props.onClick() : router.push(href);
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
