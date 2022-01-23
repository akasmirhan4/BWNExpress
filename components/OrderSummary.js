import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Link } from "@mui/material";
import { getFiles } from "lib/firebase";
import { currencyFormatter } from "lib/formatter";
import { Fragment, memo, useEffect, useState } from "react";

export default function OrderSummary(props) {
	const { orderData } = props || {};
	const [receipts, setReceipts] = useState([]);
	const [productInformations, setProductInformations] = useState([]);
	const [bankTransfers, setBankTransfers] = useState([]);

	useEffect(() => {
		if (orderData) {
			(async () => {
				setReceipts(orderData.receipts ? JSON.parse(orderData.receipts) : await getFiles("receipts", orderData.orderID));
				setProductInformations(orderData.productInformations ? JSON.parse(orderData.productInformations) : await getFiles("permits", orderData.orderID));
				setBankTransfers(orderData.bankTransfers ? JSON.parse(orderData.bankTransfers) : await getFiles("bankTransfers", orderData.orderID));
			})();
		}
	}, [orderData]);
	return (
		<Box>
			<OrderTable orderData={orderData} sx={{ my: 2 }} />
			<CostBreakdownTable orderData={orderData} sx={{ my: 2 }} />
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

function OrderTable(props) {
	const orderData = props.orderData;
	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}
	return (
		<Box {...props}>
			<Typography sx={{ my: 2 }}>Summary</Typography>
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
							<TableCell component={"th"}>Parcel Weight</TableCell>
							<TableCell>{`${orderData?.parcelWeight} kg`}</TableCell>
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
		</Box>
	);
}
function CostBreakdownTable(props) {
	const orderData = props.orderData;
	return (
		<Box {...props}>
			<Typography sx={{ my: 2 }}>Cost Breakdown</Typography>
			<TableContainer>
				<Table size="small">
					<TableBody>
						<TableRow>
							<TableCell component={"th"}>{`Weight Cost (${orderData?.parcelWeight} kg): `}</TableCell>
							<TableCell>{currencyFormatter.format(Number(orderData?.weightPrice))}</TableCell>
						</TableRow>
						{orderData?.requiresPermit == "true" && (
							<TableRow>
								<TableCell component={"th"}>Permit Application</TableCell>
								<TableCell>{currencyFormatter.format(10)}</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell component={"th"}>Total</TableCell>
							<TableCell>{currencyFormatter.format(orderData?.total)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}
