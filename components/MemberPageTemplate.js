import { Box, Fab, Toolbar, Zoom } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomDrawer from "./CustomDrawer";
import MemberTopbar from "./MemberTopbar";
import { AddRounded } from "@mui/icons-material/";
import { useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function MemberPageTemplate(props) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const userData = useSelector(selectUserData);

	const [verifyStatus, setVerifyStatus] = useState("unverified");
	const router = useRouter();

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
						<Fab
							color="primary"
							aria-label="add"
							sx={{ position: "fixed", bottom: "2em", right: "2em", zIndex: 3 }}
							onClick={() => {
								if (verifyStatus == "verified") {
									router.push("/member/new-order/acknowledgement");
								} else {
									toast("Verify account first");
									router.push("/member/verification");
								}
							}}
						>
							<AddRounded color="white" />
						</Fab>
					</Zoom>
					<Box mt={12}>{props.children}</Box>
				</main>
			</Box>
		</Box>
	);
}
