import { Container, Typography, Breadcrumbs } from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";

export default function Dashboard() {
	return (
		<MemberPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb">
					<Typography color="text.primary">Dashboard</Typography>
				</Breadcrumbs>
			</Container>
		</MemberPageTemplate>
	);
}
