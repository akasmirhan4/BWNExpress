import { AnnouncementRounded, CloseRounded, EditRounded, MoreHorizRounded, SendRounded } from "@mui/icons-material";
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
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import EnhancedTable from "components/EnhancedTable";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import NudgeDialog from "components/NudgeDialog";
import OrderDetails from "components/OrderDetails";
import { collection, doc, getDoc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "lib/firebase";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SearchOrders() {
	const [openArrivalDialog, setOpenArrivalDialog] = useState(false);
	const [openNudgeDialog, setOpenNudgeDialog] = useState(false);
	const [order, setOrder] = useState(null);
	const [orders, setOrders] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		onSnapshot(query(collection(firestore, "allOrders"), where("complete", "==", true), orderBy("timestamp", "asc")), async (querySnapshot) => {
			const orders = querySnapshot.docs.map((doc) => doc.data());
			const userRefs = orders.map((order) => order.userRef);
			const userData = await Promise.all(userRefs.map((userRef) => getDoc(userRef)));

			//insert userData to orders
			orders.forEach((order, index) => {
				order.userData = userData[index].data();
			});
			console.log({ orders });
			setOrders(orders);
		});
	}, []);

	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Manage Orders</Typography>
				</Breadcrumbs>
				<NudgeDialog
					order={order}
					open={openNudgeDialog}
					onClose={() => {
						setOpenNudgeDialog(false);
					}}
					to="member"
				/>
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
							id: "userData",
							alignRight: false,
							disablePadding: false,
							label: "Name",
							searchable: true,
							value: (userData) => userData.fullName,
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
							value: (time) => time?.toDate().toLocaleDateString(),
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
							<Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
								<MenuItem
									onClick={(e) => {
										setOrder(row);
										e.stopPropagation();
										setAnchorEl(null);
										setOpenNudgeDialog(true);
									}}
								>
									<ListItemIcon>
										<AnnouncementRounded />
									</ListItemIcon>
									<ListItemText>Nudge</ListItemText>
								</MenuItem>
							</Menu>
							<IconButton
								onClick={(e) => {
									setAnchorEl(e.target);
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
	if (!camel) return "";
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
						console.log({ trackingNumber });
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
