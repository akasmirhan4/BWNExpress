import { Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MemberPageTemplate from "components/MemberPageTemplate";
import OrderSummary from "components/OrderSummary";
import React, { useEffect, useState } from "react";
import styles from "styles/main.module.scss";
import { selectOrders, selectUser } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getOrder, getReceiptURL } from "lib/firebase";
import toast from "react-hot-toast";
import NextLink from "next/link";

export default function Details() {
	const orders = useSelector(selectOrders);
	const router = useRouter();
	const user = useSelector(selectUser);
	const [orderData, setOrderData] = useState(null);
	const [receiptURL, setReceiptURL] = useState(null);
	const getOrderData = async () => {
		let isCached = false;
		let success = false;
		if (orders) {
			const _orderData = orders.find((order) => order.orderID == router.query.orderID);
			if (_orderData) {
				setOrderData(_orderData);
				isCached = true;
				success = true;
			}
		}
		if (!isCached) {
			const _orderData = await getOrder(router.query.orderID);
			console.log({ _orderData });
			if (_orderData) {
				setOrderData(_orderData);
				success = true;
			}
		}
		if (!success) {
			toast.error("Error getting data. Redirecting...");
			router.push("/member/my-orders");
		} else {
			setReceiptURL(await getReceiptURL(router.query.orderID));
		}
	};
	useEffect(() => {
		if (user.uid) {
			getOrderData();
		}
	}, [user]);

	return (
		<MemberPageTemplate>
			<Container sx={{ my: 4 }}>
				<Breadcrumbs aria-label="breadcrumb">
					<NextLink href="/member/my-orders" prefetch={false} passHref>
						<Link underline="hover" color="inherit">
							My Orders
						</Link>
					</NextLink>
					<Typography color="text.primary">Details</Typography>
				</Breadcrumbs>
				<Box
					my={4}
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 } }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
					className={styles.dropShadow}
				>
					<OrderSummary orderData={orderData} receiptURL={receiptURL} />
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}
