import {
	AccountBalanceRounded,
	BugReportRounded,
	CancelRounded,
	CheckRounded,
	CloseRounded,
	CreditCardRounded,
	EditRounded,
	PolicyRounded,
	ReceiptRounded,
	SendRounded,
	ZoomInRounded,
} from "@mui/icons-material";
import {
	Container,
	Typography,
	Breadcrumbs,
	Card,
	CardContent,
	CardActions,
	CardMedia,
	Button,
	Box,
	Grid,
	Skeleton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Menu,
	MenuItem,
	Tabs,
	Tab,
	ListItemIcon,
	ListItemText,
	TextField,
} from "@mui/material";
import EmployeePageTemplate from "components/EmployeePageTemplate";
import OrderDetails from "components/OrderDetails";
import PaymentDetails from "components/PaymentDetails";
import PermitDetails from "components/PermitDetails";
import { UserDetails } from "components/UserDetails";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { auth, firestore, getFiles, getICs } from "lib/firebase";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyOrders() {
	const [pendingOrders, setPendingOrders] = useState([]);

	useEffect(() => {
		onSnapshot(
			query(collection(firestore, "allOrders"), where("complete", "==", true), where("status", "==", "orderSubmitted"), orderBy("timestamp", "asc")),
			(querySnapshot) => {
				let pendingOrders = [];
				querySnapshot.forEach((doc) => {
					pendingOrders.push(doc.data());
				});
				console.log({ pendingOrders });
				setPendingOrders(pendingOrders);
			}
		);
	}, []);

	return (
		<EmployeePageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Verify Orders</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					{pendingOrders.length > 0 ? (
						pendingOrders.map((order, index) => (
							<Grid item xs={12} md={6} key={index}>
								<PendingOrderCard order={order} />
							</Grid>
						))
					) : (
						<Grid item xs={12}>
							<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 4 }}>
								<Typography variant="h6">🥱</Typography>
								<Typography>No pending Orders...</Typography>
							</Box>
						</Grid>
					)}
				</Grid>
			</Container>
		</EmployeePageTemplate>
	);
}

