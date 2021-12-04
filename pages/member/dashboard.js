import { Box, Container, Typography, Grid, Button } from "@mui/material";
import CustomDrawer from "components/CustomDrawer";
import MemberTopbar from "components/MemberTopbar";
import styles from "styles/main.module.scss";
import dashboardStyles from "styles/dashboard.module.scss";
import { useState } from "react";
import AwesomeCarousel from "components/AwesomeCarousel";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Dashboard() {
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
					<PendingPaymentsBox sx={{ mt: 4 }} />
					<PendingActionsBox sx={{ mt: 4 }} />
					<PromotionsBox sx={{ mt: 4 }} />
				</main>
			</Box>
		</Box>
	);
}

function PendingPaymentsBox(props) {
	return (
		<Container {...props}>
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4 }} className={styles.dropShadow}>
				<Grid container>
					<Grid item md={6} xs={12}>
						<Typography color="text.main" fontWeight="500">
							Pending Payment
						</Typography>
						<Typography variant="h4" fontWeight="500" my={2} color="primary">
							$30.00
						</Typography>
						<Typography variant="caption" color="lightGrey.main" display="flex">
							Amount Due: $30.00
						</Typography>
						<Typography variant="caption" color="lightGrey.main" display="flex">
							Due by: 01/01/2021
						</Typography>
					</Grid>
					<Grid item md={6} xs={12} alignItems="flex-end" justifyContent="center" display="flex" flexDirection="column">
						<Button variant="contained" sx={{ maxWidth: 256, mb: 2 }} style={{ color: "white" }} fullWidth>
							Pay Now
						</Button>
						<Button variant="outlined" sx={{ maxWidth: 256 }} fullWidth>
							View Bill
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}

function PendingActionsBox(props) {
	const pendingOrders = ["BWN00000001", "BWN00000002", "BWN00000003", "BWN00000004", "BWN00000005", "BWN00000006"];

	const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("md2"));
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const ordersPerSlide = isLargeScreen ? 6 : isSmallScreen ? 2 : 3;

	const getSlides = () => {
		let nSlides = Math.ceil(pendingOrders.length / ordersPerSlide);
		let slides = [];
		for (let n = 0; n < nSlides; n++) {
			slides.push({
				children: (
					<Box justifyContent="center" alignItems="center" display="flex">
						{pendingOrders
							.filter((order, index) => index < ordersPerSlide * (n + 1) && index >= ordersPerSlide * n)
							.map((order, index) => {
								return (
									<Button variant="contained" key={index} fullWidth sx={{ mx: 1, py: 2 }} style={{ color: "white" }} className={styles.dropShadow}>
										{order}
									</Button>
								);
							})}
					</Box>
				),
			});
		}
		return slides;
	};

	return (
		<Container {...props}>
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4 }} className={styles.dropShadow}>
				<Typography color="text.main" fontWeight="500" mb={2}>
					Pending Actions
				</Typography>
				<AwesomeCarousel cssModule={dashboardStyles} bullets={false} infinite={false} media={getSlides()} />
			</Box>
		</Container>
	);
}

function PromotionsBox(props) {
	return (
		<Container {...props}>
			<Typography color="text.main" fontWeight="500" mb={2}>
				Promotions
			</Typography>
			<AwesomeCarousel
				className={styles.dropShadow}
				media={[
					{
						preload: ["https://caferati.me/images/series/bojack-0.png"],
						className: dashboardStyles.slide,
						children: (
							<Box
								justifyContent="center"
								alignItems="center"
								display="flex"
								width="100%"
								height="100%"
								sx={{ background: "url(https://caferati.me/images/series/bojack-0.png) center no-repeat", backgroundSize: "cover" }}
							>
								<Typography variant="h3" sx={{ color: "#FFFFFF", bgcolor: "primary.main" }}>
									Your Advert Space Here!
								</Typography>
							</Box>
						),
					},
					{
						preload: ["https://caferati.me/images/series/bojack-1.png"],
						className: dashboardStyles.slide,
						children: (
							<Box
								justifyContent="center"
								alignItems="center"
								display="flex"
								width="100%"
								height="100%"
								sx={{ background: "url(https://caferati.me/images/series/bojack-1.png) center no-repeat", backgroundSize: "cover" }}
							>
								<Typography variant="h3" sx={{ color: "#FFFFFF", bgcolor: "primary.main" }}>
									Your Advert Space Here!
								</Typography>
							</Box>
						),
					},
					{
						preload: ["https://caferati.me/images/series/bojack-2.png"],
						className: dashboardStyles.slide,
						children: (
							<Box
								justifyContent="center"
								alignItems="center"
								display="flex"
								width="100%"
								height="100%"
								sx={{ background: "url(https://caferati.me/images/series/bojack-2.png) center no-repeat", backgroundSize: "cover" }}
							>
								<Typography variant="h3" sx={{ color: "#FFFFFF", bgcolor: "primary.main" }}>
									Your Advert Space Here!
								</Typography>
							</Box>
						),
					},
				]}
			/>
		</Container>
	);
}
