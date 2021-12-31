import { ChatBubble, Menu, Notifications } from "@mui/icons-material";
import { AppBar, Avatar, Badge, Box, Container, IconButton, Typography, useScrollTrigger, useTheme } from "@mui/material";
import styles from "styles/main.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import { selectUserData } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import BrandWithLogo from "./BrandWithLogo";
import Logo from "./Logo";
import { cloneElement } from "react";
import Link from "next/link";

export default function MemberTopbar(props) {
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
	const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const userData = useSelector(selectUserData);
	const { palette } = useTheme();

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
									<Menu color="secondaryAccent" />
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
							{!isSmDown && (
								<Fragment>
									<IconButton sx={{ mr: 2 }}>
										<Badge badgeContent={4} color="primary" showZero={false} variant="dot">
											<ChatBubble />
										</Badge>
									</IconButton>
									<Link prefetch={false} href="/member/notifications" passHref>
										<IconButton sx={{ mr: 2 }}>
											<Badge badgeContent={4} color="primary" showZero={false} variant="dot">
												<Notifications />
											</Badge>
										</IconButton>
									</Link>
								</Fragment>
							)}

							<IconButton>
								<Avatar
									sx={{
										width: "2.5em",
										height: "2.5em",
										bgcolor: "primary.main",
										fontSize: { xs: "0.8rem", md: "1rem" },
									}}
									className={styles.dropShadow}
								>
									{userData?.preferredName ? userData?.preferredName[0] : "?"}
								</Avatar>
							</IconButton>
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
		className: trigger ? styles.dropShadow : null,
		sx: { bgcolor: trigger ? bgColorScroll ?? bgcolor ?? "primary.main" : bgcolor ?? "primary.main" },
	});
}
