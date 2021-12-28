import { Box, Container, Typography, Breadcrumbs, Link, Table, TableBody, TableCell, TableContainer, TableRow, Checkbox, Grid, Button } from "@mui/material";
import styles from "styles/main.module.scss";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectData, selectIsAcknowledged, setSuccess } from "lib/slices/newOrderSlice";
import { useRouter } from "next/router";
import NewOrderSteppers from "components/NewOrderSteppers";
import Image from "next/image";
import { selectUserData } from "lib/slices/userSlice";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { functions, auth, storage } from "lib/firebase";
import OrderSummary from "components/OrderSummary";

export default function Summary() {
	const dispatch = useDispatch();
	const router = useRouter();

	const [isAccurate, setIsAccurate] = useState(false);
	const isAcknowledged = useSelector(selectIsAcknowledged);
	const newOrderData = useSelector(selectData);
	const userData = useSelector(selectUserData);
	const [receiptImage, setReceiptImage] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isAcknowledged) {
			toast("Redirecting...");
			router.push("acknowledgement");
		} else if (!newOrderData) {
			toast("Redirecting...");
			router.push("form");
		} else {
			console.log(newOrderData?.receipt);
			readFileAsText(newOrderData.receipt).then((value) => {
				setReceiptImage(value);
			});
		}
	}, [newOrderData, isAcknowledged]);

	function readFileAsText(file) {
		return new Promise(function (resolve, reject) {
			let fr = new FileReader();

			fr.onload = function () {
				resolve(fr.result);
			};

			fr.onerror = function () {
				reject(fr);
			};

			fr.readAsDataURL(file);
		});
	}

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Box display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{ mb: 4 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="dashboard" prefetch={false} passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<Typography color="text.primary">New Order</Typography>
					</Breadcrumbs>
				</Box>
				<NewOrderSteppers sx={{ my: 4 }} activeStep={2} />
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 } }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
					className={styles.dropShadow}
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
							<NextLink href="form" prefetch={false} passHref>
								<Button
									startIcon={<ChevronLeftRounded />}
									variant="contained"
									color="accent"
									sx={{ color: "white.main", width: { md: "unset", xs: "100%" } }}
									className={styles.dropShadow}
								>
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
											functions
												.httpsCallable("addNewOrder")(orderDataCopy)
												.then(async ({ data }) => {
													success = data.success;
													if (!success) throw "Error adding order";
													const storageRef = storage.ref(`users/${auth.currentUser.uid}/receipts/${data.id}`);
													await storageRef.put(newOrderData.receipt);
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
								sx={{ color: "white.main", width: { md: "unset", xs: "100%" } }}
								className={styles.dropShadow}
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
