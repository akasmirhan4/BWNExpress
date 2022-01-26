import { CheckRounded, CloseRounded, EditRounded, SendRounded, ZoomInRounded } from "@mui/icons-material";
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
} from "@mui/material";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import { UserDetails } from "components/UserDetails";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { firestore, getICs, sendNotification } from "lib/firebase";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";

export default function VerifyUsers() {
	const [pendingUsers, setPendingUsers] = useState([]);

	useEffect(() => {
		onSnapshot(query(collection(firestore, "users"), where("verified.IC", "==", "pending")), (querySnapshot) => {
			console.log("snapshot");
			let _pendingUsers = [];
			querySnapshot.forEach((doc) => {
				let data = doc.data();
				data.creationDate = moment(data.creationDate.toDate()).fromNow();
				_pendingUsers.push(data);
			});
			console.log({ pendingUsers: _pendingUsers });
			setPendingUsers(_pendingUsers);
		});
	}, []);

	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Verify Users</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					{pendingUsers.length > 0 ? (
						pendingUsers.map((user, index) => (
							<Grid item xs={12} md={6} key={index}>
								<PendingUserCard user={user} />
							</Grid>
						))
					) : (
						<Grid item xs={12}>
							<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 4 }}>
								<Typography variant="h6">🥱</Typography>
								<Typography>No pending Users...</Typography>
							</Box>
						</Grid>
					)}
				</Grid>
			</Container>
		</ModeratorPageTemplate>
	);
}

function PendingUserCard(props) {
	const { user } = props;
	const [imageURLs, setImageURLs] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [editable, setEditable] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const HEIGHT = 512;

	useEffect(() => {
		(async () => {
			console.log({ date: new Date(user.DOB) });
			setImageURLs(await getICs(user.uid));
		})();
	}, []);

	return (
		<Fragment>
			<Dialog
				open={openDialog}
				onClose={() => {
					setOpenDialog(false);
					setEditable(false);
				}}
			>
				<DialogTitle>{`${user.preferredName} Details`}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Check the details match with his/her IC. You may edit to ensure it is correct and the user will be notified of the change.
					</DialogContentText>
					<Box sx={{ my: 2 }}>
						<UserDetails editable={editable} user={user} />
					</Box>
				</DialogContent>
				<DialogActions sx={{ justifyContent: "space-between" }}>
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
						{imageURLs.map((image, index) => (
							<MenuItem
								key={index}
								onClick={() => {
									setAnchorEl(null);
									window.open(image.URL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=512,height=512");
								}}
							>
								{image.name}
							</MenuItem>
						))}
					</Menu>
					<Box>
						<Button
							startIcon={<ZoomInRounded />}
							onClick={(e) => {
								setAnchorEl(e.currentTarget);
							}}
						>
							View IC
						</Button>
					</Box>
					<Box>
						{editable ? (
							<Button startIcon={<SendRounded />} onClick={() => setEditable(false)}>
								Submit
							</Button>
						) : (
							<Button startIcon={<EditRounded />} onClick={() => setEditable(true)}>
								Edit
							</Button>
						)}

						<Button startIcon={<CloseRounded />}>Exit</Button>
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
							{user.fullName}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{user.IC} | {user.email}
						</Typography>
					</Box>
					<Typography gutterBottom variant="caption" component="div" sx={{ mt: 1 }}>
						{user.creationDate}
					</Typography>
				</CardContent>
				<CardActions sx={{ justifyContent: "space-between" }}>
					<Box>
						<Button onClick={() => setOpenDialog(true)}>details</Button>
					</Box>
					<Box>
						<Button
							startIcon={<CloseRounded />}
							onClick={() => {
								sendNotification(user.uid, {
									title: "Your verification process has been rejected",
									subtitle: "Please upload your IC again",
									details: "Ensure your IC is not expired and the images uploaded are clear",
									type: "alert",
									href: "/member/upload-ic",
								});
								updateDoc(doc(firestore, "users", user.uid), { "verified.IC": false });
							}}
						>
							decline
						</Button>
						<Button
							sx={{ ml: 2 }}
							startIcon={<CheckRounded />}
							onClick={() => {
								sendNotification(user.uid, {
									title: "Your verification process has been accepted",
									subtitle: "Thank you for registering with us 🤗",
									details:
										"You may now place an order by clicking on the Place An Order Button located on the left menu or the Plus button located on the bottom right of the screen",
									type: "success",
									href: "/member/verification",
								});
								updateDoc(doc(firestore, "users", user.uid), { "verified.IC": true });
							}}
						>
							accept
						</Button>
					</Box>
				</CardActions>
			</Card>
		</Fragment>
	);
}
