import { AddRounded, CloseRounded, MoreHorizRounded, SendRounded } from "@mui/icons-material";
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
import EmployeePageTemplate from "components/EmployeePageTemplate";
import EnhancedTable from "components/EnhancedTable";
import OrderDetails from "components/OrderDetails";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, firestore, sendNotification, storage } from "lib/firebase";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SearchOrders() {
	const [submittedOrders, setSubmittedOrders] = useState([]);
	const [approvedOrders, setApprovedOrders] = useState([]);
	const [openArrivalDialog, setOpenArrivalDialog] = useState(false);
	const [order, setOrder] = useState(null);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const orders = [...approvedOrders, ...submittedOrders];
		setOrders(orders);
	}, [approvedOrders, submittedOrders]);

	useEffect(() => {
		onSnapshot(
			query(collection(firestore, "allOrders"), where("complete", "==", true), where("status", "==", "orderSubmitted"), orderBy("timestamp", "asc")),
			(querySnapshot) => {
				let pendingOrders = [];
				querySnapshot.forEach((doc) => {
					pendingOrders.push(doc.data());
				});
				setSubmittedOrders(pendingOrders);
			}
		);
		onSnapshot(
			query(collection(firestore, "allOrders"), where("complete", "==", true), where("status", "==", "orderApproved"), orderBy("timestamp", "asc")),
			(querySnapshot) => {
				let pendingOrders = [];
				querySnapshot.forEach((doc) => {
					pendingOrders.push(doc.data());
				});
				setApprovedOrders(pendingOrders);
			}
		);
	}, []);

	return (
		<EmployeePageTemplate>
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
									<SendRounded />
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
					emptyActions={
						<Button startIcon={<AddRounded />} onClick={() => setOpenArrivalDialog(true)}>
							Upload Unowned Parcel
						</Button>
					}
					requireSearch
				/>
			</Container>
		</EmployeePageTemplate>
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
	const [remark, setRemark] = useState("");

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
					<Tab label="Form" />
				</Tabs>
				{!!order && (
					<TabPanel value={currentTab} index={0}>
						<OrderDetails order={order} />
					</TabPanel>
				)}
				<TabPanel value={currentTab} index={!!order ? 1 : 0}>
					<TextField
						margin="dense"
						label="Tracking ID"
						type="text"
						fullWidth
						variant="outlined"
						value={trackingNumber}
						disabled={!!order}
						sx={{ mb: 2 }}
						onChange={(e) => setTrackingNumber(e.target.value)}
						required
					/>
					<TextField
						margin="dense"
						label="Labuan Remark"
						type="text"
						fullWidth
						minRows={3}
						multiline
						variant="outlined"
						value={remark}
						sx={{ mb: 2 }}
						onChange={(e) => setRemark(e.target.value)}
					/>
					<CustomUploadButton
						tooltip="Ensure Tracking ID is visible with its barcode"
						label="Upload Parcel Image"
						required
						maxFile={1}
						accept="image/jpeg,image/png"
						preventUpload
						onChange={(files) => {
							let images = [];
							for (let i = 0; i < files.length; i++) {
								images.push(files[i]);
							}
							setImages(images);
						}}
					/>
					{images.length > 0 && (
						<Fragment>
							<Typography sx={{ mt: 1 }}>File selected: </Typography>
							{images.map((image, index) => (
								<Link href={URL.createObjectURL(image)} target="_blank" key={index}>
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
						if (!!order?.orderID) {
							const getURL = (file) => {
								return new Promise(async (resolve) => {
									const storageRef = ref(storage, `users/${order.userID}/orders/${order.orderID}/labuan/${file.name}`);
									await uploadBytes(storageRef, file);
									const URL = await getDownloadURL(storageRef);
									resolve({ URL, ref: storageRef, name: file.name, type: file.type });
								});
							};
							const result = await getURL(images[0]);

							await toast.promise(
								Promise.all([
									updateDoc(doc(firestore, "allOrders", order.orderID), { status: "arrivedLabuan", labuanRemark: remark }),
									addDoc(collection(firestore, "allOrders", order.orderID, "logTracker"), {
										timestamp: serverTimestamp(),
										status: "arrivedLabuan",
										location: "Collection Warehouse, Labuan",
										labuanRemark: remark,
										byUser: auth.currentUser.uid,
										imageURL: result.URL,
									}),
									sendNotification(order.userID, {
										title: "Your parcel has arrived in Labuan",
										subtitle: "This is just an automated tracking message",
										details: "Sit back and relax while we handle all the hard work",
										href: `/member/my-orders/${order.orderID}/track`,
										type: "alert",
										notification: {
											email: true,
											SMS: true,
											desktop: true,
											app: true,
										},
									}),
								]),
								{
									loading: "uploading...",
									success: "Parcel Logged",
									error: "Error uploading",
								}
							);
						} else {
							const docSnapshot = await getDoc(doc(firestore, "unsubmittedParcels", trackingNumber));
							if (docSnapshot.exists()) {
								toast.error("Parcel with such tracking ID already logged");
								setIsSubmitting(false);
								return;
							}
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
						}

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
