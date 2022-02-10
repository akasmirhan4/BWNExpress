import { Box, Fab, SpeedDial, SpeedDialAction, SpeedDialIcon, Toolbar, Zoom } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomDrawer from "./CustomDrawer";
import MemberTopbar from "./MemberTopbar";
import {
	AddRounded,
	ChatBubbleOutlined,
	ChatBubbleOutlineRounded,
	ChatBubbleRounded,
	CloseRounded,
	HelpOutlineRounded,
	HelpRounded,
	VerifiedUserRounded,
} from "@mui/icons-material/";
import { useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function MemberPageTemplate(props) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const userData = useSelector(selectUserData);

	const [verifyStatus, setVerifyStatus] = useState("unverified");
	const router = useRouter();

	const actions = [
		{
			icon: verifyStatus == "verified" ? <AddRounded /> : <VerifiedUserRounded />,
			name: verifyStatus == "verified" ? "Place An Order" : "Verify Account",
			onClick: () => {
				if (verifyStatus == "verified") {
					router.push("/member/new-order/acknowledgement");
				} else {
					router.push("/member/verification");
				}
			},
		},
		// { icon: <HelpOutlineRounded />, name: "Help", onClick: () => {} },
		{ icon: <ChatBubbleOutlineRounded />, name: "Contact Support", onClick: () => {
			router.push("/member/support");
		} },
	];

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
		<Box pb={"8em"}>
			<Box display="flex">
				<CustomDrawer
					open={isDrawerOpen}
					onClose={() => {
						setIsDrawerOpen(false);
					}}
				/>
				<main style={{ flex: 1, position: "relative" }}>
					<MemberTopbar
						onMenuClicked={() => {
							setIsDrawerOpen(!isDrawerOpen);
						}}
					/>
					<Zoom in={!props.hideFAB}>
						<SpeedDial
							ariaLabel="SpeedDial"
							sx={{ position: "fixed", bottom: "2em", right: "2em", zIndex: 3 }}
							icon={<SpeedDialIcon openIcon={<CloseRounded />} sx={{ color: "white.main" }} />}
						>
							{actions.map((action) => (
								<SpeedDialAction sx={{ color: "primary.main" }} key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.onClick} />
							))}
						</SpeedDial>
					</Zoom>
					<Box mt={12}>{props.children}</Box>
				</main>
			</Box>
		</Box>
	);
}
