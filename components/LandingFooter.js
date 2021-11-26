import { Container, Grid, useTheme, Box, Typography } from "@mui/material";
import BrandWithLogo from "./BrandWithLogo";
import Link from "next/link";
import { Email, Phone, WhatsApp } from "@mui/icons-material";

export default function LandingFooter(params) {
	const { palette } = useTheme();
	return (
		<Box bgcolor="lightGrey.main" py={4}>
			<Container>
				<Grid container>
					<Grid item md={6} display="flex" flexDirection="column" justifyContent="center">
						<BrandWithLogo logoColor={palette.primary.main} my={2} />
						<Link href="home" passHref>
							<Box display="flex" alignItems="center" mb={1}>
								<Phone sx={{ color: "#FFFFFF", mr: 2 }} />
								<Typography color="#FFFFFF" fontWeight={500}>
									(673) 239 0782
								</Typography>
							</Box>
						</Link>
						<Link href="home" passHref>
							<Box display="flex" alignItems="center" mb={1}>
								<WhatsApp sx={{ color: "#FFFFFF", mr: 2 }} />
								<Typography color="#FFFFFF" fontWeight={500}>
									(673) 812 0164
								</Typography>
							</Box>
						</Link>
						<Link href="home" passHref>
							<Box display="flex" alignItems="center" mb={1}>
								<Email sx={{ color: "#FFFFFF", mr: 2 }} />
								<Typography color="#FFFFFF" fontWeight={500}>
									support@bwnexpress.com
								</Typography>
							</Box>
						</Link>
					</Grid>
					<Grid item md={6} display="flex" flexDirection="column" justifyContent="center">
						<Typography color="#FFFFFF" fontWeight="bold">
							Who Are We?
						</Typography>
						<Typography variant="body2" color="#FFFFFF" lineHeight={2}>
							A locally registered logistics company specialising in the commercial and industrial transportation of goods and products worldwide to Brunei
							Darussalam. As a reliable service with competitive delivery prices, we are committed to providing a positive experience from our{" "}
							<span style={{ color: palette.secondary.main, fontWeight: "bold" }}>Parcel Collection Centre in Malaysia</span> where your items will be safely
							delivered to your doorstep in Brunei Darussalam.
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
