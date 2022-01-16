import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Skeleton, Link } from "@mui/material";
import { currencyFormatter } from "lib/formatter";
import Image from "next/image";
import { Fragment, memo, useEffect, useState } from "react";

export default function OrderSummary(props) {
	const { orderData } = props || {};
	console.log(orderData);
	const [receipts, setReceipts] = useState([]);
	const [productInformations, setProductInformations] = useState([]);
	const [bankTransfers, setBankTransfers] = useState([]);

	useEffect(() => {
		if (orderData) {
			if (!!orderData.receipts) {
				setReceipts(JSON.parse(orderData.receipts));
			}
			if (!!orderData.productInformations) {
				setProductInformations(JSON.parse(orderData.productInformations));
			}
			if (!!orderData.bankTransfers) {
				setBankTransfers(JSON.parse(orderData.bankTransfers));
			}
		}
	}, [orderData]);

	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}
	return (
		<Box>
			<Typography sx={{ mb: 2 }}>Summary</Typography>
			<OrderTable orderData={orderData} />
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				{receipts.length > 0 && (
					<Fragment>
						<Typography sx={{ mt: 4 }}>Receipts Attached: </Typography>
						{receipts.map((receipt, index) => (
							<Link href={receipt.URL} target={"_blank"} key={index}>
								{receipt.name}
							</Link>
						))}
					</Fragment>
				)}
			</Box>
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				{productInformations.length > 0 && (
					<Fragment>
						<Typography sx={{ mt: 4 }}>Product Info Documents Attached: </Typography>
						{productInformations.map((productInformation, index) => (
							<Link href={productInformation.URL} target={"_blank"} key={index}>
								{productInformation.name}
							</Link>
						))}
					</Fragment>
				)}
			</Box>
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				{bankTransfers.length > 0 && (
					<Fragment>
						<Typography sx={{ mt: 4 }}>Transfer Screenshot Attached: </Typography>
						{bankTransfers.map((bankTransfer, index) => (
							<Link href={bankTransfer.URL} target={"_blank"} key={index}>
								{bankTransfer.name}
							</Link>
						))}
					</Fragment>
				)}
			</Box>
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
						<TableCell component={"th"}>Weight Range</TableCell>
						<TableCell>{orderData?.weightRange}</TableCell>
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
					{orderData?.requiresPermit && (
						<TableRow>
							<TableCell component={"th"}>Permit Remark</TableCell>
							<TableCell>{orderData?.permitRemark}</TableCell>
						</TableRow>
					)}
					<TableRow>
						<TableCell component={"th"}>Payment Method</TableCell>
						<TableCell>{orderData?.paymentMethod == "" ? "Select Soon" : orderData?.paymentMethod}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell component={"th"}>Total</TableCell>
						<TableCell>{currencyFormatter.format(orderData?.total)}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}
