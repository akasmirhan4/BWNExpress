import React from "react";
import { Container, Typography } from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";

export default function Profile() {
	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Typography>Profile Page</Typography>
			</Container>
		</MemberPageTemplate>
	);
}
