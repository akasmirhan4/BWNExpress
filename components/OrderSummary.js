import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Skeleton } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function OrderSummary(props) {
	const { orderData, receiptURL } = props || {};
	const [receiptLoaded, setReceiptLoaded] = useState(false);

	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}
	return (
		<Box>
			<Typography sx={{ mb: 2 }}>Summary</Typography>
			<TableContainer>
				<Table size="small">
					<TableBody>
						{orderData?.orderID && (
							<TableRow>
								<TableCell component={"th"}>Order ID</TableCell>
								<TableCell>{orderData?.orderID}</TableCell>
							</TableRow>
						)}
						{orderData?.dateSubmitted && (
							<TableRow>
								<TableCell component={"th"}>Date & Time Submitted</TableCell>
								<TableCell>{new Date(orderData?.dateSubmitted.seconds * 1000 + orderData?.dateSubmitted.nanoseconds / 1000000).toLocaleString()}</TableCell>
							</TableRow>
						)}
						{orderData?.status && (
							<TableRow>
								<TableCell component={"th"}>Status</TableCell>
								<TableCell>{camelCaseToText(orderData?.status)}</TableCell>
							</TableRow>
						)}
						{orderData?.estimatedDuration && (
							<TableRow>
								<TableCell component={"th"}>Estimated Duration</TableCell>
								<TableCell>{orderData?.estimatedDuration}</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell component={"th"}>Purchase From</TableCell>
							<TableCell>{orderData?.purchaseFrom}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Item Category</TableCell>
							<TableCell>{orderData?.itemCategory}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Parcel Value</TableCell>
							<TableCell>{`${orderData?.currency} ${orderData?.parcelValue}`}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Description</TableCell>
							<TableCell>{orderData?.itemDescription}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Courier Provider</TableCell>
							<TableCell>{orderData?.courierProvider == "Others" ? orderData?.specificCourierProvider : orderData?.courierProvider}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Tracking Number</TableCell>
							<TableCell>{orderData?.trackingNumber}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Payment Method</TableCell>
							<TableCell>{orderData?.paymentMethod == "" ? "Select Soon" : orderData?.paymentMethod}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component={"th"}>Delivery Method</TableCell>
							<TableCell>{orderData?.deliveryMethod == "" ? "Select Soon" : orderData?.deliveryMethod}</TableCell>
						</TableRow>
						{orderData?.deliveryMethod == "Home Delivery" && (
							<TableRow>
								<TableCell component={"th"}>Delivery Address</TableCell>
								<TableCell>{orderData?.deliveryAddress}</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell component={"th"}>Remark</TableCell>
							<TableCell>{orderData?.remark}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<Typography sx={{ mt: 4 }}>Receipt Preview</Typography>
			{receiptURL && (
				<Box
					width="100%"
					minHeight={"48em"}
					display="flex"
					justifyContent={"center"}
					alignItems={"center"}
					borderRadius={1}
					position="relative"
					bgcolor={receiptLoaded && "lightGrey.secondary"}
					sx={{ zIndex: 0, my: 2 }}
				>
					{!receiptLoaded && <Skeleton variant="rectangular" width={"100%"} height={"48em"} />}
					<Image
						onLoadingComplete={() => {
							setReceiptLoaded(true)
						}}
						src={receiptURL}
						alt="receipt"
						layout="fill"
						objectFit="contain"
					/>
				</Box>
			)}
			{orderData?.receipt && (
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
					{orderData?.receipt && ["image/jpeg", "image/png"].includes(orderData?.receipt.type) && (
						<Image src={URL.createObjectURL(orderData?.receipt)} alt="receipt" layout="fill" objectFit="contain" />
					)}
					<Typography sx={{ bgcolor: "secondary.main", p: 1, color: "white.main", opacity: 0.8, fontSize: { xs: "0.7rem", sm: "1rem" } }} textAlign="center">
						{orderData?.receipt ? orderData?.receipt.name : "..."}
					</Typography>
				</Box>
			)}
		</Box>
	);
}
