import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Skeleton } from "@mui/material";
import { currencyFormatter } from "lib/formatter";
import Image from "next/image";
import { memo, useState } from "react";

export default function OrderSummary(props) {
	const { orderData, receiptURL, bankTransferURL } = props || {};
	const [receiptLoaded, setReceiptLoaded] = useState(false);
	const [bankTransferLoaded, setBankTransferLoaded] = useState(false);
	console.log(bankTransferURL, receiptURL);

	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}
	return (
		<Box>
			<Typography sx={{ mb: 2 }}>Summary</Typography>
			<OrderTable orderData={orderData} />
			{(!!receiptURL || orderData?.receipt) && <Typography sx={{ mt: 4 }}>Receipt Preview</Typography>}
			{(!!receiptURL || orderData?.receipt) && (
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
					{["application/pdf"].includes(JSON.parse(orderData?.receiptMetadata).type) ? (
						<PDFViewer src={receiptURL ?? orderData?.receipt} />
					) : (
						<Image src={receiptURL ?? orderData?.receipt} alt="receipt" layout="fill" objectFit="contain" />
					)}
					<Typography sx={{ bgcolor: "secondary.main", p: 1, color: "white.main", opacity: 0.8, fontSize: { xs: "0.7rem", sm: "1rem" } }} textAlign="center">
						{JSON.parse(orderData?.receiptMetadata).name ?? orderData.receiptMetadata.name ?? "..."}
					</Typography>
				</Box>
			)}
			{(!!bankTransferURL || orderData?.bankTransfer) && <Typography sx={{ mt: 4 }}>Bank Transfer Preview</Typography>}
			{(!!bankTransferURL || orderData?.bankTransfer) && (
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
					{["application/pdf"].includes(JSON.parse(orderData?.bankTransferMetadata).type) ? (
						<PDFViewer src={bankTransferURL ?? orderData?.bankTransfer} />
					) : (
						<Image src={bankTransferURL ?? orderData?.bankTransfer} alt="bankTransfer" layout="fill" objectFit="contain" priority />
					)}
					<Typography sx={{ bgcolor: "secondary.main", p: 1, color: "white.main", opacity: 0.8, fontSize: { xs: "0.7rem", sm: "1rem" } }} textAlign="center">
						{JSON.parse(orderData?.bankTransferMetadata).name ?? orderData.bankTransferMetadata.name ?? "..."}
					</Typography>
				</Box>
			)}
		</Box>
	);
}

const PDFViewer = memo(function PDFViewer(props) {
	return <embed src={`${props.src}#toolbar=0&navpanes=0&scrollbar=0`} width="100%" height="100%" style={{ position: "absolute", zIndex: -1 }} />;
});

function OrderTable(props) {
	const orderData = props.orderData;

	return (
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
						<TableCell>{`${orderData?.currency ?? "..."} ${orderData?.parcelValue ?? "..."}`}</TableCell>
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
					<TableRow>
						<TableCell component={"th"}>Require permit?</TableCell>
						<TableCell>{orderData?.requiresPermit}</TableCell>
					</TableRow>
					{orderData?.requiresPermit && (
						<TableRow>
							<TableCell component={"th"}>Permit Category</TableCell>
							<TableCell>{orderData?.permitCategory}</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell component={"th"}>Total</TableCell>
						<TableCell>{currencyFormatter.format(orderData?.total)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
