import { AccountCircleRounded, Menu as MenuIcon, Notifications, NotificationsRounded } from "@mui/icons-material";
import { AppBar, Avatar, Badge, Box, Container, IconButton, Menu, MenuItem, Typography, useScrollTrigger, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { selectAvatarURL, selectUser, selectUserData } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import BrandWithLogo from "./BrandWithLogo";
import Logo from "./Logo";
import { cloneElement } from "react";
import Link from "next/link";

export default function MemberTopbar(props) {
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
	const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const userData = useSelector(selectUserData);
	const avatarURL = useSelector(selectAvatarURL);
	const { palette } = useTheme();
	const [anchorEl, setAnchorEl] = useState(null);

	return (
		<ElevationScroll bgColorScroll={props.bgColorScroll ?? "white.main"} bgcolor={props.bgcolor ?? "white.main"}>
			<AppBar elevation={0}>
				<Container sx={{ py: 2, position: "relative" }}>
					<Box display="flex" justifyContent="center" alignItems="center" width="100%">
						<Box display="flex" flex={1}>
							{!isLargeScreen && (
								<IconButton
									sx={{ mr: 2, borderRadius: 2 }}
									onClick={() => {
										props.onMenuClicked();
									}}
								>
									<MenuIcon color="secondaryAccent" />
								</IconButton>
							)}
							{!isMdDown && (
								<Box>
									<Typography variant="h4" sx={{ color: "secondaryAccent.main" }} fontWeight="bold">
										{`Hello, ${userData?.preferredName ?? "..."}!`}
									</Typography>
									<Typography variant="caption" whiteSpace="pre-wrap">
										{`${userData?.email ?? "..."}  |  ${userData?.phoneNo ?? "..."}`}
									</Typography>
								</Box>
							)}
						</Box>
						{isMdDown && !isSmDown && <BrandWithLogo textColor="primary" fontSize="1.5rem" logoWidth="2em" />}
						{isSmDown && <Logo fill={palette.secondary.main} />}
						<Box display="flex" alignItems="center" justifyContent={"flex-end"} flex={1}>
							{!isSmDown ? (
								<Fragment>
									<Link href="/member/notifications" passHref>
										<IconButton sx={{ mr: 2 }}>
											<Badge badgeContent={4} color="primary" showZero={false} variant="dot">
												<Notifications />
											</Badge>
										</IconButton>
									</Link>
									<Link href="/member/profile" passHref>
										<IconButton>
											<Avatar
												sx={{
													width: "3em",
													height: "3em",
													bgcolor: "primary.main",
													fontSize: { xs: "0.8rem", xs2: "1rem" },
													boxShadow: (theme) => theme.shadows[1],
												}}
												src={avatarURL}
											>
												{userData?.preferredName ? userData?.preferredName[0] : "?"}
											</Avatar>
										</IconButton>
									</Link>
								</Fragment>
							) : (
								<Fragment>
									<IconButton
										sx={{ mr: 2 }}
										onClick={(e) => {
											setAnchorEl(e.currentTarget);
										}}
									>
										<Badge badgeContent={4} color="primary" showZero={false} variant="dot">
											<Avatar
												sx={{
													width: "3em",
													height: "3em",
													bgcolor: "primary.main",
													fontSize: { xs: "0.8rem", xs2: "1rem" },
													boxShadow: (theme) => theme.shadows[1],
												}}
												src={avatarURL}
											>
												{userData?.preferredName ? userData?.preferredName[0] : "?"}
											</Avatar>
										</Badge>
									</IconButton>
									<Menu
										anchorEl={anchorEl}
										open={Boolean(anchorEl)}
										onClose={() => {
											setAnchorEl(null);
										}}
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "right",
										}}
										transformOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
									>
										<Link href="/member/notifications" passhref>
											<MenuItem
												onClick={() => {
													setAnchorEl(null);
												}}
											>
												<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
													<Typography>Notifications</Typography>
													<Badge
														badgeContent={4}
														color="primary"
														showZero={false}
														variant="dot"
														anchorOrigin={{ vertical: "top", horizontal: "right" }}
														sx={{ ml: 2 }}
													>
														<NotificationsRounded />
													</Badge>
												</Box>
											</MenuItem>
										</Link>
										<Link href="/member/profile" passhref>
											<MenuItem
												onClick={() => {
													setAnchorEl(null);
												}}
											>
												<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
													<Typography>Profile</Typography>
													<AccountCircleRounded sx={{ ml: 2 }} />
												</Box>
											</MenuItem>
										</Link>
									</Menu>
								</Fragment>
							)}
						</Box>
					</Box>
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
		sx: {
			bgcolor: trigger ? bgColorScroll ?? bgcolor ?? "primary.main" : bgcolor ?? "primary.main",
			boxShadow: (theme) => (trigger ? theme.shadows[1] : theme.shadows[0]),
		},
	});
}
