import { Box, Container, Typography, Button } from "@mui/material";
import styles from "styles/main.module.scss";
import dashboardStyles from "styles/dashboard.module.scss";
import AwesomeCarousel from "components/AwesomeCarousel";
import useMediaQuery from "@mui/material/useMediaQuery";
import MemberPageTemplate from "components/MemberPageTemplate";
import PendingPaymentsBox from "components/PendingPaymentBox";

export default function Dashboard() {
	return (
		<MemberPageTemplate>
			<PendingPaymentsBox sx={{ mt: 4 }} />
			<PendingActionsBox sx={{ mt: 4 }} />
			<PromotionsBox sx={{ mt: 4 }} />
		</MemberPageTemplate>
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
				<Typography color="text.main" fontWeight="500" mb={2} sx={{ textAlign: { xs: "center", sm: "left" } }}>
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
			<Typography color="text.main" fontWeight="500" mb={2} sx={{ textAlign: { xs: "center", sm: "left" } }}>
				Promotions
			</Typography>
			<AwesomeCarousel
				className={styles.dropShadow}
				bullets={false}
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
								<Typography sx={{ fontSize: { sm: "1.5rem", md: "2rem" }, color: "#FFFFFF", bgcolor: "primary.main" }}>Your Advert Space Here!</Typography>
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
								<Typography sx={{ fontSize: { sm: "1.5rem", md: "2rem" }, color: "#FFFFFF", bgcolor: "primary.main" }}>Your Advert Space Here!</Typography>
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
								<Typography sx={{ fontSize: { sm: "1.5rem", md: "2rem" }, color: "#FFFFFF", bgcolor: "primary.main" }}>Your Advert Space Here!</Typography>
							</Box>
						),
					},
				]}
			/>
		</Container>
	);
}
