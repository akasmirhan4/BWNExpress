import { Box, Button, Container, Grid, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import styles from "../styles/main.module.scss";

import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import LandingTopbar from "../components/LandingTopbar";
import LandingFooter from "../components/LandingFooter";

export default function home(params) {
	return (
		<Box>
			<LandingTopbar />
			<HeroContainer pt={"4em"} />
			<FeaturesContainer />
			<PricesContainer />
			<SocialMediasContainer />
			<LandingFooter />
		</Box>
	);
}

function HeroContainer(props) {
	return (
		<Box bgcolor="primary.main" {...props}>
			<Container sx={{ pt: 12, pb: 4 }}>
				<Grid container>
					<Grid item md={7}>
						<Typography variant="h3" sx={{ textTransform: "uppercase" }} fontWeight="bold" color="#FFFFFF">
							{`Bringing You Closer To The World`}
						</Typography>
						<Typography variant="h5" color="#FFFFFF" mt={2} mb={12}>
							One step at a time. Download our app today and experience the world in the palm of your hand.
						</Typography>
						<Box display="flex" justifyContent="space-between">
							<Button
								variant="contained"
								color="secondary"
								size="large"
								fullWidth
								style={{ color: "white" }}
								className={styles.dropShadow}
								sx={{ mr: 4, py: 2, fontSize: "1.25rem", fontWeight: "bold" }}
							>
								Start Today
							</Button>
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
						</Box>
					</Grid>
					<Grid item md={5} position="relative">
						<Box position="absolute" right="0px" top="-36px">
							<Image src="/pngs/hero-iphone.png" width="330" height="607" alt="App" />
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

function FeaturesContainer(props) {
	return (
		<Box {...props}>
			<Container>
				<Grid container pt={12} position="relative">
					<Grid item md={7}>
						<Typography color="secondaryAccent.main">New Features</Typography>
						<Typography variant="h4" fontWeight="bold" color="secondaryAccent.main">
							Shop from your favorite e-commerce platforms and have it delivered to you.
						</Typography>
						<Box height="30em" />
					</Grid>
					<Grid item md={5} justifyContent="center" display="flex" flexDirection="column">
						<Typography color="secondaryAccent.main">
							Shop with a peace of mind knowing that the goods that you have purchased will reach you at your doorstep. With our new features and service, you
							can now order for your personal and commercial needs.
						</Typography>
					</Grid>
					<Box width="100%" maxWidth={"64em"} height="32em" position="absolute" bottom="0px" left="-16em">
						<Image src="/pngs/new-features.png" alt="upcoming-apps" objectFit="contain" layout="fill" />
					</Box>
				</Grid>
			</Container>
		</Box>
	);
}

function PricesContainer(props) {
	const pricingDetails = [
		{ price: { from: "6", to: "10" }, weight: { from: "0.1", to: "1.99" }, src: "/pngs/mail.png" },
		{ price: { from: "14", to: "18" }, weight: { from: "2.0", to: "7.99" }, src: "/pngs/envelope.png" },
		{ price: { from: "23", to: "27" }, weight: { from: "8.0", to: "13.99" }, src: "/pngs/box.png", size: "40%" },
		{ price: { from: "31", to: "35" }, weight: { from: "14", to: "19.99" }, src: "/pngs/box.png", size: "60%" },
		{ price: { from: "39", to: "43" }, weight: { from: "20", to: "25.99" }, src: "/pngs/box.png", size: "80%" },
	];

	return (
		<Box bgcolor="#DEC3E6" pt={4} pb={8} {...props}>
			<Container sx={{ display: "flex", flexDirection: "column" }}>
				<Typography color="#FFFFFF">Prices</Typography>
				<Typography variant="h4" fontWeight="bold" color="#FFFFFF" mb={2}>
					Affordable choice of delivery to your doorstep.
				</Typography>
				<Box display="flex" justifyContent="space-around" my={4}>
					{pricingDetails.map((details, index) => (
						<PriceItem details={details} key={index} />
					))}
				</Box>
				<Box display="flex" justifyContent="center">
					<Button variant="contained" style={{ color: "white" }} sx={{ py: "1.4em", px: "3em" }} size="large" className={styles.dropShadow} color="secondary">
						Get Your Quotation
					</Button>
				</Box>
			</Container>
		</Box>
	);
}

function PriceItem(props) {
	const { price, weight, src, size } = props.details || {};

	return (
		<Box
			className={styles.dropShadow}
			bgcolor="#FFFFFF"
			flex={1}
			mx={1}
			justifyContent="center"
			alignItems="center"
			display="flex"
			p={2}
			borderRadius={2}
			flexDirection="column"
			height={"14em"}
		>
			<Typography textAlign="center">{`$${price.from} to $${price.to}`}</Typography>
			<Box flex={1} width="100%" alignItems={"center"} justifyContent={"center"} display={"flex"}>
				<Box height={size ?? "60%"} width="100%" position="relative" my={2}>
					<Image src={src} alt="upcoming-apps" objectFit="contain" layout="fill" />
				</Box>
			</Box>
			<Typography textAlign="center">{`${weight.from} to ${weight.to} kg`}</Typography>
		</Box>
	);
}

function SocialMediasContainer(props) {
	return (
		<Box {...props} py={8}>
			<Container>
				<Typography variant="h3" fontWeight="bold" color="primary" mb={2} textAlign="center">
					Follow Us For Updates!
				</Typography>
				<Box display="flex" justifyContent="center">
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
				<Box height={512}></Box>
			</Container>
		</Box>
	);
}
