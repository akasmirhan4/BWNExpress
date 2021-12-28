import { Box, Container, Typography, Breadcrumbs, Link, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import styles from "styles/main.module.scss";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectData, selectIsAcknowledged } from "lib/slices/newOrderSlice";
import { useRouter } from "next/router";
import NewOrderSteppers from "components/NewOrderSteppers";
import Image from "next/image";
import { selectUserData } from "lib/slices/userSlice";

export default function Summary() {
	const dispatch = useDispatch();
	const router = useRouter();

	const isAcknowledged = useSelector(selectIsAcknowledged);
	const newOrderData = useSelector(selectData);
	const userData = useSelector(selectUserData);
	const [receiptImage, setReceiptImage] = useState(null);

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
				{/* ORDER FORM */}
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
					<Typography sx={{ my: 2 }}>Summary</Typography>
					<TableContainer>
						<Table size="small">
							<TableBody>
								<TableRow>
									<TableCell component={"th"}>Purchase From</TableCell>
									<TableCell>{newOrderData?.purchaseFrom}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Item Category</TableCell>
									<TableCell>{newOrderData?.itemCategory}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Parcel Value</TableCell>
									<TableCell>{`${newOrderData?.currency} ${newOrderData?.parcelValue}`}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Description</TableCell>
									<TableCell>{newOrderData?.itemDescription}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Courier Provider</TableCell>
									<TableCell>{newOrderData?.courierProvider == "Others" ? newOrderData?.specificCourierProvider : newOrderData?.courierProvider}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Tracking Number</TableCell>
									<TableCell>{newOrderData?.trackingNumber}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Payment Method</TableCell>
									<TableCell>{newOrderData?.paymentMethod == "" ? "Select Soon" : newOrderData?.paymentMethod}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell component={"th"}>Delivery Method</TableCell>
									<TableCell>{newOrderData?.deliveryMethod == "" ? "Select Soon" : newOrderData?.deliveryMethod}</TableCell>
								</TableRow>
								{newOrderData?.deliveryMethod == "Home Delivery" && (
									<TableRow>
										<TableCell component={"th"}>Delivery Address</TableCell>
										<TableCell>{newOrderData?.deliveryAddress}</TableCell>
									</TableRow>
								)}
								<TableRow>
									<TableCell component={"th"}>Remark</TableCell>
									<TableCell>{newOrderData?.remark}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<Typography sx={{ mt: 4 }}>Receipt Preview</Typography>
					<Box
						width="100%"
						minHeight={"48em"}
						border="1px dashed"
						borderColor="secondaryAccent.main"
						display="flex"
						justifyContent={"center"}
						alignItems={"center"}
						borderRadius={1}
						position="relative"
						bgcolor={"lightGrey.secondary"}
						sx={{ zIndex: 0, my: 2 }}
					>
						{newOrderData?.receipt && ["image/jpeg", "image/png"].includes(newOrderData?.receipt.type) ? (
							<Image src={URL.createObjectURL(newOrderData?.receipt)} alt="receipt" layout="fill" objectFit="contain" />
						) : (
							["application/pdf"].includes(newOrderData?.receipt.type) && (
								<embed src={URL.createObjectURL(newOrderData?.receipt)} width="100%" height="100%" style={{ position: "absolute", zIndex: -1 }} />
							)
						)}
						<Typography sx={{ bgcolor: "secondary.main", p: 1, color: "white.main", opacity: 0.8, fontSize: {xs: "0.7rem", sm: "1rem"} }} textAlign="center">
							{newOrderData?.receipt ? newOrderData?.receipt.name : "..."}
						</Typography>
					</Box>
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}
