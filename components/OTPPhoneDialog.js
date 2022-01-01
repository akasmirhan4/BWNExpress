import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";
import { IMaskInput } from "react-imask";
import { forwardRef } from "react";

export default function OTPFormDialog(props) {
	const { phoneNo } = useSelector(selectUserData) ?? {};
	const [OTP, setOTP] = useState("");

	return (
		<Dialog {...props} open={props.open ?? false}>
			<DialogContent>
				<DialogContentText></DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="OTP Code"
					type="numeric"
					inputMode="numeric"
					fullWidth
					variant="standard"
					value={OTP}
					onChange={setOTP}
					InputProps={{
						inputComponent: TextMaskOTP,
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => props.onClose()}>Cancel</Button>
				<Button
					onClick={() => {
						props.onClose();
						props.onSubmit(OTP);
					}}
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const TextMaskOTP = forwardRef((props, ref) => {
	const { onChange, ...other } = props;
	return (
		<IMaskInput
			{...other}
			mask="000000"
			definitions={{
				"#": /[1-9]/,
			}}
			inputRef={ref}
			onAccept={onChange}
			overwrite
		/>
	);
});

TextMaskOTP.displayName = "TextMaskOTP";
