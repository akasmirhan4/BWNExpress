import { Box } from "@mui/material";
import CustomDrawer from "../../components/CustomDrawer";
import CustomHead from "../../components/CustomHead";

export default function Dashboard() {
	return (
		<Box>
			<CustomHead />
			<Box display="flex">
				<CustomDrawer />
				<main></main>
			</Box>
		</Box>
	);
}
