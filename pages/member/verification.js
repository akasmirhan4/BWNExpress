import { Box, Container, Typography, Button, Grid, Breadcrumbs, Link } from "@mui/material";
import styles from "styles/main.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";

export default function Verification() {
	const userData = useSelector(selectUserData);
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
					<Typography color="text.primary">Verification Process</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography fontWeight={"bold"}>CATEGORY</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography fontWeight={"bold"}>DETAILS</Typography>
					</Grid>
					<Grid item xs={4} />

					<Grid item xs={4}>
						<Typography>IC</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography>{!userData ? "..." : userData.IC}</Typography>
					</Grid>
					<Grid item xs={4}>
						<NextLink href={"upload-ic"} prefetch={false} passHref>
							<Button
								disabled={!userData || verified?.IC !== "uploadingLater"}
								variant="contained"
								fullWidth
								sx={{ color: "white.main" }}
								className={styles.dropShadow}
							>
								{!userData
									? "..."
									: verified?.IC == "uploadingLater"
									? "upload"
									: verified?.IC == "pending"
									? "verifying"
									: verified?.IC == true
									? "verified"
									: "unknown"}
							</Button>
						</NextLink>
					</Grid>
					<Grid item xs={4}>
						<Typography>Email</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography>{!userData ? "..." : userData.email}</Typography>
					</Grid>
					<Grid item xs={4}>
						<Button disabled={!userData || verified?.email} variant="contained" fullWidth sx={{ color: "white.main" }} className={styles.dropShadow}>
							{!userData ? "Loading..." : verified?.email == true ? "verified" : "verify"}
						</Button>
					</Grid>
					<Grid item xs={4}>
						<Typography>Phone # (Optional)</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography>{!userData ? "..." : userData.phoneNo}</Typography>
					</Grid>
					<Grid item xs={4}>
						<Button disabled={!userData || verified?.phoneNo} variant="contained" fullWidth sx={{ color: "white.main" }} className={styles.dropShadow}>
							{!userData ? "Loading..." : verified?.phoneNo == true ? "verified" : "verify"}
						</Button>
					</Grid>
				</Grid>
			</Container>
		</MemberPageTemplate>
	);
}
