import { Box, Button, Container, Grid, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import styles from "../styles/main.module.scss";

import { Facebook, Instagram, Phone, Twitter } from "@mui/icons-material";
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
							Bringing You Closer To The World
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
								sx={{ mr: 4, py: 2, fontSize: "1.25rem", fontWeight: "bold" }}
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
				<Grid container pt={24} pb={12}>
					<Grid item md={5}>
						<Box bgcolor="accent.main" width="512px" height="512px" borderRadius="50%" />
					</Grid>
					<Grid item md={7} justifyContent="center" display="flex" flexDirection="column">
						<Typography color="secondaryAccent.main">New Features</Typography>
						<Typography variant="h3" sx={{ textTransform: "uppercase" }} fontWeight="bold" color="secondaryAccent.main" mb={4}>
							Making It Easier
						</Typography>
						<Typography color="secondaryAccent.main" mb={2}>
							We simplified the steps to delivering your parcel to your doorstep with an all new tracking feature.
						</Typography>
						<Typography color="secondaryAccent.main" mb={2}>
							We simplified the steps to delivering your parcel to your doorstep with an all new tracking feature.
						</Typography>
						<Typography color="secondaryAccent.main">
							We simplified the steps to delivering your parcel to your doorstep with an all new tracking feature.
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

function PricesContainer(props) {
	const pricingDetails = [
		{ price: { from: 5, to: 8 }, size: [28, 20], weight: 0.5 },
		{ price: { from: 8, to: 11 }, size: [38, 32], weight: 1 },
		{ price: { from: 11, to: 14 }, size: [34, 25, 8], weight: 2 },
		{ price: { from: 14, to: 17 }, size: [34, 25, 15], weight: 5 },
		{ price: { from: 17, to: 20 }, size: [38, 32, 20], weight: 10 },
	];

	return (
		<Box bgcolor="secondaryAccent.main" pt={4} pb={8} {...props}>
			<Container sx={{ display: "flex", flexDirection: "column" }}>
				<Typography color="#FFFFFF">Prices</Typography>
				<Typography variant="h3" sx={{ textTransform: "uppercase" }} fontWeight="bold" color="#FFFFFF" mb={2}>
					Providing Competitive Pricing
				</Typography>
				<Box display="flex" justifyContent="space-around" my={4}>
					{pricingDetails.map((details, index) => (
						<PriceItem details={details} key={index} />
					))}
				</Box>
				<Box display="flex" justifyContent="center">
					<Button variant="contained" style={{ color: "white" }} size="large" className={styles.dropShadow}>
						Get Your Quotation
					</Button>
				</Box>
			</Container>
		</Box>
	);
}

function PriceItem(props) {
	const { price, size, weight } = props.details;

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
		>
			<Typography textAlign="center">{`$${price.from} to $${price.to}`}</Typography>
			<Box height={128}></Box>
			<Typography textAlign="center">{`${size[0]}cm x ${size[1]}cm${size[2] ? ` x ${size[2]}cm` : ""}`}</Typography>
			<Typography textAlign="center">{`${weight}kg`}</Typography>
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
