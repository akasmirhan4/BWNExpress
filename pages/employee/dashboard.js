import { Container, Typography, Breadcrumbs } from "@mui/material";
import EmployeePageTemplate from "components/EmployeePageTemplate";

export default function Dashboard() {
	return (
		<EmployeePageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Dashboard</Typography>
				</Breadcrumbs>
			</Container>
		</EmployeePageTemplate>
	);
}
