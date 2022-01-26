import { TextField } from "@mui/material";
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

	const { user } = props;

	useImperativeHandle(ref, () => ({
		async send() {
			sendNotification(user.uid, {
				title,
				subtitle,
				details,
				type,
				href,
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
		</Fragment>
	);
});

NotificationForm.displayName = "NotificationForm";
