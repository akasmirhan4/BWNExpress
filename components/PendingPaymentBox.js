import { Box, Button, Container, Grid, Typography } from "@mui/material";
import styles from "styles/main.module.scss";

export default function PendingPaymentsBox(props) {
	return (
		<Container {...props}>
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4 }} className={styles.dropShadow}>
				<Grid container spacing={2}>
					<Grid item md={6} xs={12}>
						<Typography color="text.main" fontWeight="500" sx={{ textAlign: { xs: "center", sm: "left" } }}>
							Pending Payment
						</Typography>
						<Typography sx={{ textAlign: { xs: "center", sm: "left" } }} variant="h4" fontWeight="500" my={2} color="primary">
							$30.00
						</Typography>
						<Typography sx={{ textAlign: { xs: "center", sm: "left" } }} variant="caption" color="lightGrey.main" display="block">
							Amount Due: $30.00
						</Typography>
						<Typography sx={{ textAlign: { xs: "center", sm: "left" } }} variant="caption" color="lightGrey.main" display="block">
							Due by: 01/01/2021
						</Typography>
					</Grid>
					<Grid item md={6} xs={12} alignItems="flex-end" justifyContent="center" display="flex" flexDirection="column">
						<Button variant="contained" sx={{ mb: 2 }} style={{ color: "white" }} fullWidth>
							Pay Now
						</Button>
						<Button variant="outlined" fullWidth>
							View Bill
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
