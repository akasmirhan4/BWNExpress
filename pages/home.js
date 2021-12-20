import { Box, Button, Container, Grid, IconButton, Typography, useMediaQuery, Slide, Fade } from "@mui/material";
import styles from "../styles/main.module.scss";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import LandingTopbar from "../components/LandingTopbar";
import LandingFooter from "../components/LandingFooter";
import { TwitterTweetEmbed } from "react-twitter-embed";
import ImageWithSkeleton from "components/ImageWithSkeleton";
import VizSensor from "react-visibility-sensor";
import { useRef, useState } from "react";

export default function HomePage(params) {
	return (
		<Box>
			<LandingTopbar />
			<HeroContainer pt={"4em"} />
			<FeaturesContainer />
			<PricesContainer />
			<ShopForMe />
			<SocialMediasContainer />
			<LandingFooter />
		</Box>
	);
}

function HeroContainer(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const [isVisible, setIsVisible] = useState(false);

	return (
		<VizSensor
			partialVisibility
			onChange={(visible) => {
				if (visible) setIsVisible(visible);
			}}
		>
			<Box bgcolor="primary.main" {...props}>
				<Container sx={{ pt: 10, pb: 4, zIndex: 0, position: "relative" }}>
					<Grid container>
						<Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
							<Typography
								variant={isSmallScreen ? "h5" : "h3"}
								sx={{ textTransform: "uppercase" }}
								fontWeight="bold"
								color="white.main"
								textAlign={isSmallScreen ? "center" : "left"}
							>
								Bringing You Closer To The World
							</Typography>
							<Typography variant={isSmallScreen ? "h6" : "h5"} color="white.main" mt={2} mb={8} textAlign={isSmallScreen ? "center" : "left"}>
								One step at a time. Download our app today and experience the world in the palm of your hand.
							</Typography>
							<Fade in={isVisible} timeout={1000}>
								<Box sx={{ display: { xs: "none", md: "flex" } }} justifyContent="space-between">
									<Button
										disabled={true}
										variant="contained"
										color="secondary"
										size="large"
										fullWidth
										style={{ color: "white" }}
										className={styles.dropShadow}
										sx={{ mr: 4, py: 2, fontSize: "1.25rem", fontWeight: "bold" }}
									>
										Download app
									</Button>
									<Link href="/auth/register" prefetch={false} passHref>
										<Button
											variant="outlined"
											color="secondary"
											size="large"
											fullWidth
											className={styles.dropShadow}
											sx={{
												mr: 4,
												py: 2,
												fontSize: "1.25rem",
												fontWeight: "bold",
												borderWidth: "2px",
												":hover": {
													borderWidth: "2px",
												},
											}}
										>
											Register Now
										</Button>
									</Link>
								</Box>
							</Fade>
						</Grid>
						<Grid item xs={12} md={5} order={{ xs: 1, md: 2 }} sx={{ position: { xs: "relative" } }}>
							<Slide direction="left" in={isVisible} timeout={1000}>
								<Box
									sx={{
										position: { xs: "absolute" },
										zIndex: -1,
										right: { xs: 0 },
										left: { xs: 0, md: "unset" },
										top: { xs: -36 },
									}}
								>
									<ImageWithSkeleton
										containersx={{ display: { xs: "flex", md: "initial" }, justifyContent: { xs: "center", md: "unset" } }}
										src="/pngs/hero-iphone.png"
										width="330"
										height="607"
										alt="App"
										className={styles.float}
									/>
								</Box>
							</Slide>
						</Grid>
						<Grid item xs={12} sx={{ display: { xs: "flex", md: "none" } }} order={{ xs: 3 }}>
							<Fade in={isVisible} timeout={1000}>
								<Box display="flex" mt={12} flex={1} flexDirection="column" alignItems={"center"}>
									<Button
										variant="contained"
										color="secondary"
										size="large"
										fullWidth
										style={{ color: "white" }}
										className={styles.dropShadow}
										sx={{ maxWidth: "90vw", mb: 2, py: 2, fontSize: "1rem", fontWeight: "bold" }}
									>
										In progress
										{/* Start Today */}
									</Button>
									<Button
										variant="outlined"
										color="secondary"
										size="large"
										fullWidth
										className={styles.dropShadow}
										sx={{
											maxWidth: "90vw",
											py: 2,
											fontSize: "1rem",
											fontWeight: "bold",
											borderWidth: "2px",
											":hover": {
												borderWidth: "2px",
											},
										}}
									>
										Register Now
									</Button>
								</Box>
							</Fade>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</VizSensor>
	);
}

