import { Breadcrumbs, Container, Divider, Grid, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MemberPageTemplate from "components/MemberPageTemplate";
import React, { Fragment, useEffect, useState } from "react";
import styles from "styles/main.module.scss";
import { selectOrders, selectUser } from "lib/slices/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getLogTracker, getOrder } from "lib/firebase";
import toast from "react-hot-toast";
import NextLink from "next/link";
import {
	AssignmentTurnedInRounded,
	BugReportRounded,
	Check,
	CheckRounded,
	CircleRounded,
	ErrorRounded,
	LocalShippingRounded,
	MoreHorizRounded,
	PaidRounded,
	PendingRounded,
	PublishRounded,
	TouchAppRounded,
} from "@mui/icons-material";
import { cloneElement } from "react";

export default function Details() {
	return (
		<MemberPageTemplate>
			<Container sx={{ my: 4, display: "flex", flexDirection: "column" }}>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mt: 4 }}>
					<NextLink href="/member/my-orders" prefetch={false} passHref>
						<Link underline="hover" color="inherit">
							My Orders
						</Link>
					</NextLink>
					<Typography color="text.primary">Track</Typography>
				</Breadcrumbs>
				<TrackerComponent />
			</Container>
		</MemberPageTemplate>
	);
}

function TrackerComponent(props) {
	const router = useRouter();
	const user = useSelector(selectUser);
	const [orderData, setOrderData] = useState(null);
	const [trackerLogs, setTrackerLogs] = useState([]);
	const orderID = router.query.orderID;
	const [headerColor, setHeaderColor] = useState("secondary.main");
	const [headerTitle, setHeaderTitle] = useState("...");

	useEffect(() => {
		if (user.uid) {
			(async () => {
				const results = await Promise.all([getLogTracker(orderID), getOrder(orderID)]);
				if (!results[0] || !results[1]) {
					toast.error("Error getting data. Redirecting...");
					router.push("/member/my-orders");
				} else {
					setTrackerLogs(results[0]);
					setOrderData(results[1]);
					const { title, defaultColor } = getDefault(results[0][0], results[1]);
					setHeaderTitle(title);
					setHeaderColor(defaultColor);
				}
			})();
		}
	}, [user]);

	return (
		<Box
			className={styles.dropShadow}
			sx={{
				my: 4,
				display: "flex",
				flexDirection: "column",
				width: "100%",
				bgcolor: "white.main",
				borderRadius: 2,
				overflow: "hidden",
				flex: 1,
			}}
		>
			<Box
				sx={{
					py: 4,
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
					bgcolor: headerColor,
				}}
			>
				<Typography color="white.main" sx={{ textTransform: "uppercase" }}>
					{headerTitle}
				</Typography>
				<Typography color="white.main" fontSize={"0.8rem"}>
					{orderID}
				</Typography>
			</Box>
			<Box
				sx={{
					pt: 2,
					pb: 8,
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
					bgcolor: "white.main",
					position: "relative",
					overflow: "hidden",
					zIndex: 0,
				}}
			>
				<Divider orientation="vertical" sx={{ position: "absolute", left: "33%", minheight: "100vh", height: "200%", zIndex: -1 }} />
				<Grid container columnSpacing={2} rowSpacing={4} sx={{ my: 2 }}>
					{trackerLogs?.map((log, i) => (
						<TrackerItem key={i} data={log} generalData={orderData} />
					))}
				</Grid>
			</Box>
		</Box>
	);
}

function TrackerItem(props) {
	const { icon, color, space, data, generalData } = props;
	const { timestamp, status } = data;
	let { location } = data;
	const timestampDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

	let { title, defaultIcon, defaultColor } = getDefault(data, generalData);

	const Icon = () => cloneElement(icon ?? defaultIcon, { color: "white" });

	return space ? (
		[...Array(space === true ? 1 : space)].map((_, i) => <Grid item xs={12} key={i} />)
	) : (
		<Fragment>
			<Grid item xs={3} md={3.5} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
				<Typography fontWeight="bold" sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
					{timestampDate.toLocaleDateString()}
				</Typography>
				<Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.8rem" } }}>{timestampDate.toLocaleTimeString()}</Typography>
			</Grid>
			<Grid item xs={2} md={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
				<Box
					sx={{
						bgcolor: color ?? defaultColor,
						borderRadius: "50%",
						width: { xs: "2em", sm: "3em" },
						height: { xs: "2em", sm: "3em" },
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon />
				</Box>
			</Grid>
			<Grid item xs={7} md={5.5} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
				<Typography fontWeight="bold" sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
					{title}
				</Typography>
				<Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.8rem" } }}>
					{location == "deliveryAddress" ? generalData?.deliveryAddress : location ?? ""}
				</Typography>
			</Grid>
			{["received", "processingPermit", "userAction"].includes(status) && (
				<Fragment>
					<Grid item xs={12} />
					<Grid item xs={12} />
				</Fragment>
			)}
		</Fragment>
	);
}

function getDefault(data, generalData) {
	let { location, status } = data;
	let title = "";
	let defaultIcon = <BugReportRounded />;
	let defaultColor = "secondary.main";

	if (data.complete) {
		defaultColor = "success.main";
		defaultIcon = <CheckRounded />;
		title = location == "deliveryAddress" ? "Item delivered" : "Item collected";
	} else {
		switch (status) {
			case "userAction":
				defaultColor = "accent.main";
				title = data.userAction;
				switch (data.userAction) {
					case "setPaymentMethod":
						title = `Payment set to ${!!generalData?.paymentMethod ? generalData?.paymentMethod : "..."}`;
						defaultIcon = <TouchAppRounded />;
						break;
					case "setDeliveryMethod":
						title = `Delivery set to ${!!generalData?.deliveryMethod ? generalData?.deliveryMethod : "..."}`;
						defaultIcon = <TouchAppRounded />;
						break;
					case "paymentReceived":
						defaultColor = "success.main";
						defaultIcon = <PaidRounded />;
						title = `Payment Received`;
						break;
					case "declared":
						defaultIcon = <PublishRounded />;
						title = `Order form submitted / Standby for parcel`;
						break;
				}
				break;
			case "dispatched":
				const to = data.to == "deliveryAddress" ? "Customer Delivery Address" : data.to;
				title = `Item dispatched to ${to?.toUpperCase()}`;
				defaultIcon = <LocalShippingRounded />;
				break;
			case "received":
				defaultColor = "lightGrey.secondary";
				title = `Item received in ${data.location}`;
				defaultIcon = <CircleRounded />;
				break;
			case "pendingAction":
				defaultColor = "primary.main";
				defaultIcon = <ErrorRounded />;
				title = data.pendingAction;
				switch (data.pendingAction) {
					case "paymentMethod":
						title = `Awaiting user to set payment`;
						break;
					case "deliveryMethod":
						title = `Awaiting user to set delivery`;
						break;
				}
				break;
			case "processingPermit":
				defaultColor = "lightGrey.secondary";
				title = `Processing Permit`;
				defaultIcon = <CircleRounded />;
				break;
			case "custom":
				defaultColor = "lightGrey.secondary";
				title = `Brunei Custom Clearance`;
				defaultIcon = <MoreHorizRounded />;
				break;
			default:
				title = status;
		}
	}
	return { title, defaultIcon, defaultColor };
}
