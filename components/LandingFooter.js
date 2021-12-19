import { Container, Grid, useTheme, Box, Typography, useMediaQuery } from "@mui/material";
import BrandWithLogo from "./BrandWithLogo";
import Link from "next/link";
import { Email, Phone, WhatsApp } from "@mui/icons-material";

export default function LandingFooter(params) {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const { palette } = useTheme();
	return (
		<Box bgcolor="lightGrey.secondary" pt={2} pb={6}>
			<Container>
				<Grid container spacing={2} justifyContent={"center"} display="flex">
					<Grid item xs={12} sm={6} md={4} display="flex" flexDirection="column" justifyContent="center" order={{ xs: 2, sm: 1 }}>
						<Link href="/home" passHref>
							<Box display="flex" alignItems="center" sx={{ justifyContent: { xs: "center", sm: "flex-start" } }} mb={1}>
								<Phone sx={{ color: "#FFFFFF", mr: 2 }} />
								<Typography color="#FFFFFF" fontWeight={500}>
									(673) 239 0782
								</Typography>
							</Box>
						</Link>
						<Link href="/home" passHref>
							<Box display="flex" alignItems="center" mb={1} sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
								<WhatsApp sx={{ color: "#FFFFFF", mr: 2 }} />
								<Typography color="#FFFFFF" fontWeight={500}>
									(673) 812 0164
								</Typography>
							</Box>
						</Link>
						<Link href="/home" passHref>
							<Box display="flex" alignItems="center" mb={1} sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}>
								<Email sx={{ color: "#FFFFFF", mr: 2 }} />
								<Typography color="#FFFFFF" fontWeight={500}>
									support@bwnexpress.com
								</Typography>
							</Box>
						</Link>
					</Grid>
					<Grid
						item
						xs={12}
						sm={4}
						display="flex"
						sx={{ justifyContent: { xs: "center", sm: "flex-end", md: "center" } }}
						alignItems={"center"}
						order={{ xs: 1, sm: 2 }}
					>
						<BrandWithLogo logoColor={palette.primary.main} my={2} />
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
						display="flex"
						sx={{ flexDirection: { md: "column", xs: "row" } }}
						justifyContent="center"
						alignItems={"flex-end"}
						order={{ xs: 3 }}
					>
						<Link href="/home" passHref>
							<Typography color="#FFFFFF" fontWeight={500} mb={1} mx={1}>
								Privacy Policy
							</Typography>
						</Link>
						<Link href="/home" passHref>
							<Typography color="#FFFFFF" fontWeight={500} mb={1} mx={1}>
								Sitemap
							</Typography>
						</Link>
						<Typography color="#FFFFFF" fontWeight={500} mb={1} mx={1}>
							© 2021
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