function FeaturesContainer(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const [isVisible, setIsVisible] = useState(false);

	return (
		<VizSensor
			partialVisibility
			onChange={(visible) => {
				if (visible) setIsVisible(visible);
			}}
		>
			<Box {...props}>
				<Container>
					<Grid container pt={12}>
						<Grid item xs={12} md={7}>
							<Typography color="secondaryAccent.main" sx={{ textAlign: { xs: "center", md: "left" } }}>
								New Features
							</Typography>
							<Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight="bold" color="secondaryAccent.main" sx={{ textAlign: { xs: "center", md: "left" } }}>
								Shop from your favorite e-commerce platforms and have it delivered to you.
							</Typography>
						</Grid>
						<Grid item xs={12} md={7} position="relative" order={{ xs: 3, md: 2 }}>
							<Slide in={isVisible} direction="right" timeout={1000} mountOnEnter>
								<Box position="relative">
									<ImageWithSkeleton
										src="/pngs/new-features.png"
										alt="upcoming-apps"
										containersx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
										objectFit="cover"
										layout="responsive"
										width={"100%"}
										height={"60%"}
									/>
								</Box>
							</Slide>
						</Grid>
						<Grid item xs={12} md={5} justifyContent="center" display="flex" flexDirection="column" order={{ xs: 2, md: 3 }}>
							<Fade timeout={1000} in={isVisible} style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}>
								<Typography color="secondaryAccent.main" sx={{ textAlign: { xs: "center", md: "left" }, mt: { xs: 2, md: 0 } }}>
									Shop with a peace of mind knowing that the goods that you have purchased will reach you at your doorstep. With our new features and service,
									you can now order for your personal and commercial needs.
								</Typography>
							</Fade>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</VizSensor>
	);
}

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
			<Box bgcolor="#DEC3E6" pt={4} pb={8} {...props}>
				<Container sx={{ display: "flex", flexDirection: "column" }}>
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
					<Fade in={isVisible} timeout={1000} style={{ transitionDelay: 500 }}>
						<Box display="flex" justifyContent="center">
							<Link href="/resources" prefetch={false} passHref>
								<Button
								disabled={true}
									variant="contained"
									style={{ color: "white" }}
									sx={{ py: "1.4em", width: "20em" }}
									size="large"
									className={styles.dropShadow}
									color="secondary"
								>
									In progress
									{/* Get Your Quotation */}
								</Button>
							</Link>
						</Box>
					</Fade>
				</Container>
			</Box>
		</VizSensor>
	);
}

function PriceItem(props) {
	const { price, weight, src, size } = props.details || {};

	return (
		<Grid item md={2.4} sm={4} xs={6}>
			<Box
				className={styles.dropShadow}
				bgcolor="white.main"
				mx={1}
				justifyContent="center"
				alignItems="center"
				display="flex"
				flex={1}
				p={4}
				borderRadius={2}
				flexDirection="column"
				height={"14em"}
			>
				{/* <Typography textAlign="center">{`$${price.from} to $${price.to}`}</Typography> */}
				<Box flex={1} width="100%" alignItems={"center"} justifyContent={"center"} display={"flex"}>
					<Slide direction="up" in={props.isVisible} timeout={1000} style={{ transitionDelay: props.index * 100 }}>
						<Box height={size ?? "60%"} width="100%" position="relative" my={2}>
							<ImageWithSkeleton src={src} alt="upcoming-apps" objectFit="contain" layout="fill" />
						</Box>
					</Slide>
				</Box>
				<Typography textAlign="center" fontWeight={"bold"}>{`${weight.from} to ${weight.to} kg`}</Typography>
			</Box>
		</Grid>
	);
}

