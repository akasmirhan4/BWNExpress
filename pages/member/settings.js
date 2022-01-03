import React, { Fragment, useEffect, useRef, useState } from "react";
import {
	Avatar,
	Badge,
	Box,
	Button,
	ButtonBase,
	Checkbox,
	Container,
	FormControlLabel,
	FormGroup,
	Grid,
	IconButton,
	InputAdornment,
	MenuItem,
	Skeleton,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUser, setAvatarURL, selectAvatarURL, selectFCMAllowed } from "lib/slices/userSlice";
import toast from "react-hot-toast";
import { EditRounded } from "@mui/icons-material";
import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { auth, firestore, getAvatarURL, messaging, setFCM, storage } from "lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { getToken } from "firebase/messaging";

export default function Settings() {
	const [notificationPermission, setNotificationPermission] = useState("default");
	const [desktopNotification, setDesktopNotification] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!("Notification" in window)) {
			toast("This browser does not support desktop notification");
			return;
		}
		setNotificationPermission(Notification.permission);
	}, []);

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				{notificationPermission == "default" && (
					<Button
						onClick={() => {
							// Let's check if the browser supports notifications
							if (!("Notification" in window)) {
								toast("This browser does not support desktop notification");
								return;
							}
							Notification.requestPermission().then(function (permission) {
								// If the user accepts, let's create a notification
								if (permission === "granted") {
									let notification = new Notification("Hi there!");
									setNotificationPermission(permission);
								}
							});
						}}
					>
						Enable Notification
					</Button>
				)}
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								defaultChecked
								checked={notificationPermission == "granted" && desktopNotification}
								onChange={() => {
									setDesktopNotification(!desktopNotification);
								}}
							/>
						}
						label="Receive desktop notifications"
					/>
					<FormControlLabel control={<Switch defaultChecked />} label="Receive email notifications" />
					<FormControlLabel control={<Switch defaultChecked />} label="Receive updates & promotions" />
					<FormControlLabel disabled control={<Switch />} label="Receive app push notifications - In Progress" />
					<FormControlLabel disabled control={<Switch />} label="Dark Mode - In Progress" />
				</FormGroup>
			</Container>
		</MemberPageTemplate>
	);
}
