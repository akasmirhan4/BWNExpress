import { Box, Container, Typography, Breadcrumbs, Link, Checkbox, Grid, Button } from "@mui/material";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectData, selectIsAcknowledged, setSuccess } from "lib/slices/newOrderSlice";
import { useRouter } from "next/router";
import NewOrderSteppers from "components/NewOrderSteppers";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { functions, auth, storage } from "lib/firebase";
import OrderSummary from "components/OrderSummary";
import { httpsCallable } from "firebase/functions";
import { ref, uploadBytes } from "firebase/storage";

export default function Summary() {
	const dispatch = useDispatch();
	const router = useRouter();

	const [isAccurate, setIsAccurate] = useState(false);
	const isAcknowledged = useSelector(selectIsAcknowledged);
	const newOrderData = useSelector(selectData);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isAcknowledged) {
			toast("Redirecting...");
			router.push("acknowledgement");
		} else if (!newOrderData) {
			toast("Redirecting...");
			router.push("form");
		}
	}, [newOrderData, isAcknowledged]);

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Box display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{ mb: 4 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="dashboard" passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<Typography color="text.primary">New Order</Typography>
					</Breadcrumbs>
				</Box>
				<NewOrderSteppers sx={{ my: 4 }} activestep={2} />
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 }, boxShadow: (theme) => theme.shadows[1] }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
				>
					<OrderSummary orderData={newOrderData} />
					<Box display="flex" alignItems="center" sx={{ my: 2 }}>
						<Checkbox checked={isAccurate} onChange={(e) => setIsAccurate(e.target.checked)} />
						<Typography variant="body2" sx={{ color: "text.main" }}>
							By ticking this box, you hereby declare that the information provided is accurate and complete. You also understand that if subject to inaccurate
							or incomplete information, your parcel may render delayed or lost. [TODO: Review This]
						</Typography>
					</Box>
					<Grid container spacing={2}>
						<Grid item xs={6} display={"flex"} order={{ xs: 16, md: 16 }}>
							<NextLink href="form" passHref>
								<Button startIcon={<ChevronLeftRounded />} variant="contained" color="accent" sx={{ width: { md: "unset", xs: "100%" } }}>
									Back
								</Button>
							</NextLink>
						</Grid>
						<Grid item xs={6} display={"flex"} justifyContent={"flex-end"} order={{ xs: 17, md: 17 }}>
							<LoadingButton
								onClick={async () => {
									setLoading(true);
									const orderDataCopy = { ...newOrderData };
									delete orderDataCopy.receipt;
									let success = false;
									await toast
										.promise(
											httpsCallable(
												functions,
												"addNewOrder"
											)(orderDataCopy).then(async ({ data }) => {
												success = data.success;
												if (!success) throw "Error adding order";
												await uploadBytes(ref(storage, `users/${auth.currentUser.uid}/receipts/${data.id}`), newOrderData.receipt);
											}),
											{ loading: "Submitting order...", success: "Order submitted 👌", error: "Error submitting order 😫" }
										)
										.finally(() => {
											setLoading(false);
										});
									if (success) {
										dispatch(setSuccess(true));
										router.push("confirmation");
									}
								}}
								disabled={!isAccurate}
								endIcon={<ChevronRightRounded />}
								loading={loading}
								loadingPosition="end"
								variant="contained"
								color="accent"
								sx={{ width: { md: "unset", xs: "100%" } }}
							>
								Submit
							</LoadingButton>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}
