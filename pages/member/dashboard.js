import { Box, Container, Typography, Button, Skeleton, Breadcrumbs, Slide, Grid, Fade } from "@mui/material";
import dashboardStyles from "styles/dashboard.module.scss";
import AwesomeCarousel from "components/AwesomeCarousel";
import useMediaQuery from "@mui/material/useMediaQuery";
import PendingPaymentsBox from "components/PendingPaymentBox";
import ImageWithSkeleton from "components/ImageWithSkeleton";
import { Fragment, useEffect, useState } from "react";
import { auth, getPendingActionOrders } from "lib/firebase";
import { DoNotTouchRounded } from "@mui/icons-material";
import { selectUserData, selectUserExists } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import Link from "next/link";
import VizSensor from "react-visibility-sensor";
import MemberPageTemplate from "components/MemberPageTemplate";
import toast from "react-hot-toast";

export default function Dashboard() {
	return (
		<MemberPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb">
					<Typography color="text.primary">Dashboard</Typography>
				</Breadcrumbs>
			</Container>
			<SnailAddressBox sx={{ mt: 4 }} />
			<PendingPaymentsBox sx={{ mt: 4 }} />
			<PendingActionsBox sx={{ mt: 4 }} />
			<PricesContainer sx={{ mt: 4 }} />
			<PromotionsBox sx={{ mt: 4 }} />
		</MemberPageTemplate>
	);
}

const SnailAddressBox = (props) => {
	const { sx } = props;
	const user = useSelector(selectUserData);
	const snailAddress = 
	`${user?.fullName ?? "..."} - ${user?.IC.slice(-4) ?? "..."},\nSnailer Express,\nGround floor, Lot 7, Block A,\nMPL Saguking Warehouse,\n87000 WP Labuan,\nHP: 016 2058917 (Delivery purposes only)`;
	return (
		<Container {...props}>
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4, boxShadow: (theme) => theme.shadows[1] }}>
				<Typography variant="h6" sx={{ mb: 2 }}>
					Labuan Address
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Box sx={{ flex: 1 }}>
						<Typography variant="h8" sx={{ mb: 2, whiteSpace: "pre-wrap" }} color="secondaryAccent.main">
							{snailAddress}
						</Typography>
					</Box>
					<Box>
						<Button
							variant="contained"
							onClick={() => {
								// Copy address
								navigator.clipboard.writeText(snailAddress);
								toast.success("Address copied to clipboard");
							}}
						>
							Copy Address
						</Button>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};

function PricesContainer(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const [isVisible, setIsVisible] = useState(false);

	const pricingDetails = [
		{ price: { from: "6", to: "10" }, weight: { from: "0.1", to: "1.99" }, src: "/pngs/mail.png" },
		{ price: { from: "14", to: "18" }, weight: { from: "2.0", to: "7.99" }, src: "/pngs/envelope.png" },
		{ price: { from: "23", to: "27" }, weight: { from: "8.0", to: "13.99" }, src: "/pngs/box.png", size: "40%" },
		{ price: { from: "31", to: "35" }, weight: { from: "14", to: "19.99" }, src: "/pngs/box.png", size: "60%" },
		{ price: { from: "39", to: "43" }, weight: { from: "20", to: "25.99" }, src: "/pngs/box.png", size: "80%" },
	];

	return (
		<VizSensor
			partialVisibility
			onChange={(visible) => {
				if (visible) setIsVisible(visible);
			}}
		>
			<Container {...props}>
				<Box sx={{ display: "flex", flexDirection: "column", bgcolor: "#DEC3E6", px: 2, py: 2, borderRadius: 4 }}>
					<Typography color="white.main" sx={{ textAlign: { xs: "center", md: "left" } }}>
						Prices
					</Typography>
					<Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight="bold" color="white.main" mb={2} sx={{ textAlign: { xs: "center", md: "left" } }}>
						Affordable choice of delivery to your doorstep.
					</Typography>
					<Grid container display="flex" spacing={2} my={4} justifyContent={"center"}>
						{pricingDetails.map((details, index) => (
							<PriceItem details={details} isVisible={isVisible} index={index} key={index} />
						))}
					</Grid>
				</Box>
			</Container>
		</VizSensor>
	);
}

function PriceItem(props) {
	const { price, weight, src, size } = props.details || {};

	return (
		<Grid item md={2.4} sm={4} xs={12} xs2={6}>
			<Box
				sx={{
					mx: 1,
					bgcolor: "white.main",
					justifyContent: "center",
					alignItems: "center",
					display: "flex",
					flex: 1,
					padding: 4,
					borderRadius: 2,
					flexDirection: "column",
					height: "14em",
					boxShadow: (theme) => theme.shadows[1],
				}}
			>
				<Typography textAlign="center">{`$${price.from} to $${price.to}`}</Typography>
				<Box flex={1} width="100%" alignItems={"center"} justifyContent={"center"} display={"flex"}>
					<Slide direction="up" in={props.isVisible} timeout={1000} style={{ transitionDelay: props.index * 100 }}>
						<Box height={size ?? "60%"} width="100%" position="relative" my={2}>
							<ImageWithSkeleton src={src} alt="upcoming-apps" objectFit="contain" layout="fill" />
						</Box>
					</Slide>
				</Box>
				<Typography textAlign="center" fontWeight={"bold"} variant="caption">{`${weight.from} to ${weight.to} kg`}</Typography>
			</Box>
		</Grid>
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
	const promoImgs = ["placeholder.png", "placeholder.png", "placeholder.png"];
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