function PendingOrderCard(props) {
	const { order } = props;
	const [imageURLs, setImageURLs] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [openRejectDialog, setOpenRejectDialog] = useState(false);
	const [editable, setEditable] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [user, setUser] = useState(null);
	const [currentTab, setCurrentTab] = useState(0);
	const [rejectReason, setRejectReason] = useState("");

	const HEIGHT = 512;

	useEffect(() => {
		(async () => {
			const user = (await getDoc(order.userRef)).data();
			console.log({ user });
			setUser(user);
			const images = await Promise.all([
				getFiles("receipts", order.orderID, order.userID),
				getFiles("permits", order.orderID, order.userID),
				getFiles("bankTransfers", order.orderID, order.userID),
				getICs(user.uid),
			]).then((results) => {
				return [...results[0], ...results[1], ...results[2], ...results[3]];
			});
			console.log(images);
			setImageURLs(images);
		})();
	}, []);

	const approveOrder = () => {
		updateDoc(doc(firestore, "allOrders", order.orderID), { status: "orderApproved" });
		addDoc(collection(firestore, "users", user.uid, "notifications"), {
			title: "Your order has been approved",
			subtitle: "We are now awaiting for your parcel to arrive in Labuan",
			details: "If you have any questions regarding this order, feel free to use the nudge button in My Orders",
			type: "success",
			seen: false,
			archived: false,
			href: "/member/my-orders",
			timestamp: serverTimestamp(),
		});
		addDoc(collection(firestore, "allOrders", order.orderID, "logTracker"), {
			timestamp: serverTimestamp(),
			status: "orderApproved",
			byUser: auth.currentUser.uid,
		});
	};
	const rejectOrder = () => {
		if (!rejectReason) {
			toast.error("Provide a reason before rejecting");
			return;
		}
		toast.promise(
			Promise.all([
				updateDoc(doc(firestore, "allOrders", order.orderID), { status: "orderRejected" }),
				addDoc(collection(firestore, "users", user.uid, "notifications"), {
					title: "We sincerely apologies but your order has been rejected",
					subtitle: `Reason: ${rejectReason}`,
					details: "If you have any questions regarding this order, feel free to use the nudge button in My Orders",
					type: "error",
					seen: false,
					archived: false,
					href: "/member/my-orders",
					timestamp: serverTimestamp(),
				}),
				addDoc(collection(firestore, "allOrders", order.orderID, "logTracker"), {
					timestamp: serverTimestamp(),
					status: "orderRejected",
					details: rejectReason,
					byUser: auth.currentUser.uid,
				}),
			]),
			{ loading: "Rejecting order...", error: "Error rejecting", success: "Order rejected" }
		);
	};

	return (
		<Fragment>
			<Dialog
				open={openRejectDialog}
				onClose={() => {
					setOpenRejectDialog(false);
				}}
			>
				<DialogTitle>Reject Order</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						label="Reason"
						type="text"
						fullWidth
						variant="outlined"
						value={rejectReason}
						onChange={(e) => {
							setRejectReason(e.target.value);
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						startIcon={<SendRounded />}
						onClick={() => {
							rejectOrder();
							setOpenRejectDialog(false);
						}}
					>
						Reject
					</Button>
					<Button startIcon={<CancelRounded />} onClick={() => setOpenRejectDialog(false)}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				open={openDialog}
				onClose={() => {
					setOpenDialog(false);
					setEditable(false);
				}}
			>
				<DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: 1, borderColor: "divider" }}>
					{order.orderID}
					<Box>
						<Button
							startIcon={<CheckRounded />}
							onClick={() => {
								approveOrder();
								setOpenDialog(false);
							}}
						>
							Approve
						</Button>
						<Button
							startIcon={<CloseRounded />}
							onClick={() => {
								setOpenRejectDialog(true);
								setOpenDialog(false);
							}}
						>
							Reject
						</Button>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ minHeight: "80vh", overflowX: "hidden" }}>
					<Box sx={{ borderBottom: 1, borderColor: "divider", width: "50vw" }}>
						<Tabs
							value={currentTab}
							onChange={(e, newTab) => {
								console.log(newTab);
								setCurrentTab(newTab);
							}}
						>
							<Tab label="order" />
							<Tab label="permit" />
							<Tab label="payment" />
							<Tab label="user" />
						</Tabs>
					</Box>
					<TabPanel value={currentTab} index={0}>
						<DialogContentText>Order Details</DialogContentText>
						<Box sx={{ my: 2 }}>
							<OrderDetails editable={editable} order={order} files={imageURLs.filter(({ path }) => path == "receipts")} />
						</Box>
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<DialogContentText>Permit Details</DialogContentText>
						<Box sx={{ my: 2 }}>
							<PermitDetails editable={editable} order={order} files={imageURLs.filter(({ path }) => path == "permits")} />
						</Box>
					</TabPanel>
					<TabPanel value={currentTab} index={2}>
						<DialogContentText>Payment Details</DialogContentText>
						<Box sx={{ my: 2 }}>
							<PaymentDetails editable={editable} order={order} files={imageURLs.filter(({ path }) => path == "bankTransfers")} />
						</Box>
					</TabPanel>
					<TabPanel value={currentTab} index={3}>
						<DialogContentText>User Details</DialogContentText>
						<Box sx={{ my: 2 }}>
							<UserDetails editable={false} user={user} files={imageURLs.filter(({ path }) => path == "ICs")} />
						</Box>
					</TabPanel>
				</DialogContent>
				<DialogActions sx={{ justifyContent: "space-between", borderTop: 1, borderColor: "divider" }}>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={() => {
							setAnchorEl(null);
						}}
						anchorOrigin={{
							vertical: "top",
							horizontal: "left",
						}}
						transformOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
					>
						{imageURLs.map((image, index) => {
							let icon;
							switch (image.path) {
								case "receipts":
									icon = <ReceiptRounded />;
									break;
								case "permits":
									icon = <PolicyRounded />;
									break;
								case "bankTransfers":
									icon = <AccountBalanceRounded />;
									break;
								case "ICs":
									icon = <CreditCardRounded />;
									break;
								default:
									icon = <BugReportRounded />;
									break;
							}
							return (
								<MenuItem
									key={index}
									onClick={() => {
										setAnchorEl(null);
										window.open(image.URL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=512,height=512");
									}}
								>
									<ListItemIcon>{icon}</ListItemIcon>
									<ListItemText>{image.name}</ListItemText>
								</MenuItem>
							);
						})}
					</Menu>
					<Box>
						<Button
							startIcon={<ZoomInRounded />}
							onClick={(e) => {
								setAnchorEl(e.currentTarget);
							}}
						>
							View Files
						</Button>
					</Box>
					<Box>
						{editable && (
							<Button startIcon={<SendRounded />} onClick={() => setEditable(false)}>
								Submit
							</Button>
						)}
						{editable ? (
							<Button startIcon={<CancelRounded />} onClick={() => setEditable(false)}>
								Cancel
							</Button>
						) : (
							<Button startIcon={<EditRounded />} onClick={() => setEditable(true)}>
								Edit
							</Button>
						)}
					</Box>
				</DialogActions>
			</Dialog>
			<Card>
				{!imageURLs.length ? (
					<Skeleton variant="rectangular" height={HEIGHT} />
				) : (
					<Fragment>
						{imageURLs.map((image, index) => (
							<Box sx={{ overflow: "hidden" }} key={index}>
								<CardMedia
									component="img"
									sx={[
										{
											"&:hover": {
												transform: "scale(1.1)",
											},
										},
										{ height: HEIGHT / imageURLs.length, cursor: "pointer", transition: "all 0.5s ease" },
									]}
									src={image.URL}
									alt={`${image.name}`}
									onClick={() => {
										window.open(image.URL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=512,height=512");
									}}
								/>
							</Box>
						))}
					</Fragment>
				)}
				<CardContent sx={{ display: "flex", justifyContent: "space-between", height: "8em" }}>
					<Box sx={{ maxWidth: "80%" }}>
						<Typography gutterBottom variant="h5" component="div">
							{user?.fullName}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{user?.IC} | {user?.email}
						</Typography>
					</Box>
					<Typography gutterBottom variant="caption" component="div" sx={{ mt: 1 }}>
						{moment(order.timestamp.toDate()).fromNow()}
					</Typography>
				</CardContent>
				<CardActions sx={{ justifyContent: "space-between" }}>
					<Box></Box>
					<Box>
						<Button onClick={() => setOpenDialog(true)}>Verify</Button>
					</Box>
				</CardActions>
			</Card>
		</Fragment>
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
