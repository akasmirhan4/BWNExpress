import { Box } from "@mui/material";
import React, { useState } from "react";
import CustomDrawer from "./CustomDrawer";
import MemberTopbar from "./MemberTopbar";

export default function MemberPageTemplate(props) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	return (
		<Box pb={"8em"}>
			<Box display="flex">
				<CustomDrawer
					open={isDrawerOpen}
					onClose={() => {
						setIsDrawerOpen(false);
					}}
				/>
				<main style={{ flex: 1 }}>
					<MemberTopbar
						onMenuClicked={() => {
							setIsDrawerOpen(!isDrawerOpen);
						}}
					/>
					{props.children}
				</main>
			</Box>
		</Box>
	);
}
