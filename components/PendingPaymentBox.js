import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { getPendingPayments } from "lib/firebase";
import { currencyFormatter } from "lib/formatter";
import { selectUser } from "lib/slices/userSlice";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "styles/main.module.scss";

export default function PendingPaymentsBox(props) {
	const user = useSelector(selectUser);
	const [totalAmountDue, setTotalAmountDue] = useState(null);
	const [amountDue, setAmountDue] = useState(null);
	const [dueSince, setDueSince] = useState(null);
	const [pendingPayments, setPendingPayments] = useState([]);

	useEffect(() => {
		if (user) {
			(async () => {
				const _pendingPayments = await getPendingPayments();
				setPendingPayments(_pendingPayments);
				if (!_pendingPayments?.length) return;
				setDueSince(_pendingPayments[0].timestamp.toDate());
				setAmountDue(_pendingPayments[0].amountDue);
				setTotalAmountDue(_pendingPayments.reduce((a, v) => a + v.amountDue, 0));
			})();
		}
	}, [user]);

	return (
		<Container {...props}>
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4 }} className={styles.dropShadow}>
				<Grid container spacing={2}>
					<Grid item md={6} xs={12}>
						<Typography color="text.main" fontWeight="500" sx={{ textAlign: { xs: "center", md: "left" } }}>
							Pending Payment
						</Typography>
						{pendingPayments?.length > 0 ? (
							<Fragment>
								<Typography sx={{ textAlign: { xs: "center", md: "left" } }} variant="h4" fontWeight="500" mt={1} color="primary">
									{totalAmountDue ? `${currencyFormatter.format(totalAmountDue)}` : "..."}
								</Typography>
								<Typography sx={{ textAlign: { xs: "center", md: "left" } }} variant="caption" color="lightGrey.main" display="block">
									{amountDue ? `Amount Due: ${currencyFormatter.format(amountDue)}` : "..."}
								</Typography>
								<Typography sx={{ textAlign: { xs: "center", md: "left" } }} variant="caption" color="lightGrey.main" display="block">
									{dueSince ? `Due since: ${dueSince.toLocaleDateString()}` : "..."}
								</Typography>
							</Fragment>
						) : (
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
								<Typography sx={{ textAlign: { xs: "center", md: "left" } }} variant="h4" fontWeight="500" mt={1} color="primary">
									{currencyFormatter.format(0)}
								</Typography>
								<Typography sx={{ textAlign: { xs: "center", md: "left" } }} variant="caption" color="lightGrey.main" display="block" fontStyle={"italic"}>
									Nothing due <span style={{ fontStyle: "normal" }}>👏</span>
								</Typography>
							</Box>
						)}
					</Grid>
					<Grid item mt={2} md={6} xs={12} alignItems="flex-end" justifyContent="center" display="flex" flexDirection="column">
						<Button disabled={!pendingPayments?.length} variant="contained" sx={{ mb: 2 }} style={{ color: "white" }} fullWidth>
							Pay Now
						</Button>
						<Button variant="outlined" fullWidth disabled={!pendingPayments?.length}>
							View Bill
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
