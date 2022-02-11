import { CustomSelector } from "components/FormInputs";
import CustomUploadButton from "components/CustomUploadButton";
import { LoadingButton } from "@mui/lab";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, sendNotification, storage } from "lib/firebase";
import toast from "react-hot-toast";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { AnnouncementRounded, CloseRounded } from "@mui/icons-material";
import { useState } from "react";
import router from "next/router";

export default function NudgeDialog(props) {
	const { open, onClose, order, to = "moderator", redirect = "false" } = props;
	const [orderQuery, setOrderQuery] = useState("");
	const [remark, setRemark] = useState("");
	const [images, setImages] = useState([]);
	const [isSending, setIsSending] = useState(false);
	console.log({ order });

	const handleClose = () => {
		setOrderQuery("");
		setRemark("");
		setImages([]);
		onClose();
	};

	const nudge = async () => {
		if (!order) return;
		setIsSending(true);
		const nudgeDocRef = doc(collection(firestore, "nudges"));
		const nudgeID = nudgeDocRef.id;

		const getURL = (file) => {
			return new Promise(async (resolve) => {
				const storageRef = ref(storage, `nudges/${nudgeID}/${file.name}`);
				await uploadBytes(storageRef, file);
				const URL = await getDownloadURL(storageRef);
				resolve({ URL, ref: storageRef, name: file.name, type: file.type });
			});
		};
		let batchPromises = [];
		for (let i = 0; i < images.length; i++) {
			batchPromises.push(getURL(images[i]));
		}
		const nudgeRef = doc(firestore, "nudges", nudgeID);
		const results = await Promise.all(batchPromises);
		setDoc(doc(firestore, "allOrders", order.orderID, "nudges", nudgeID), { ref: nudgeRef });

		sendNotification(order.userID, {
			title: to === "moderator" ? "You have sent a nudge" : "You have received a nudge",
			subtitle: orderQuery,
			details: remark,
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
			setDoc(nudgeRef, {
				answered: false,
				timestamp: serverTimestamp(),
				query: orderQuery,
				remark,
				to,
				imageURLs: results.map(({ URL }) => URL),
				orderRef: doc(firestore, "allOrders", order.orderID),
			}),
			{
				loading: to === "moderator" ? "nudging the team..." : "nudging the customer...",
				success: "Nudged",
				error: "Error sending nudge",
			}
		);
		if (redirect) router.push(`/member/my-orders/${order.orderID}/nudges`);
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>{to === "moderator" ? "Got queries with this order? Give us a nudge 😬" : "Send nudge to customer regarding this order"}</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ mb: 2 }}>Order ID: {order?.orderID}</DialogContentText>
				{to === "moderator" ? (
					<CustomSelector
						label="Order Query"
						tooltip="Common query"
						required
						onChange={(e) => setOrderQuery(e.target.value)}
						value={orderQuery}
						items={[
							"When is the parcel expected to arrive?",
							"What is the status of the permit application?",
							"What are the next steps?",
							"I think the parcel is charged wrongly",
							"There is an issue with this order",
							"Others",
						]}
						sx={{ my: 2 }}
					/>
				) : (
					<TextField label="Order Query" fullWidth sx={{ mb: 1 }} required value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} />
				)}
				<TextField
					label="Remark"
					multiline
					minRows={3}
					fullWidth
					sx={{ mb: 1 }}
					required={orderQuery == "Others"}
					value={remark}
					onChange={(e) => setRemark(e.target.value)}
				/>
				<CustomUploadButton
					tooltip="Attach any images for reference"
					label="Upload Screenshots (Optional)"
					maxFile={4}
					value={images}
					accept="image/jpeg,image/png"
					preventUpload
					onChange={(files) => {
						let images = [];
						for (let i = 0; i < files.length; i++) {
							images.push(files[i]);
						}
						setImages(images);
					}}
					sx={{ mb: 4, mt: 1 }}
				/>
				<DialogContentText>🔔 You will be notified when our team respond to your queries!</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button startIcon={<CloseRounded />} onClick={handleClose}>
					Cancel
				</Button>
				<LoadingButton loading={isSending} startIcon={<AnnouncementRounded />} disabled={!orderQuery || (orderQuery == "Others" && !remark)} onClick={nudge}>
					Nudge
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
