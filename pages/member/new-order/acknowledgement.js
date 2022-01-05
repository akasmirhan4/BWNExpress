import { Box, Container, Typography, Button, Grid, Breadcrumbs, Link, useMediaQuery, Checkbox } from "@mui/material";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { Masonry } from "@mui/lab";
import { useEffect, useState } from "react";
import { ChevronRightRounded } from "@mui/icons-material";
import NewOrderSteppers from "components/NewOrderSteppers";
import { useDispatch } from "react-redux";

export default function Acknowledgement() {
	const restrictedGoods = [
		{
			category: "Dangerous Items",
			details:
				"Including certain types of aerosols gases,  pressurised containers, corrosives, explosives, flammable solids, radioactive materials, oxidising substances, organic peroxides solids and flammable chemicals.",
		},
		{
			category: "Plants",
			details: "Plants and plant materials including seeds and cut flowers.",
		},
		{
			category: "Perishables",
			details:
				"Foodstuffs, food articles and beverages requiring refrigeration or other environmental control. Meat products that contains chicken, beef, duck, pork and others are not permitted to be brought through.",
		},
		{
			category: "Drug",
			details: "Cocaine, cannabis resin, LSD, narcotics, morphine, opium, psychotropic substances, etc.",
		},
		{
			category: "Pornography and indecent items or peripherals",
			details: "Foul materials, pornography and/or obscene material, any unsolicited indecent item or representation of any kind.",
		},
		{
			category: "Animals",
			details: "Live or dead animals, insects, reptiles of any kind, animal products, animal skins, meat and fur including hair products and pet supplements.",
		},
		{
			category: "Sharp Tools or Weapons",
			details:
				"Scissors, knives, cartridges, guns and gun accessories, slingshots, stun gun, pepper spray. Bows and arrows for recreational use are also not permitted to be brought through.",
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
	const dispatch = useDispatch();
	const [isAcknowledged, setIsAcknowledged] = useState(false);
	const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));

	useEffect(() => {
		setIsAcknowledged(window.sessionStorage.getItem("isAcknowledged") == "true");
	}, []);

	return (
		<MemberPageTemplate hideFAB>
			<Container sx={{ pt: 4 }}>
				<Box display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{ mb: 4 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="/member/dashboard" passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<Typography color="text.primary">New Order</Typography>
					</Breadcrumbs>
				</Box>
				<NewOrderSteppers sx={{ my: 4 }} activestep={0} />
				{/* ORDER FORM */}
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 }, boxShadow: (theme) => theme.shadows[1] }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
				>
					<Typography fontWeight="bold" variant={"h5"} sx={{ textTransform: "uppercase", pb: 4 }} textAlign={"center"}>
						RESTRICTED & PROHIBITED GOODS
					</Typography>
					<Masonry sx={{ m: 0 }} columns={isMdDown ? 1 : 2} spacing={2}>
						{restrictedGoods.map((item, index) => (
							<Box key={index} bgcolor={"#FFF0F3"} p={4} borderRadius={4}>
								<Typography fontWeight="bold" variant={"h5"} sx={{ pb: 1 }}>
									{item.category}
								</Typography>
								<Typography>{item.details}</Typography>
							</Box>
						))}
					</Masonry>
					<Grid container spacing={2}>
						<Grid item xs={12} md={8}>
							<Box display="flex" alignItems="center">
								<Checkbox
									checked={isAcknowledged}
									onChange={(e) => {
										window.sessionStorage.setItem("isAcknowledged", e.target.checked);
										setIsAcknowledged(e.target.checked);
									}}
								/>
								<Typography variant="body2" sx={{ color: "text.main" }}>
									By ticking this box, you understand that BWNExpress is unable to ship prohibited and non-approved restricted items.
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4} display={"flex"} justifyContent={"flex-end"}>
							<NextLink href="form" passHref>
								<Button
									disabled={!isAcknowledged}
									endIcon={<ChevronRightRounded />}
									variant="contained"
									color="accent"
									sx={{ width: { md: "unset", xs: "100%" } }}
								>
									Continue
								</Button>
							</NextLink>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}
