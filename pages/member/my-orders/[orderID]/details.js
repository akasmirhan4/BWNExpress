import { Breadcrumbs, Container, Link, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MemberPageTemplate from "components/MemberPageTemplate";
import OrderSummary from "components/OrderSummary";
import React, { useEffect, useState } from "react";
import { selectOrders, selectUserExists } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getOrder } from "lib/firebase";
import toast from "react-hot-toast";
import NextLink from "next/link";

export default function Details() {
	const orders = useSelector(selectOrders);
	const router = useRouter();
	const [orderData, setOrderData] = useState(null);
	const userExist = useSelector(selectUserExists);

	useEffect(() => {
		if (userExist) {
			(async () => {
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
					if (_orderData) {
						setOrderData(_orderData);
						success = true;
					}
				}
				if (!success) {
					toast.error("Error getting data. Redirecting...");
					router.push("/member/my-orders");
				}
			})();
		}
	}, [userExist]);

	return (
		<MemberPageTemplate>
			<Container sx={{ my: 4 }}>
				<Breadcrumbs aria-label="breadcrumb">
					<NextLink href="/member/my-orders" passHref>
						<Link underline="hover" color="inherit">
							My Orders
						</Link>
					</NextLink>
					<Typography color="text.primary">Details</Typography>
				</Breadcrumbs>
				<Tabs value={0} sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
					<Tab label="Order Summary" href={`/member/my-orders/${router.query.orderID}/details`} />
					<Tab label="Nudges" href={`/member/my-orders/${router.query.orderID}/nudges`} />
				</Tabs>
				<OrderSummary orderData={orderData} />
			</Container>
		</MemberPageTemplate>
	);
}
