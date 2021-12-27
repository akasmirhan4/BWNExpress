import { Box, Container, Typography, Button, Grid, Breadcrumbs, Link } from "@mui/material";
import styles from "styles/main.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";

export default function Verification() {
	const userData = useSelector(selectUserData);
	console.log(userData);
	const { userVerifiedLevel, verified } = userData || {};
	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
					<NextLink href="dashboard" prefetch={false} passHref>
						<Link underline="hover" color="inherit">
							Home
						</Link>
					</NextLink>
					<Typography color="text.primary">New Order</Typography>
				</Breadcrumbs>
			</Container>
		</MemberPageTemplate>
	);
}
