import { Box, Container, Typography, Breadcrumbs, Link, Checkbox, Grid, Button } from "@mui/material";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import NewOrderSteppers from "components/NewOrderSteppers";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { functions, auth, storage } from "lib/firebase";
import OrderSummary from "components/OrderSummary";
import { httpsCallable } from "firebase/functions";
import { ref, uploadBytes } from "firebase/storage";

export default function Summary() {
	const router = useRouter();
	const [isAccurate, setIsAccurate] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newOrderData, setNewOrderData] = useState(null);

	useEffect(() => {
		if (window.sessionStorage.getItem("isAcknowledged") != "true") {
			toast("Redirecting...");
			router.push("acknowledgement");
		} else if (!window.sessionStorage.getItem("weightRange")) {
			toast("Redirecting...");
			router.push("form");
		} else if (!window.sessionStorage.getItem("paymentMethod")) {
			toast("Redirecting...");
			router.push("payment");
		} else {
			let details = {};
			let keys = [
				"purchaseFrom",
				"weightRange",
				"itemCategory",
				"parcelValue",
				"currency",
				"itemDescription",
				"courierProvider",
				"specificCourierProvider",
				"trackingNumber",
				"receiptMetadata",
				"receipt",
				"bankTransferMetadata",
				"bankTransfer",
				"paymentMethod",
				"deliveryMethod",
				"isDifferentAddress",
				"deliveryAddress",
				"remark",
				"requiresPermit",
				"permitCategory",
				"permitRemark",
				"total",
			];

			keys.forEach((key) => {
				const value = window.sessionStorage.getItem(key);
				details[key] = value;
			});
			setNewOrderData(details);
		}
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
				<NewOrderSteppers sx={{ my: 4 }} activestep={4} />
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
							<NextLink href="payment" passHref>
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
									delete orderDataCopy.bankTransfer;
									let success = false;
									await toast
										.promise(
											httpsCallable(
												functions,
												"addNewOrder"
											)(orderDataCopy).then(async ({ data }) => {
												success = data.success;
												if (!success) throw "Error adding order";
												const receiptMetadata = JSON.parse(newOrderData.receiptMetadata);
												const receipt = new File([await (await fetch(newOrderData.receipt)).blob()], receiptMetadata.name, { type: receiptMetadata.type });
												await uploadBytes(ref(storage, `users/${auth.currentUser.uid}/orders/${data.id}/receipt`), receipt);

												if (newOrderData.bankTransfer) {
													const bankTransferMetadata = JSON.parse(newOrderData.bankTransferMetadata);
													const bankTransfer = new File([await (await fetch(newOrderData.bankTransfer)).blob()], bankTransferMetadata.name, {
														type: bankTransferMetadata.type,
													});
													await uploadBytes(ref(storage, `users/${auth.currentUser.uid}/orders/${data.id}/bankTransfer`), bankTransfer);
												}
												window.sessionStorage.setItem("success", "true");
											}),

											{ loading: "Submitting order...", success: "Order submitted 👌", error: "Error submitting order 😫" }
										)
										.finally(() => {
											setLoading(false);
										});
									if (success) {
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
