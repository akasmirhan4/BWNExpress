import {
	Container,
	Typography,
	Tooltip,
	Breadcrumbs,
	Card,
	CardContent,
	CardActions,
	Button,
	Box,
	Grid,
	TextField,
	IconButton,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import { collection, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { firestore } from "lib/firebase";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { SendRounded, FindInPageRounded, AttachFileRounded, CloseRounded } from "@mui/icons-material";
import OrderDetails from "components/OrderDetails";

export default function ManageNudges() {
	const [nudges, setNudges] = useState([]);

	useEffect(() => {
		onSnapshot(query(collection(firestore, "nudges"), where("answered", "==", false), orderBy("timestamp", "asc")), (querySnapshot) => {
			let nudges = [];
			querySnapshot.forEach((doc) => {
				nudges.push(doc.data());
			});
			console.log({ nudges });
			setNudges(nudges);
		});
	}, []);

	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Incoming Nudges</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					{nudges.length > 0 ? (
						nudges.map((nudge, index) => (
							<Grid item xs={12} md={6} key={index}>
								<NudgeCard nudge={nudge} />
							</Grid>
						))
					) : (
						<Grid item xs={12}>
							<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 4 }}>
								<Typography variant="h6">🎉</Typography>
								<Typography>No nudges to manage...</Typography>
							</Box>
						</Grid>
					)}
				</Grid>
			</Container>
		</ModeratorPageTemplate>
	);
}

function NudgeCard(props) {
	const { nudge } = props;
	const [openDialog, setOpenDialog] = useState(false);
	const [answer, setAnswer] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [order, setOrder] = useState(null);

	useEffect(() => {
		if (!nudge.orderRef) return;
		getDoc(nudge.orderRef).then((doc) => {
			setOrder(doc.data());
		});
	}, []);

	return (
		<Fragment>
			<OrderDetailsDialog open={openDialog} onClose={() => setOpenDialog(false)} order={order} />
			{nudge.imageURLs?.length > 0 && (
				<Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
					{nudge.imageURLs?.map((imageURL, index) => (
						<MenuItem
							onClick={() => {
								window.open(imageURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=512,height=512");
							}}
							key={index}
						>
							<Typography>{`image #${index}`}</Typography>
						</MenuItem>
					))}
				</Menu>
			)}
			<Card>
				<CardContent>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<Box sx={{ maxWidth: "80%" }}>
							<Typography gutterBottom variant="body1" component="div">
								{nudge.query == "Others" ? nudge.remark : nudge.query}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{nudge.query != "Others" && nudge.remark}
							</Typography>
						</Box>
						<Typography gutterBottom variant="caption" component="div" sx={{ mt: 1 }}>
							{moment(nudge.timestamp.toDate()).fromNow()}
						</Typography>
					</Box>
					<TextField label="Answer" multiline minRows={3} fullWidth required value={answer} onChangeCapture={(e) => setAnswer(e.target.value)} sx={{ mt: 2 }} />
				</CardContent>
				<CardActions sx={{ justifyContent: "space-between" }}>
					<Box>
						<Tooltip title="See Order">
							<IconButton onClick={() => setOpenDialog(true)}>
								<FindInPageRounded color="primary" />
							</IconButton>
						</Tooltip>
						{nudge.imageURLs?.length > 0 && (
							<Tooltip title="See Attached Image">
								<IconButton onClick={(e) => setAnchorEl(e.target)}>
									<AttachFileRounded color="primary" />
								</IconButton>
							</Tooltip>
						)}
					</Box>
					<Box>
						<Button onClick={() => {}} startIcon={<SendRounded />}>
							Send
						</Button>
					</Box>
				</CardActions>
			</Card>
		</Fragment>
	);
}

function OrderDetailsDialog(props) {
	const { open = false, onClose = () => {}, order = null } = props;

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Order Details</DialogTitle>
			<DialogContent sx={{ minHeight: "80vh", overflowX: "hidden" }}>
				<OrderDetails order={order} />
			</DialogContent>
			<DialogActions>
				<Button startIcon={<CloseRounded />} onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
}
