import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TextField, Divider, Button, Box } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { firestore, functions, getICs } from "lib/firebase";
import { selectRole } from "lib/slices/userSlice";
import React, { forwardRef, Fragment, useEffect, useImperativeHandle } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { CustomSelector } from "./FormInputs";

export const UserDetails = forwardRef((props, ref) => {
	const { editable } = props;

	const [user, setUser] = useState(props.user);
	const [ICs, setICs] = useState([]);

	const role = useSelector(selectRole);

	useImperativeHandle(ref, () => ({
		async save() {
			let data = { ...user, DOB: new Date(user.DOB).toISOString() };
			console.log({ role: data.role });
			switch (data.role) {
				case "moderator":
					await httpsCallable(functions, "addModerator")({ email: data.email });
					console.log({ role: data.role });
					break;
				case "employee":
					await httpsCallable(functions, "addEmployee")({ email: data.email });
					break;
				case "member":
					await httpsCallable(functions, "addMember")({ email: data.email });
					break;
				default:
					break;
			}
			delete data.role;
			return updateDoc(doc(firestore, "users", user.uid), data);
		},
	}));

	useEffect(() => {
		if (props.files?.length > 0) {
			setICs(props.files);
		} else {
			getICs(user.uid).then(setICs);
		}
	}, []);

	return (
		<Fragment>
			<TextField
				margin="dense"
				label="Full Name"
				type="text"
				fullWidth
				variant="outlined"
				value={user.fullName}
				disabled={!editable}
				onChange={(e) => {
					setUser({ ...user, fullName: e.target.value });
				}}
			/>
			<TextField
				margin="dense"
				label="IC"
				type="text"
				fullWidth
				variant="outlined"
				value={user.IC}
				disabled={!editable}
				onChange={(e) => {
					setUser({ ...user, IC: e.target.value });
				}}
			/>
			<LocalizationProvider dateAdapter={AdapterDateFns} sx>
				<DatePicker
					label="Date Of Birth"
					value={user.DOB}
					onChange={(DOB) => {
						setUser({ ...user, DOB });
					}}
					inputFormat="dd/MM/yyyy"
					InputProps={{ disableUnderline: true }}
					disabled={!editable}
					renderInput={(params) => <TextField {...params} fullWidth variant="outlined" margin="dense" />}
					OpenPickerButtonProps={{ sx: { mr: 0 } }}
				/>
			</LocalizationProvider>
			<CustomSelector
				label="Gender"
				value={user.gender}
				items={["Male", "Female"]}
				onChange={(e) => {
					setUser({ ...user, gender: e.target.value });
				}}
				disabled={!editable}
			/>
			<TextField
				margin="dense"
				label="Address"
				type="text"
				fullWidth
				multiline
				minRows={3}
				variant="outlined"
				value={user.address}
				disabled={!editable}
				onChange={(e) => {
					setUser({ ...user, address: e.target.value });
				}}
			/>
			{user.isDifferentAddress && (
				<TextField
					margin="dense"
					label="Delivery Address"
					type="text"
					fullWidth
					multiline
					minRows={3}
					variant="outlined"
					value={user.deliveryAddress}
					disabled={!editable}
					onChange={(e) => {
						setUser({ ...user, deliveryAddress: e.target.value });
					}}
				/>
			)}
			<Divider sx={{ my: 2 }} />
			<TextField margin="dense" label="Email Address" type="email" fullWidth variant="outlined" value={user.email} disabled />
			<TextField
				margin="dense"
				label="Phone No"
				type="tel"
				fullWidth
				variant="outlined"
				value={user.phoneNo}
				disabled={!editable}
				onChange={(e) => {
					setUser({ ...user, phoneNo: e.target.value });
				}}
			/>
			<TextField
				margin="dense"
				label="Preferred Name"
				type="text"
				fullWidth
				variant="outlined"
				value={user.preferredName}
				disabled={!editable}
				onChange={(e) => {
					setUser({ ...user, preferredName: e.target.value });
				}}
			/>
			{role == "moderator" && (
				<CustomSelector
					label="Role"
					value={user.role}
					items={["moderator", "employee", "member"]}
					onChange={(e) => {
						setUser({ ...user, role: e.target.value });
					}}
					disabled={!editable}
				/>
			)}
			{ICs.length > 0 && (
				<Box sx={{ mt: 2 }}>
					{ICs.map((file, index) => (
						<Button
							key={index}
							variant="contained"
							onClick={() => {
								window.open(file.URL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=512,height=512");
							}}
							sx={{ mr: 1 }}
						>{`See IC #${index + 1}`}</Button>
					))}
				</Box>
			)}
		</Fragment>
	);
});

UserDetails.displayName = "UserDetails";
