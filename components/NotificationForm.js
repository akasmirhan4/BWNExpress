import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField } from "@mui/material";
import { sendNotification } from "lib/firebase";
import React, { forwardRef, Fragment, useImperativeHandle } from "react";
import { useState } from "react";
import { CustomSelector } from "./FormInputs";

export const NotificationForm = forwardRef((props, ref) => {
	const [title, setTitle] = useState("");
	const [subtitle, setSubstitle] = useState("");
	const [details, setDetails] = useState("");
	const [type, setType] = useState("");
	const [href, setHref] = useState("");
	const [sendEmail, setSendEmail] = useState(false);
	const [sendSMS, setSendSMS] = useState(false);
	const [sendAppNotification, setSendAppNotification] = useState(false);
	const [sendDesktopNotification, setSendDesktopNotification] = useState(false);

	const { user } = props;

	useImperativeHandle(ref, () => ({
		async send() {
			sendNotification(user.uid, {
				title,
				subtitle,
				details,
				type,
				href,
				notification: {
					email: sendEmail,
					SMS: sendSMS,
					app: sendAppNotification,
					desktop: sendDesktopNotification,
				},
			});
		},
	}));

	return (
		<Fragment>
			<TextField
				margin="dense"
				label="Title"
				type="text"
				fullWidth
				variant="outlined"
				value={title}
				onChange={(e) => {
					setTitle(e.target.value);
				}}
			/>
			<TextField
				margin="dense"
				label="Subtitle"
				type="text"
				fullWidth
				variant="outlined"
				value={subtitle}
				onChange={(e) => {
					setSubstitle(e.target.value);
				}}
			/>
			<TextField
				margin="dense"
				label="Details"
				type="text"
				fullWidth
				minRows={3}
				variant="outlined"
				value={details}
				onChange={(e) => {
					setDetails(e.target.value);
				}}
			/>
			<CustomSelector
				label="Type"
				value={type}
				items={["success", "alert", "message"]}
				onChange={(e) => {
					setType(e.target.value);
				}}
			/>
			<TextField
				margin="dense"
				label="href"
				type="text"
				fullWidth
				variant="outlined"
				value={href}
				onChange={(e) => {
					setHref(e.target.value);
				}}
			/>
			<FormControl sx={{ my: 3 }} component="fieldset" variant="standard">
				<FormLabel component="legend">Push Notify User</FormLabel>
				<FormGroup sx={{ ml: 2 }}>
					<FormControlLabel control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />} label="Send Email" />
					<FormControlLabel control={<Checkbox checked={sendSMS} onChange={(e) => setSendSMS(e.target.checked)} />} label="Send SMS" disabled />
					<FormControlLabel
						control={<Checkbox checked={sendAppNotification} onChange={(e) => setSendAppNotification(e.target.checked)} />}
						label="Push App Notification"
						disabled
					/>
					<FormControlLabel
						control={<Checkbox checked={sendDesktopNotification} onChange={(e) => setSendDesktopNotification(e.target.checked)} />}
						label="Push Desktop Notification"
						disabled
					/>
				</FormGroup>
			</FormControl>
		</Fragment>
	);
});

NotificationForm.displayName = "NotificationForm";
