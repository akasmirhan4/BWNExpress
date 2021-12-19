import { Box, Button, CircularProgress, Container, Grid, IconButton, Typography, useMediaQuery } from "@mui/material";
import styles from "../styles/main.module.scss";

import LandingTopbar from "../components/LandingTopbar";
import LandingFooter from "../components/LandingFooter";
import ImageWithSkeleton from "components/ImageWithSkeleton";

export default function AboutUsPage(params) {
	return (
		<Box>
			<LandingTopbar bgcolor={"#FDEFEE"} darkText />
			<AboutUs pt={"5em"} />
			<HowItWorks />
			<Location />
			<Management />
			<LandingFooter />
		</Box>
	);
}

function AboutUs(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	return (
		<Box {...props} bgcolor={"#FDEFEE"}>
			<Container>
				<Grid container pt={4} pb={4} spacing={2}>
					<Grid item xs={12} md={5}>
						<Typography fontWeight="bold" variant={"h5"} sx={{ textTransform: "uppercase", pb: 2, textAlign: { xs: "center", md: "left" } }}>
							About Us
						</Typography>
						<Typography sx={{ textAlign: { xs: "center", md: "left" } }}>
							A locally registered logistics company specialising in the commercial and industrial transportation of goods and products worldwide to Brunei
							Darussalam. As a reliable service with competitive delivery prices, we are committed to providing a positive experience from our Parcel Collection
							Centre in Malaysia where your items will be safely delivered to your doorstep in Brunei Darussalam.
						</Typography>
					</Grid>
					<Grid item xs={12} md={7}>
						<Grid container spacing={2} my={1}>
							<Grid item xs={12} sm={4}>
								<Box
									bgcolor={"primary.main"}
									alignItems={"center"}
									justifyContent={"center"}
									display="flex"
									flexDirection={"column"}
									p={2}
									borderRadius={2}
									height="100%"
								>
									<Typography
										fontWeight="bold"
										variant={isSmallScreen ? "h4" : "h3"}
										sx={{ textTransform: "uppercase", pb: 2 }}
										color="white.main"
										textAlign={"center"}
									>
										3.9K
									</Typography>
									<Typography variant={isSmallScreen ? "h8" : "h8"} color="white.main" textAlign={"center"}>
										Registered Members
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Box
									bgcolor={"offWhite.main"}
									alignItems={"center"}
									justifyContent={"center"}
									display="flex"
									flexDirection={"column"}
									p={2}
									borderRadius={2}
									height="100%"
								>
									<Typography
										fontWeight="bold"
										variant={isSmallScreen ? "h4" : "h3"}
										sx={{ textTransform: "uppercase", pb: 2 }}
										color="white.main"
										textAlign={"center"}
									>
										200
									</Typography>
									<Typography variant={isSmallScreen ? "h8" : "h8"} color="white.main" textAlign={"center"}>
										Parcels Handled (Outbound)
									</Typography>
								</Box>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Box
									bgcolor={"accent.main"}
									alignItems={"center"}
									justifyContent={"center"}
									display="flex"
									flexDirection={"column"}
									p={2}
									borderRadius={2}
									height="100%"
								>
									<Typography
										fontWeight="bold"
										variant={isSmallScreen ? "h4" : "h3"}
										sx={{ textTransform: "uppercase", pb: 2 }}
										color="white.main"
										textAlign={"center"}
									>
										40k
									</Typography>
									<Typography variant={isSmallScreen ? "h8" : "h8"} color="white.main" textAlign={"center"}>
										Parcels Handled (Inbound)
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

function HowItWorks(props) {
	return (
		<Box {...props} py={8}>
			<Container>
				<Typography fontWeight="bold" variant={"h5"} sx={{ textTransform: "uppercase", pb: 4 }} textAlign={"center"}>
					How It Works
				</Typography>
				<Grid container spacing={4}>
					<Grid item xs={12} md={4} display="flex" flexDirection={"column"}>
						<Box position={"relative"} height={"16em"} width="100%">
							<ImageWithSkeleton src="/svgs/register-with-us.svg" objectFit="contain" layout="fill" />
						</Box>
						<Typography fontWeight="bold" variant={"h6"} sx={{ py: 2 }} textAlign={"center"}>
							Register with us and get your BWNExpress address.
						</Typography>
						<Typography textAlign={"center"}>
							Then, you are ready to shop at your favourite sites such as Uniqlo Malaysia, Lazada, Shopee, and many more!
						</Typography>
					</Grid>
					<Grid item xs={12} md={4} display="flex" flexDirection={"column"}>
						<Box position={"relative"} height={"16em"} width="100%">
							<ImageWithSkeleton src="/svgs/shop-online-stores.svg" objectFit="contain" layout="fill" />
						</Box>
						<Typography fontWeight="bold" variant={"h6"} sx={{ pt: 2, pb: 6 }} textAlign={"center"}>
							Shop from any online stores.
						</Typography>
						<Typography textAlign={"center"}>
							Start shopping from your favourite e-commerce stores today and get the best deals and we will receive them on your behalf.
						</Typography>
					</Grid>
					<Grid item md={4} display="flex" flexDirection={"column"}>
						<Box position={"relative"} height={"16em"} width="100%">
							<ImageWithSkeleton src="/svgs/package-delivered.svg" objectFit="contain" layout="fill" />
						</Box>
						<Typography fontWeight="bold" variant={"h6"} sx={{ py: 2 }} textAlign={"center"}>
							Get your packages delivered or collect them from our shop.
						</Typography>
						<Typography textAlign={"center"}>
							We take care of your packages once it has arrived to BWNExpress address. When in Brunei, we offer the option of delivering to your registered
							address or you can collect your parcel at our local office.
						</Typography>
					</Grid>
				</Grid>
				<Typography fontWeight="bold" variant={"h5"} sx={{ py: 4 }} textAlign={"center"}>
					What are you waiting for?
				</Typography>
				<Box display={"flex"} justifyContent={"center"}>
					<Button
						variant="contained"
						style={{ color: "white" }}
						sx={{ py: "1.4em", width: "20em" }}
						size="large"
						className={styles.dropShadow}
						color="secondary"
					>
						Register now!
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
function Location(props) {
	return (
		<Box {...props} bgcolor={"secondary.main"}>
			<Container disableGutters>
				<Grid container>
					<Grid item xs={12} md={6} bgcolor={"secondary.main"} px={4} py={8}>
						<Typography color={"white.main"} fontWeight={"bold"} variant="h4">
							BWNExpress
						</Typography>
						<Typography color={"white.main"} fontWeight={"bold"} variant="h6">
							P20025400
						</Typography>
						<Typography color={"white.main"} my={2}>
							Fu Zhou Shiyyi Association Building, G6, Ground Floor, Jalan Utama Berakas, Bandar Seri Begawan BB1314
						</Typography>
						<Typography color={"white.main"} fontWeight={"bold"} mt={4}>
							Opening Hours:
						</Typography>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Typography color={"white.main"}>
								Monday - Thursday
							</Typography>
							<Typography color={"white.main"} fontWeight={"bold"}>
								11:30 am - 5:30 pm
							</Typography>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Typography color={"white.main"}>
								Friday
							</Typography>
							<Typography color={"white.main"} fontWeight={"bold"}>
								2:00 pm - 6:00 pm
							</Typography>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Typography color={"white.main"}>
								Saturday
							</Typography>
							<Typography color={"white.main"} fontWeight={"bold"}>
								11:30 am - 5:30 pm
							</Typography>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Typography color={"white.main"}>
								Sunday
							</Typography>
							<Typography color={"white.main"} fontWeight={"bold"}>
								CLOSED
							</Typography>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Typography color={"white.main"}>
								Public Holidays
							</Typography>
							<Typography color={"white.main"} fontWeight={"bold"}>
								CLOSED
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} md={6} sx={{ minHeight: { xs: "100vw", md: "unset" } }}>
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6684.666154480427!2d114.95074721515645!3d4.985079600533254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3222f71f113ed259%3A0x5b82fd1a33ae8f2a!2sbwnexpress.com!5e0!3m2!1sen!2sbn!4v1639897900693!5m2!1sen!2sbn"
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen=""
							loading="lazy"
						></iframe>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
function Management(props) {
	return (
		<Box {...props} my={8}>
			<Container>
				<Typography variant={"h4"} fontWeight={"bold"} color={"secondaryAccent.main"} my={2} sx={{ textAlign: { xs: "center", md: "left" } }}>
					Top Management
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={4} alignItems={"center"} justifyContent={"center"} display="flex" flexDirection={"column"}>
						<Box width={"10em"} maxWidth={"100%"} height={"10em"} borderRadius={"8em"} bgcolor={"primary.main"} my={2}></Box>
						<Typography variant="h6" fontWeight={"bold"} textAlign={"center"}>
							Name
						</Typography>
						<Typography textAlign={"center"}>Chief Executive Officer</Typography>
					</Grid>
					<Grid item xs={12} md={4} alignItems={"center"} justifyContent={"center"} display="flex" flexDirection={"column"}>
						<Box width={"10em"} maxWidth={"100%"} height={"10em"} borderRadius={"8em"} bgcolor={"primary.main"} my={2}></Box>
						<Typography variant="h6" fontWeight={"bold"} textAlign={"center"}>
							Name
						</Typography>
						<Typography textAlign={"center"}>Chief Operating Officer</Typography>
					</Grid>
					<Grid item xs={12} md={4} alignItems={"center"} justifyContent={"center"} display="flex" flexDirection={"column"}>
						<Box width={"10em"} maxWidth={"100%"} height={"10em"} borderRadius={"8em"} bgcolor={"primary.main"} my={2}></Box>
						<Typography variant="h6" fontWeight={"bold"} textAlign={"center"}>
							Name
						</Typography>
						<Typography textAlign={"center"}>Chief Technology Officer</Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
