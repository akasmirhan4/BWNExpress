import { Box, Button, Container, Grid, Skeleton, Typography } from "@mui/material";
import { auth, getPendingPayments } from "lib/firebase";
import { currencyFormatter } from "lib/formatter";
import { selectUserExists } from "lib/slices/userSlice";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PendingPaymentsBox(props) {
	const [totalAmountDue, setTotalAmountDue] = useState(null);
	const [amountDue, setAmountDue] = useState(null);
	const [dueSince, setDueSince] = useState(null);
	const [pendingPayments, setPendingPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const userExist = useSelector(selectUserExists);

	useEffect(() => {
		console.log("user: ", auth.currentUser);
		if (userExist) {
			(async () => {
				const _pendingPayments = await getPendingPayments();
				setPendingPayments(_pendingPayments);
				if (_pendingPayments?.length) {
					setDueSince(_pendingPayments[0].timestamp.toDate());
					setAmountDue(_pendingPayments[0].amountDue);
					setTotalAmountDue(_pendingPayments.reduce((a, v) => a + v.amountDue, 0));
				}
				setLoading(false);
			})();
		}
	}, [userExist]);

	return (
		<Container {...props}>
			<Box sx={{ borderColor: "border.main", borderWidth: 0.5, borderStyle: "solid", borderRadius: 4, py: 2, px: 4, boxShadow: (theme) => theme.shadows[1] }}>
				<Grid container spacing={2}>
					<Grid item md={6} xs={12} sx={{ display:"flex", flexDirection:"column", alignItems: { xs: "center", md: "left" } }}>
						<Typography color="text.main" fontWeight="500" sx={{ textAlign: { xs: "center", md: "left" } }}>
							Pending Payment
						</Typography>
						{loading ? (
							<Fragment>
								<Skeleton variant="text" width="8em" height="3em" />
								<Skeleton variant="text" width="6em" />
								<Skeleton variant="text" width="12em" />
							</Fragment>
						) : pendingPayments?.length > 0 ? (
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
						<Button disabled={!pendingPayments?.length} variant="contained" sx={{ mb: 2 }} fullWidth>
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
