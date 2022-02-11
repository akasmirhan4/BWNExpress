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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { collection, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore, getOrder, sendNotification } from "lib/firebase";
import moment from "moment";
import { AnnouncementRounded, AttachmentRounded, SendRounded } from "@mui/icons-material";
import NudgeDialog from "components/NudgeDialog";
import toast from "react-hot-toast";
import CustomUploadButton from "components/CustomUploadButton";

export default function Nudges() {
	const router = useRouter();
	const [nudgesRef, setNudgesRef] = useState([]);
	const [openNudgeDialog, setOpenNudgeDialog] = useState(false);
	const [order, setOrder] = useState(null);

	useEffect(() => {
		if (!router.query.orderID) return;
		// get nudges from firebase
		onSnapshot(collection(firestore, "allOrders", router.query.orderID, "nudges"), (snapshot) => {
			let refs = [];
			snapshot.forEach((doc) => {
				refs.push(doc.data().ref);
			});
			setNudgesRef(refs);
		});
		getOrder(router.query.orderID).then(setOrder);
	}, [router]);

	return (
		<MemberPageTemplate>
			<NudgeDialog open={openNudgeDialog} onClose={() => setOpenNudgeDialog(false)} order={order} />
			<Container sx={{ my: 4 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="/member/my-orders" passHref>
							<Link underline="hover" color="inherit">
								My Orders
							</Link>
						</NextLink>
						<Typography color="text.primary">Details</Typography>
					</Breadcrumbs>
					<Button variant="contained" sx={{ my: 2 }} startIcon={<AnnouncementRounded />} onClick={() => setOpenNudgeDialog(true)}>
						Send Nudge
					</Button>
				</Box>
				<Tabs value={1} sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
					<Tab label="Order Summary" onClick={() => router.push(`/member/my-orders/${router.query.orderID}/details`)} />
					<Tab label="Nudges" onClick={() => router.push(`/member/my-orders/${router.query.orderID}/nudges`)} />
				</Tabs>
				<Box sx={{ mt: 4 }}>
					{nudgesRef.length > 0 ? (
						nudgesRef.map((ref, i) => <NudgeCard key={i} nudgeRef={ref} order={order} />)
					) : (
						<Typography>There are no nudges to show 🥱</Typography>
					)}
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}

function NudgeCard(props) {
	const { nudgeRef, order } = props;
	const [nudge, setNudge] = useState(null);
	const [mouseOver, setMouseOver] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorElReply, setAnchorElReply] = useState(null);
	const [reply, setReply] = useState("");
	const [files, setFiles] = useState([]);

	useEffect(() => {
		if (!nudgeRef) return;
		onSnapshot(nudgeRef, (snapshot) => {
			setNudge({ ...snapshot.data(), id: snapshot.id });
		});
	}, [nudgeRef]);

	const sendReply = async () => {
		if (!order || !reply) return;
		const getURL = (file) => {
			return new Promise(async (resolve) => {
				const storageRef = ref(storage, `nudges/${nudge.id}/${file.name}`);
				await uploadBytes(storageRef, file);
				const URL = await getDownloadURL(storageRef);
				resolve({ URL, ref: storageRef, name: file.name, type: file.type });
			});
		};
		let batchPromises = [];
		for (let i = 0; i < files.length; i++) {
			batchPromises.push(getURL(files[i]));
		}
		const results = await Promise.all(batchPromises);
		sendNotification(order.userID, {
			title: "You have replied a nudge",
			subtitle: nudge.query,
			details: `Reply: ${reply}`,
			type: "nudge",
			href: `/member/my-orders/${order.orderID}/nudges`,
			notification: {
				email: true,
				SMS: true,
				app: true,
				desktop: true,
			},
		});

		await toast.promise(
			updateDoc(nudgeRef, {
				answered: true,
				answeredTimestamp: serverTimestamp(),
				answeredImageURLs: results.map(({ URL }) => URL),
				answeredBy: order.userID,
				reply,
			}),
			{
				loading: "replying...",
				success: "Replied to nudge!",
				error: "Error replying to nudge",
			}
		);
	};

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
			<CardHeader
				title={`${nudge?.query == "Others" ? nudge?.remark : nudge?.query} ${nudge?.answered ? " ✅" : " ⏳"}`}
				subheader={moment(nudge?.timestamp?.toDate()).fromNow()}
			/>
			<CardContent>
				{nudge?.query != "Others" && (
					<Typography color="textSecondary" component="p">
						<b>Remark: </b>
						{nudge?.remark}
					</Typography>
				)}
				{nudge?.to === "moderator" ? (
					!!nudge?.reply ? (
						<TextField
							label="Reply"
							multiline
							variant="outlined"
							fullWidth
							disabled
							value={nudge?.reply}
							helperText={moment(nudge?.answeredTimestamp?.toDate()).fromNow()}
							FormHelperTextProps={{ sx: { textAlign: "right" } }}
							sx={{ my: 2 }}
						/>
					) : (
						<Typography variant="body2" color="textSecondary" component="p" sx={{ fontStyle: "italic" }}>
							No reply yet
						</Typography>
					)
				) : (
					<TextField
						label="Reply"
						multiline
						variant="outlined"
						fullWidth
						onChange={(e) => setReply(e.target.value)}
						value={nudge?.answered ? nudge?.reply : reply}
						disabled={nudge?.answered}
						sx={{ my: 2 }}
					/>
				)}
			</CardContent>
			<Menu anchorEl={anchorElReply} open={Boolean(anchorElReply)} onClose={() => setAnchorElReply(null)}>
				{nudge?.answeredImageURLs?.map((url, i) => (
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
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				{nudge?.imageURLs?.map((url, i) => (
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
				<Box sx={{ display: "flex" }}>
					{nudge?.imageURLs?.length > 0 && (
						<Button
							startIcon={<AttachmentRounded />}
							onClick={(e) => {
								setAnchorEl(e.target);
							}}
						>
							Attachments
						</Button>
					)}
					{nudge?.answeredImageURLs?.length > 0 && (
						<Button
							startIcon={<AttachmentRounded />}
							onClick={(e) => {
								setAnchorElReply(e.target);
							}}
						>
							Reply Attachments
						</Button>
					)}
					{nudge?.to === "member" && !nudge?.answered && (
						<>
							<CustomUploadButton
								tooltip="Attach reference"
								label="Attach file (Optional)"
								maxFile={4}
								value={files}
								preventUpload
								onChange={(files) => {
									let _files = [];
									for (let i = 0; i < files.length; i++) {
										_files.push(files[i]);
									}
									setFiles(_files);
								}}
								sx={{ my: 2 }}
							/>
							<Button
								startIcon={<SendRounded />}
								onClick={() => {
									sendReply();
								}}
							>
								Reply
							</Button>
						</>
					)}
				</Box>
				{/* <Button startIcon={<DeleteForeverRounded />}>Remove</Button> */}
			</CardActions>
		</Card>
	);
}
