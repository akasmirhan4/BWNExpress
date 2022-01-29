import { AddRounded, CloseRounded, EditRounded, MoreHorizRounded, SendRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Container,
	Typography,
	Breadcrumbs,
	IconButton,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Tabs,
	Tab,
	Box,
	Link,
	TextField,
} from "@mui/material";
import CustomUploadButton from "components/CustomUploadButton";
import EnhancedTable from "components/EnhancedTable";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import OrderDetails from "components/OrderDetails";
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "lib/firebase";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SearchOrders() {
	const [openArrivalDialog, setOpenArrivalDialog] = useState(false);
	const [order, setOrder] = useState(null);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		onSnapshot(
			query(collection(firestore, "allOrders"), orderBy("timestamp", "asc")),
			(querySnapshot) => {
				let orders = [];
				querySnapshot.forEach((doc) => {
					orders.push(doc.data());
				});
				setOrders(orders);
			}
		);
	}, []);

	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Manage Orders</Typography>
				</Breadcrumbs>
				<ParcelArrivalDialog
					order={order}
					open={openArrivalDialog}
					onClose={() => {
						setOpenArrivalDialog(false);
						setOrder(null);
					}}
				/>
				<EnhancedTable
					title="Submitted Orders"
					headers={[
						{
							id: "orderID",
							alignRight: false,
							disablePadding: true,
							label: "Order ID",
							key: true,
							searchable: true,
						},
						{
							id: "trackingNumber",
							alignRight: false,
							disablePadding: false,
							label: "Tracking ID",
							searchable: true,
						},
						{
							id: "dateSubmitted",
							alignRight: false,
							disablePadding: false,
							label: "Date",
							value: (time) => time.toDate().toLocaleDateString(),
						},
						{
							id: "status",
							alignRight: false,
							disablePadding: false,
							label: "Status",
							value: camelCaseToText,
							// searchable: true,
						},
						{
							id: "action",
							alignRight: true,
							disablePadding: false,
							label: "Action",
							action: true,
						},
					]}
					data={orders}
					actions={(row) => (
						<Fragment>
							<Tooltip title="Parcel Arrival Form">
								<IconButton
									onClick={(e) => {
										setOrder(row);
										setOpenArrivalDialog(true);
										e.stopPropagation();
									}}
								>
									<EditRounded />
								</IconButton>
							</Tooltip>
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<MoreHorizRounded />
							</IconButton>
						</Fragment>
					)}
				/>
			</Container>
		</ModeratorPageTemplate>
	);
}

function camelCaseToText(camel) {
	const result = camel.replace(/([A-Z])/g, " $1");
	const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
	return finalResult;
}

function ParcelArrivalDialog(props) {
	const { open = false, onClose = () => {}, order = null } = props;
	const [currentTab, setCurrentTab] = useState(0);
	const [images, setImages] = useState([]);
	const [trackingNumber, setTrackingNumber] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setTrackingNumber(order?.trackingNumber ?? "");
	}, [order]);

	const handleClose = () => {
		setCurrentTab(0);
		setImages([]);
		setTrackingNumber("");
		setIsSubmitting(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Parcel Arrival Form</DialogTitle>
			<DialogContent sx={{ minHeight: "80vh", overflowX: "hidden" }}>
				<Tabs value={currentTab} onChange={(e, newTab) => setCurrentTab(newTab)} sx={{ borderBottom: 1, borderColor: "divider", width: "50vw" }}>
					{!!order && <Tab label="Details" />}
					<Tab label="Uploads" />
				</Tabs>
				{!!order && (
					<TabPanel value={currentTab} index={0}>
						<OrderDetails order={order} />
					</TabPanel>
				)}
				<TabPanel value={currentTab} index={!!order ? 1 : 0}>
					{images.length > 0 && (
						<Fragment>
							<Typography sx={{ mt: 1 }}>File selected: </Typography>
							{images.map((image) => (
								<Link href={URL.createObjectURL(image)} target="_blank">
									{image.name}
								</Link>
							))}
						</Fragment>
					)}
				</TabPanel>
			</DialogContent>
			<DialogActions>
				<Button startIcon={<CloseRounded />} onClick={handleClose}>
					Cancel
				</Button>
				<LoadingButton
					startIcon={<SendRounded />}
					disabled={!images.length || !trackingNumber}
					loading={isSubmitting}
					onClick={async () => {
						setIsSubmitting(true);
						console.log({ trackingNumber });
						const docSnapshot = await getDoc(doc(firestore, "unsubmittedParcels", trackingNumber));
						if (docSnapshot.exists()) {
							toast.error("Parcel with such tracking ID already logged");
							setIsSubmitting(false);
							return;
						}
						let batchPromises = [];
						const getURL = (file) => {
							return new Promise(async (resolve) => {
								const storageRef = ref(storage, `unsubmittedParcels/${trackingNumber}/${file.name}`);
								await uploadBytes(storageRef, file);
								const URL = await getDownloadURL(storageRef);
								resolve({ URL, ref: storageRef, name: file.name, type: file.type });
							});
						};
						const result = await getURL(images[0]);

						await toast.promise(setDoc(doc(firestore, "unsubmittedParcels", trackingNumber), { URL: result.URL }), {
							loading: "uploading...",
							success: "Parcel Logged",
							error: "Error uploading",
						});
						handleClose();
					}}
				>
					Submit
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		value === index && (
			<Box {...other} sx={{ p: 3 }}>
				{children}
			</Box>
		)
	);
}