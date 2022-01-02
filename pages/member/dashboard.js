import { Box, Container, Typography, Button, Skeleton } from "@mui/material";
import dashboardStyles from "styles/dashboard.module.scss";
import AwesomeCarousel from "components/AwesomeCarousel";
import useMediaQuery from "@mui/material/useMediaQuery";
import MemberPageTemplate from "components/MemberPageTemplate";
import PendingPaymentsBox from "components/PendingPaymentBox";
import ImageWithSkeleton from "components/ImageWithSkeleton";
import { Fragment, useEffect, useState } from "react";
import { auth, getPendingActionOrders } from "lib/firebase";
import { DoNotTouchRounded } from "@mui/icons-material";
import { selectUserExists } from "lib/slices/userSlice";
import { useSelector } from "react-redux";

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
	const [pendingActionOrders, setPendingActionOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const userExist = useSelector(selectUserExists);

	useEffect(() => {
		if (userExist) {
			(async () => {
				setPendingActionOrders((await getPendingActionOrders()) ?? []);
				setLoading(false);
			})();
		}
	}, [userExist]);

	const getSlides = () => {
		let nSlides = Math.ceil(pendingActionOrders.length / ordersPerSlide);
		let slides = [];
		for (let n = 0; n < nSlides; n++) {
			slides.push({
				children: (
					<Box justifyContent="center" alignItems="center" display="flex">
						{pendingActionOrders
							.filter((order, index) => index < ordersPerSlide * (n + 1) && index >= ordersPerSlide * n)
							.map((order, index) => {
								return (
									<Button variant="contained" key={index} fullWidth sx={{ mx: 1, py: 2, fontSize: { xs: "0.5rem", sm: "1rem" } }}>
										{order.orderID}
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
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4, boxShadow: (theme) => theme.shadows[1] }}>
				<Typography color="text.main" fontWeight="500" mb={2} sx={{ textAlign: { xs: "center", sm: "left" } }}>
					Pending Actions
				</Typography>
				{loading ? (
					<Fragment>
						<Box justifyContent="center" alignItems="center" display="flex">
							{!isSmallScreen && (
								<Fragment>
									<Skeleton variant="rectangular" height="4em" width="10em" sx={{ mx: 1 }} />
									<Skeleton variant="rectangular" height="4em" width="10em" sx={{ mx: 1 }} />
									{isLargeScreen && <Skeleton variant="rectangular" height="4em" width="10em" sx={{ mx: 1 }} />}
								</Fragment>
							)}
							<Skeleton variant="rectangular" height="4em" width="10em" sx={{ mx: 1 }} />
						</Box>
					</Fragment>
				) : pendingActionOrders.length > 0 ? (
					<AwesomeCarousel cssModule={dashboardStyles} bullets={false} infinite={false} media={getSlides()} />
				) : (
					<Fragment>
						<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity: 0.5 }}>
							<DoNotTouchRounded sx={{ fontSize: "4rem" }} color="secondaryAccent" />
							<Typography variant="caption" fontStyle={"italic"} textAlign={"center"} sx={{ my: 2 }}>
								No pending actions needed
							</Typography>
						</Box>
					</Fragment>
				)}
			</Box>
		</Container>
	);
}

function PromotionsBox(props) {
	const promoImgs = ["bojack-0.png", "bojack-1.png", "bojack-2.png"];
	return (
		<Container {...props}>
			<Typography color="text.main" fontWeight="500" mb={2} sx={{ textAlign: { xs: "center", sm: "left" } }}>
				Promotions
			</Typography>
			<AwesomeCarousel
				bullets={false}
				media={promoImgs.map((img) => {
					return {
						preload: [`/pngs/promotions/${img}`],
						className: dashboardStyles.slide,
						children: (
							<Box justifyContent="center" alignItems="center" display="flex" width="100%" height="100%" zIndex={0} position="relative">
								<Typography sx={{ fontSize: { sm: "1.5rem", md: "2rem" }, color: "#FFFFFF", bgcolor: "primary.main", position: "absolute" }}>
									Your Advert Space Here!
								</Typography>
								<ImageWithSkeleton src={`/pngs/promotions/${img}`} objectFit="cover" layout="fill" containersx={{ position: "relative", zIndex: -1 }} />
							</Box>
						),
					};
				})}
			/>
		</Container>
	);
}
