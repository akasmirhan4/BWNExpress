import {
	Breadcrumbs,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Container,
	Link,
	ListItemText,
	Menu,
	MenuItem,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import MemberPageTemplate from "components/MemberPageTemplate";
import OrderSummary from "components/OrderSummary";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { collection, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "lib/firebase";
import moment from "moment";
import { AttachFile, AttachFileRounded, DeleteForeverRounded } from "@mui/icons-material";

export default function Nudges() {
	const router = useRouter();
	const [nudges, setNudges] = useState([]);

	useEffect(() => {
		if (!router.query.orderID) return;
		// get nudges from firebase
		onSnapshot(collection(firestore, "allOrders", router.query.orderID, "nudges"), (snapshot) => {
			let batchPromises = [];
			snapshot.forEach((doc) => {
				batchPromises.push(getDoc(doc.data().ref));
			});
			Promise.all(batchPromises).then((docs) => {
				let _nudges = [];
				docs.forEach((doc) => {
					_nudges.push(doc.data());
				});
				setNudges(_nudges);
			});
		});
	}, [router]);

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
				<Tabs value={1} sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
					<Tab label="Order Summary" onClick={() => router.push(`/member/my-orders/${router.query.orderID}/details`)} />
					<Tab label="Nudges" onClick={() => router.push(`/member/my-orders/${router.query.orderID}/nudges`)} />
				</Tabs>
				<Box sx={{ mt: 4 }}>{nudges.length > 0 && nudges.map((nudge, i) => <NudgeCard key={i} nudge={nudge} />)}</Box>
			</Container>
		</MemberPageTemplate>
	);
}

{
	/* Create Nudge Card Component */
}
function NudgeCard(props) {
	const { nudge } = props;
	console.log(nudge);
	const [mouseOver, setMouseOver] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	return (
		<Card
			onMouseOver={() => setMouseOver(true)}
			onMouseLeave={() => setMouseOver(false)}
			sx={{ boxShadow: (theme) => (mouseOver ? theme.shadows[2] : theme.shadows[1]), cursor: "pointer", mb: 2, position: "relative" }}
			onClick={(e) => {
				e.preventDefault();
				if (!!props.details) setOpenDialog(true);
			}}
		>
			<CardHeader title={`${nudge?.query} ${nudge?.answered ? " ✅" : " ⏳"}`} subheader={moment(nudge?.timestamp?.toDate()).fromNow()} />
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					{nudge?.remark}
				</Typography>
				{!!nudge?.reply ? (
					<TextField
						label="Reply"
						multiline
						variant="outlined"
						fullWidth
						disabled
						value={nudge.reply}
						helperText={moment(nudge.answeredTimestamp?.toDate()).fromNow()}
						FormHelperTextProps={{ sx: { textAlign: "right" } }}
					/>
				) : (
					<Typography variant="body2" color="textSecondary" component="p" sx={{ fontStyle: "italic" }}>
						No reply yet
					</Typography>
				)}
			</CardContent>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				{nudge.answeredImagesURL?.map((url, i) => (
					<MenuItem
						key={i}
						onClick={() => {
							window.open(url, "_blank");
						}}
					>
						<ListItemText>{`Attached File #${i + 1}`}</ListItemText>
					</MenuItem>
				))}
			</Menu>
			<CardActions sx={{ justifyContent: "space-between" }}>
				{nudge.answeredImagesURL?.length > 0 && (
					<Button
						startIcon={<AttachFileRounded />}
						onClick={(e) => {
							setAnchorEl(e.target);
						}}
					>
						Attachments
					</Button>
				)}
				<Button startIcon={<DeleteForeverRounded />}>Remove</Button>
			</CardActions>
		</Card>
	);
}
