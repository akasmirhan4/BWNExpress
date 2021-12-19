import {
	Box,
	Button,
	CircularProgress,
	Container,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	Link,
	MenuItem,
	Select,
	TextField,
	Typography,
	useMediaQuery,
} from "@mui/material";
import styles from "../styles/main.module.scss";

import LandingTopbar from "../components/LandingTopbar";
import LandingFooter from "../components/LandingFooter";
import ImageWithSkeleton from "components/ImageWithSkeleton";
import { useState } from "react";
import { Masonry } from "@mui/lab";

export default function ResourcesPage(params) {
	return (
		<Box>
			<LandingTopbar bgcolor={"accent.main"} />
			<ShippingFee pt={"4em"} />
			<PermitTax />
			<RestrictedGoods />
			<LandingFooter />
		</Box>
	);
}

function ShippingFee(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

	const [delivery, setDelivery] = useState("");
	const [currency, setCurrency] = useState("");
	const [deliveryType, setDeliveryType] = useState("");
	const [incoTerms, setIncoTerms] = useState("");
	const [weight, setWeight] = useState(0);
	const [weightUnit, setWeightUnit] = useState("kg");
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [depth, setDepth] = useState(0);
	const [dimensionUnit, setDimensionUnit] = useState("cm");
	return (
		<Box {...props} bgcolor={"accent.main"}>
			<Container>
				<Grid container py={8} spacing={2}>
					<Grid item xs={12} md={4} display={"flex"} justifyContent={"center"} flexDirection={"column"}>
						<Typography
							color={"white.main"}
							fontWeight="bold"
							variant={"h4"}
							sx={{ textTransform: "uppercase", pb: 2, textAlign: { xs: "center", md: "left" } }}
						>
							Shipping Fee
						</Typography>
						<Typography color={"white.main"} fontWeight="bold" variant={isSmallScreen ? "h8" : "h6"} sx={{ textAlign: { xs: "center", md: "left" }, mb: 4 }}>
							Get your parcel delivered to you from as low as $6!
						</Typography>
					</Grid>
					<Grid item xs={12} md={8}>
						<Box px={6} py={4} display={"flex"} flexDirection={"column"} width={"100%"} bgcolor={"white.main"} borderRadius={4} className={styles.dropShadow}>
							<Typography>1. Where do you want your parcel to be delivered to?</Typography>
							<FormControl fullWidth sx={{ my: 2 }} margin="dense" className={styles.dropShadow}>
								<InputLabel>Delivery Option...</InputLabel>
								<Select value={delivery} label="Delivery Option..." onChange={(e) => setDelivery(e.target.value)}>
									<MenuItem value={"Self-pickup"}>Self-pickup</MenuItem>
									<MenuItem value={"Home delivery"}>Home delivery</MenuItem>
								</Select>
							</FormControl>
							<Typography>2. Select Options</Typography>
							<Grid container rowSpacing={1} columnSpacing={2} mb={2}>
								<Grid item xs={12} md={4}>
									<FormControl fullWidth margin="dense" className={styles.dropShadow}>
										<InputLabel>Currency...</InputLabel>
										<Select value={currency} label="Currency..." onChange={(e) => setCurrency(e.target.value)}>
											<MenuItem value={"USD"}>USD</MenuItem>
											<MenuItem value={"BND"}>BND</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={4}>
									<FormControl fullWidth margin="dense" className={styles.dropShadow}>
										<InputLabel>Delivery Type...</InputLabel>
										<Select value={deliveryType} label="Delivery Type..." onChange={(e) => setDeliveryType(e.target.value)}>
											<MenuItem value={"Express"}>Express</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={12} md={4}>
									<FormControl fullWidth margin="dense" className={styles.dropShadow}>
										<InputLabel>Incoterms...</InputLabel>
										<Select value={incoTerms} label="Incoterms..." onChange={(e) => setIncoTerms(e.target.value)}>
											<MenuItem value={"DDU"}>DDU</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
							<Typography>3. Shipping Weight and Dimensions</Typography>
							<Grid container rowSpacing={1} columnSpacing={2} mt={1}>
								<Grid item xs={12} md={3}>
									<TextField label="Weight" fullWidth margin="dense" className={styles.dropShadow} value={weight} onChange={(e) => setWeight(e.target.value)} />
								</Grid>
								<Grid item xs={12} md={3}>
									<FormControl fullWidth margin="dense" className={styles.dropShadow}>
										<InputLabel>unit</InputLabel>
										<Select value={weightUnit} label="unit" onChange={(e) => setWeightUnit(e.target.value)}>
											<MenuItem value={"kg"}>kg</MenuItem>
											<MenuItem value={"lbs"}>lbs</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
							<Grid container rowSpacing={1} columnSpacing={2} mt={2}>
								<Grid item xs={12} md={3}>
									<TextField
										label="Width (x)"
										fullWidth
										margin="dense"
										className={styles.dropShadow}
										value={width}
										onChange={(e) => setWidth(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField
										label="Height (y)"
										fullWidth
										margin="dense"
										className={styles.dropShadow}
										value={height}
										onChange={(e) => setHeight(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<TextField
										label="Depth (z)"
										fullWidth
										margin="dense"
										className={styles.dropShadow}
										value={depth}
										onChange={(e) => setDepth(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} md={3}>
									<FormControl fullWidth margin="dense" className={styles.dropShadow}>
										<InputLabel>unit</InputLabel>
										<Select value={dimensionUnit} label="unit" onChange={(e) => setDimensionUnit(e.target.value)}>
											<MenuItem value={"cm"}>cm</MenuItem>
											<MenuItem value={"inch"}>inch</MenuItem>
										</Select>
									</FormControl>
								</Grid>
							</Grid>
							<Divider sx={{ my: 2 }} />
							<Grid container spacing={2}>
								<Grid item xs={6} sm={3} display={"flex"} alignItems={"center"}>
									<Typography variant={isSmallScreen ? "body2" : "body1"}>Your shipping fee:</Typography>
								</Grid>
								<Grid item xs={6} sm={5}>
									<TextField disabled fullWidth margin="dense" className={styles.dropShadow} value={depth} onChange={(e) => setDepth(e.target.value)} />
								</Grid>
								<Grid item xs={12} sm={4} display={"flex"} alignItems={"center"}>
									<Button
										variant="contained"
										style={{ color: "white" }}
										sx={{ height: "85%" }}
										size="large"
										fullWidth
										className={styles.dropShadow}
										color="secondary"
									>
										Calculate
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

function PermitTax(props) {
	return (
		<Box {...props} bgcolor={"secondary.main"}>
			<Container>
				<Grid container spacing={2} position="relative" zIndex={0}>
					<Grid item xs={12} md={8}>
						<Box display={"flex"} justifyContent={"center"} flexDirection={"column"} py={8}>
							<Typography
								fontWeight="bold"
								variant={"h5"}
								sx={{ textTransform: "uppercase", pb: 2, textAlign: { xs: "center", md: "left" } }}
								color={"white.main"}
							>
								Permit/tax
							</Typography>
							<Typography sx={{ pb: 2, textAlign: { xs: "center", md: "left" } }}>
								All parcels are to be declared to Brunei Customs. So, it is important that you must declare all items for the permit application, the original
								invoice from seller and declaration conducted by the courier service provider. All payments are to be made prior to permit being applied.
							</Typography>
							<Typography sx={{ pb: 2, textAlign: { xs: "center", md: "left" } }}>
								For more information on Permit License, please visit the{" "}
								<Link href="https://www.mofe.gov.bn/Customs/Import-and-Export-Licence-Permit.aspx" target={"_blank"} style={{ fontWeight: "bold" }}>
									Ministry of Finance and Economy’s Import and Export Licence/Permit
								</Link>
							</Typography>
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
						display={"flex"}
						justifyContent={"flex-end"}
						sx={{
							position: { xs: "absolute", md: "unset" },
							width: { xs: "100%", md: "unset" },
							height: { xs: "100%", md: "unset" },
							zIndex: { xs: -1, md: 1 },
							opacity: { xs: 0.2, md: 1 },
						}}
					>
						<ImageWithSkeleton
							src="/svgs/permit.svg"
							containersx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}
							objectFit="contain"
							layout="responsive"
							width={"100%"}
							height={"60%"}
						/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
function RestrictedGoods(props) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const restrictedGoods = [
		{
			category: "General",
			details: "Power banks, batteries, standalone batteries, metal detector, radar detector, lock picks, telescopes, magnets, tattoo machine and equipment.",
		},
		{
			category: "Dangerous Items",
			details:
				"Including all types of aerosols (hairspray, deodorant, perfumes, etc.) gases, and pressurised containers, corrosives, explosives, flammable solids, and radioactive materials, oxidising substances and organic peroxides solids, flammable chemicals, monoxide hair growth treatments..",
		},
		{
			category: "Plants",
			details: "Plants and plant materials including seeds and cut flowers.",
		},
		{
			category: "Perishables",
			details: "Foodstuffs and persihable food articles and beverages requiring refrigeration or other environmental control.",
		},
		{
			category: "Drug",
			details: "Cocaine, cannabis resin, LSD, narcotics, morphine, opium, psychotropic substances, etc.",
		},
		{
			category: "Pornography",
			details: "Foul materials, pornography and/or obscene material, any unsolicited indecent item or representation of any kind.",
		},
		{
			category: "Animals",
			details: "Live or dead animals, insects, reptiles of any kind, animal products, animal skins, meat and fur including hair products and pet supplements.",
		},
		{
			category: "Sharp Tools or Weapons",
			details: "Scissors, knives needles and cartidges, guns and gun accessories, slingshots, stun gun, pepper spray.",
		},
		{
			category: "Electronics",
			details:
				"Shipments containing laser (laser hair removals or laser pens), walkie-talkie, used laptops manufactured before 2008, smart watches containing sim slots or/and cameras.",
		},
		{
			category: "Tobacco",
			details: "Cigarettes, cigars, electronic cigarettes and accessories, tobacco, hookah and hookah accessories.",
		},
		{
			category: "Fake Games",
			details: "Toy weapons, paintball guns, BB guns, antique weapons, swords, knives, fake grenades, handcuffs, items that could be used as weapons, etc.",
		},
		{
			category: "Toys",
			details: "Drones, quadcopters, robots, and slime.",
		},
		{
			category: "Liquids",
			details: "Liquids in large quantities nail polish, paint and ink.",
		},
	];
	return (
		<Box {...props} py={8}>
			<Container>
				<Typography fontWeight="bold" variant={"h5"} sx={{ textTransform: "uppercase", pb: 4 }} textAlign={"center"}>
					RESTRICTED GOODS
				</Typography>
				<Masonry sx={{m: 0}} columns={isSmallScreen ? 1 : 2} spacing={2}>
					{restrictedGoods.map((item, index) => (
						<Box key={index} bgcolor={"#FFF0F3"} p={4} borderRadius={4}>
							<Typography fontWeight="bold" variant={"h5"} sx={{ pb: 1 }}>
								{item.category}
							</Typography>
							<Typography>{item.details}</Typography>
						</Box>
					))}
				</Masonry>
				<Typography my={4} textAlign={"center"}>
					For more information and any further enquires, do not hesitate to contact us.
				</Typography>
			</Container>
		</Box>
	);
}