function ShopForMe(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const [isVisible, setIsVisible] = useState(false);

	return (
		<VizSensor
			partialVisibility
			onChange={(visible) => {
				if (visible) setIsVisible(visible);
			}}
		>
			<Box {...props} bgcolor={"#FDEFEE"} sx={{ zIndex: 0, position: "relative", overflow: "hidden" }}>
				<Container disableGutters>
					<Grid container>
						<Grid
							item
							xs={12}
							md={6}
							sx={{
								position: { xs: "absolute", md: "relative" },
								width: { xs: "100%", md: "unset" },
								height: { xs: "100%", md: "unset" },
								opacity: { xs: 0.2, md: 1 },
								zIndex: { xs: -1, md: 0 },
							}}
						>
							<Slide direction="right" timeout={1000} in={isVisible}>
								<Box position={"relative"} width={"100%"} height={"100%"}>
									<ImageWithSkeleton src={"/pngs/shop.png"} alt="shop for me" objectFit="cover" layout="fill" />
								</Box>
							</Slide>
						</Grid>
						<Grid item xs={12} md={6} display="flex" flexDirection="column" px={4} py={8}>
							<Typography textAlign={isSmallScreen ? "center" : "left"}>Shop for Me</Typography>
							<Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight="bold" textAlign={isSmallScreen ? "center" : "left"}>
								The store you want to buy from not accepting your card?
							</Typography>
							<Typography color={"secondaryAccent.main"} my={4} textAlign={isSmallScreen ? "center" : "left"}>
								Don’t worry! We can buy on your behalf. Use our ‘Shop For Me’ service to let us order from your favourite stores. Contact our Shopping
								Assistants to help with your orders.
							</Typography>
							<Fade in={isVisible} timeout={1000}>
								<Box justifyContent={"center"} alignItems={"center"} display={"flex"}>
									<Button
										variant="contained"
										style={{ color: "white" }}
										sx={{ py: "1.4em", width: "20em" }}
										size="large"
										className={styles.dropShadow}
										color="secondary"
									>
										Contact Us
									</Button>
								</Box>
							</Fade>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</VizSensor>
	);
}

function SocialMediasContainer(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const [isVisible, setIsVisible] = useState(false);
	return (
		<VizSensor
			onChange={(visible) => {
				if (visible) setIsVisible(visible);
			}}
		>
			<Box {...props} py={8}>
				<Container disableGutters>
					<Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight="bold" color="primary" mb={2} textAlign="center">
						Follow Us For Updates!
					</Typography>
					<Box display="flex" justifyContent="center" mb={2}>
						<IconButton>
							<Instagram color="primary" />
						</IconButton>
						<IconButton>
							<Facebook color="primary" />
						</IconButton>
						<IconButton>
							<Twitter color="primary" />
						</IconButton>
					</Box>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6} display={"flex"} justifyContent={"center"}>
							<Box display={"inline-block"} maxWidth="28em" sx={{ width: { md: "48vw", xs: "80vw" } }}>
								<TwitterTweetEmbed tweetId={"1460323737035677698"} options={{ height: 512, width: "100%" }} />
							</Box>
						</Grid>
						<Grid item xs={12} md={6} display={"flex"} justifyContent={"center"}>
							<Box display={"inline-block"} maxWidth="28em" sx={{ width: { md: "48vw", xs: "80vw" } }}>
								<TwitterTweetEmbed tweetId={"1471601029166899201"} options={{ height: 512, width: "100%" }} />
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</VizSensor>
	);
}
