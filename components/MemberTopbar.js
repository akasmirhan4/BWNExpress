import { ChatBubble, Menu, Notifications } from "@mui/icons-material";
import { Avatar, Badge, Box, Container, IconButton, Typography } from "@mui/material";
import styles from "styles/main.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import { selectUserData } from "lib/slices/userSlice";
import { useSelector } from "react-redux";

export default function MemberTopbar(props) {
	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("xl"));
	const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const userData = useSelector(selectUserData);

	return (
		<Container sx={{ pt: 8 }}>
			<Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
				<Box display="flex">
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
					{!isSmDown && (
						<Box>
							<Typography variant="h4" sx={{ color: "secondaryAccent.main" }} fontWeight="bold">
								{`Hello, ${userData?.preferredName ?? "Unknown"}!`}
							</Typography>
							<Typography variant="caption" whiteSpace="pre-wrap">
								{`${userData?.email ?? "..."}  |  ${userData?.phoneNo ?? "..."}`}
							</Typography>
						</Box>
					)}
				</Box>
				<Box display="flex" alignItems="center">
					<IconButton sx={{ mr: 2 }}>
						<Badge badgeContent={4} color="primary" showZero={false} variant="dot">
							<ChatBubble />
						</Badge>
					</IconButton>
					<IconButton sx={{ mr: 2 }}>
						<Badge badgeContent={4} color="primary" showZero={false} variant="dot">
							<Notifications />
						</Badge>
					</IconButton>
					<IconButton>
						<Avatar sx={{ width: "2.5em", height: "2.5em", bgcolor: "primary.main" }} className={styles.dropShadow}>
							{userData?.preferredName ? userData?.preferredName[0] : "?"}
						</Avatar>
					</IconButton>
				</Box>
			</Box>
		</Container>
	);
}
