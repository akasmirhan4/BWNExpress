import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Typography, Box, Container, TextField, Button, Grid, MenuItem, Checkbox, InputAdornment } from "@mui/material";
import styles from "styles/main.module.scss";
import { forwardRef, useEffect, useState } from "react";
import router from "next/router";
import Link2 from "next/link";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { IMaskInput } from "react-imask";
import { functions } from "lib/firebase";
import toast from "react-hot-toast";
import { useAuthCheck } from "lib/hooks";

export default function NewUser(params) {
	const { userData } = useAuthCheck();

	return (
		<Box>
			<NewUserContainer pt={"4em"} userData={userData} />
		</Box>
	);
}

function NewUserContainer(props) {
	const { userData } = props;
	const [fullName, setFullName] = useState("");
	const [preferredName, setPreferredName] = useState("");
	const [IC, setIC] = useState("");
	const [gender, setGender] = useState("");
	const [DOB, setDOB] = useState(null);
	const [phoneNo, setPhoneNo] = useState("");
	const [address, setAddress] = useState("");
	const [isDifferentAddress, setIsDifferentAddress] = useState(false);
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [validity, setValidity] = useState(null);
	const [valid, setValid] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		if (userData) {
			const { fullName, preferredName, IC, gender, DOB, phoneNo, address, isDifferentAddress, deliveryAddress } = userData || {};
			setFullName(fullName ?? "");
			setPreferredName(preferredName ?? "");
			setIC(IC ?? "");
			setGender(gender ?? "");
			setDOB(DOB ? new Date(DOB) : null);
			setPhoneNo(phoneNo ?? "");
			setAddress(address ?? "");
			setIsDifferentAddress(isDifferentAddress ?? false);
			setDeliveryAddress(deliveryAddress ?? "");
		}
	}, [userData]);

	const getAge = () => {
		var today = new Date();
		var birthDate = DOB;
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const checkValidity = () => {
		let validity = {
			fullName: { valid: false, errorMsg: "" },
			preferredName: { valid: false, errorMsg: "" },
			IC: { valid: false, errorMsg: "" },
			gender: { valid: false, errorMsg: "" },
			DOB: { valid: false, errorMsg: "" },
			phoneNo: { valid: false, errorMsg: "" },
			address: { valid: false, errorMsg: "" },
			deliveryAddress: { valid: false, errorMsg: "" },
		};
		const regexPattern = {
			fullName: /^([A-Za-z]{1,20})( [A-Za-z]{1,20}){1,}$/,
			preferredName: /^([A-Za-z]{1,20})( [A-Za-z]{1,20}){0,1}$/,
			IC: /^\d{2}-\d{6}$/,
			gender: /^(Male)|(Female)$/,
			phoneNo: /^\d{3} \d{4}$/,
			address: /.{10,}/s,
		};

		console.log(phoneNo);
		if (regexPattern.fullName.test(fullName)) {
			validity.fullName.valid = true;
		} else {
			validity.fullName.errorMsg = "Invalid full name";
		}
		if (regexPattern.preferredName.test(preferredName)) {
			validity.preferredName.valid = true;
		} else {
			validity.preferredName.errorMsg = "Invalid nickname";
		}
		if (regexPattern.IC.test(IC)) {
			validity.IC.valid = true;
		} else {
			validity.IC.errorMsg = "Invalid IC";
		}
		if (regexPattern.gender.test(gender)) {
			validity.gender.valid = true;
		} else {
			validity.gender.errorMsg = "Invalid gender";
		}
		if (DOB) {
			const age = getAge();
			if (age < 18) {
				validity.DOB.errorMsg = "Needs to be 18 years old or above";
			} else if (age >= 100) {
				validity.DOB.errorMsg = "You belong in the museum 🧓";
			} else {
				validity.DOB.valid = true;
			}
		} else {
			validity.DOB.errorMsg = "Invalid date";
		}
		if (!phoneNo || regexPattern.phoneNo.test(phoneNo)) {
			validity.phoneNo.valid = true;
		} else {
			validity.phoneNo.errorMsg = "Invalid phone number";
		}
		if (regexPattern.address.test(address)) {
			validity.address.valid = true;
		} else {
			validity.address.errorMsg = "Invalid address";
		}
		if (!isDifferentAddress || regexPattern.address.test(deliveryAddress)) {
			validity.deliveryAddress.valid = true;
		} else {
			validity.deliveryAddress.errorMsg = "Invalid address";
		}

		const isValid = Object.values(validity).every((v) => v.valid === true);

		setValidity(validity);
		setValid(isValid);

		return { isValid, validity };
	};

	return (
		<Box
			{...props}
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			display="flex"
			sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover", backgroundColor: "grey", pb: "4em" }}
		>
			<Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
				<Box
					bgcolor="#FFFFFF"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					borderRadius={4}
					overflow="hidden"
					my={4}
					width="100%"
					className={styles.dropShadow}
				>
					<Box px={8} py={4} display="flex" flexDirection="column" width="100%">
						<Typography
							textAlign="center"
							sx={{ textTransform: "uppercase", fontSize: "1.8rem", letterSpacing: "0.22em", color: "secondary.main", fontWeight: 800, lineHeight: "1em" }}
						>
							Complete The Form Below
						</Typography>
						<Typography
							textAlign="center"
							sx={{ textTransform: "uppercase", fontSize: "1.8rem", color: "secondary.main", letterSpacing: "0.22em", fontWeight: 800, mb: "1.2em" }}
						>
							To Continue:
						</Typography>
						<Grid container spacing={"1em"}>
							<Grid item md={12}>
								<TextField
									label="Full Name (based on IC)"
									type="text"
									onChange={(e) => {
										setFullName(e.target.value);
										if (validity && !validity.fullName.valid) {
											setValidity({ ...validity, fullName: { valid: true } });
										}
									}}
									value={fullName}
									InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2 }}
									variant="filled"
									color="secondary"
									margin="dense"
									required
									error={validity ? !validity.fullName.valid : false}
									helperText={validity && !validity.fullName.valid ? validity.fullName.errorMsg : null}
								/>
							</Grid>
							<Grid item md={4}>
								<TextField
									label="Preferred Name (Nickname)"
									type="text"
									onChange={(e) => {
										setPreferredName(e.target.value);
										if (validity && !validity.preferredName.valid) {
											setValidity({ ...validity, preferredName: { valid: true } });
										}
									}}
									value={preferredName}
									inputProps={{ maxLength: 15 }}
									InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2 }}
									variant="filled"
									color="secondary"
									margin="dense"
									required
									error={validity ? !validity.preferredName.valid : false}
									helperText={validity && !validity.preferredName.valid ? validity.preferredName.errorMsg : null}
								/>
							</Grid>
							<Grid item md={4}>
								<TextField
									label="IC Number"
									type="text"
									InputProps={{
										disableUnderline: true,
										sx: { bgcolor: "offWhite.secondary", borderRadius: 2 },
										inputComponent: TextMaskIC,
										onChange: (_IC) => {
											setIC(_IC);
											if (validity && !validity.IC.valid) {
												setValidity({ ...validity, IC: { valid: true } });
											}
										},
										value: IC,
									}}
									required
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2 }}
									variant="filled"
									color="secondary"
									margin="dense"
									error={validity ? !validity.IC.valid : false}
									helperText={validity && !validity.IC.valid ? validity.IC.errorMsg : null}
								/>
							</Grid>
							<Grid item md={4}>
								<TextField
									label="Gender"
									type="text"
									InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2 }}
									variant="filled"
									color="secondary"
									margin="dense"
									onChange={(e) => {
										setGender(e.target.value);
										if (validity && !validity.gender.valid) {
											setValidity({ ...validity, gender: { valid: true } });
										}
									}}
									value={gender}
									select
									required
									error={validity ? !validity.gender.valid : false}
									helperText={validity && !validity.gender.valid ? validity.gender.errorMsg : null}
								>
									<MenuItem value="Male">Male</MenuItem>
									<MenuItem value="Female">Female</MenuItem>
								</TextField>
							</Grid>
							<Grid item md={6}>
								<LocalizationProvider dateAdapter={AdapterDateFns} sx>
									<DatePicker
										label="Date Of Birth"
										value={DOB}
										onChange={(_DOB) => {
											setDOB(_DOB);
											if (validity && !validity.DOB.valid) {
												setValidity({ ...validity, DOB: { valid: true } });
											}
										}}
										inputFormat="dd/MM/yyyy"
										InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
										renderInput={(params) => (
											<TextField
												{...params}
												InputLabelProps={{ sx: { color: "text.secondary" } }}
												fullWidth
												sx={{ borderRadius: 2 }}
												variant="filled"
												color="secondary"
												margin="dense"
												required
												error={validity ? !validity.DOB.valid : false}
												helperText={validity && !validity.DOB.valid ? validity.DOB.errorMsg : null}
											/>
										)}
										OpenPickerButtonProps={{ sx: { mr: 0 } }}
									/>
								</LocalizationProvider>
							</Grid>
							<Grid item md={6}>
								<TextField
									label="Phone Number"
									type="phone"
									InputProps={{
										disableUnderline: true,
										sx: { bgcolor: "offWhite.secondary", borderRadius: 2 },
										inputComponent: TextMaskPhone,
										onChange: (_phoneNo) => {
											setPhoneNo(_phoneNo);
											if (validity && !validity.phoneNo.valid) {
												setValidity({ ...validity, phoneNo: { valid: true } });
											}
										},
										value: phoneNo,
										startAdornment: <InputAdornment position="start">+673 </InputAdornment>,
									}}
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2 }}
									variant="filled"
									color="secondary"
									margin="dense"
									error={validity ? !validity.phoneNo.valid : false}
									helperText={validity && !validity.phoneNo.valid ? validity.phoneNo.errorMsg : null}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									label="Address (based on IC)"
									type="text"
									onChange={(e) => {
										setAddress(e.target.value);
										if (validity && !validity.address.valid) {
											setValidity({ ...validity, address: { valid: true } });
										}
									}}
									value={address}
									InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2 }}
									variant="filled"
									color="secondary"
									margin="dense"
									required
									multiline
									minRows={3}
									error={validity ? !validity.address.valid : false}
									helperText={validity && !validity.address.valid ? validity.address.errorMsg : null}
								/>
							</Grid>
							<Grid item md={12}>
								<Box display="flex" alignItems="center">
									<Checkbox checked={isDifferentAddress} onChange={(e) => setIsDifferentAddress(e.target.checked)} />
									<Typography variant="body2" sx={{ color: "text.main" }}>
										Delivery address different from IC?
									</Typography>
								</Box>
								<TextField
									disabled={!isDifferentAddress}
									label="Delivery Address"
									type="text"
									onChange={(e) => {
										setDeliveryAddress(e.target.value);
										if (validity && !validity.deliveryAddress.valid) {
											setValidity({ ...validity, deliveryAddress: { valid: true } });
										}
									}}
									value={deliveryAddress}
									InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
									InputLabelProps={{ sx: { color: "text.secondary" } }}
									fullWidth
									sx={{ borderRadius: 2, opacity: isDifferentAddress ? 1 : 0.2 }}
									variant="filled"
									color="secondary"
									margin="none"
									multiline
									minRows={3}
									error={validity ? !validity.deliveryAddress.valid : false}
									helperText={validity && !validity.deliveryAddress.valid ? validity.deliveryAddress.errorMsg : null}
								/>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Box width="100%" display="flex" justifyContent="space-between">
					<Link2 href="/home" prefetch={false}>
						<Button
							disabled={isUploading}
							variant="contained"
							color="secondary"
							size="large"
							sx={{ color: "#FFFFFF", width: "12em" }}
							startIcon={<ArrowBack />}
							className={styles.dropShadow}
						>
							Home
						</Button>
					</Link2>
					<Button
						disabled={isUploading || (validity && !Object.values(validity).every((v) => v.valid === true))}
						variant="contained"
						color="secondary"
						size="large"
						sx={{ color: "#FFFFFF", width: "12em" }}
						endIcon={<ArrowForward />}
						onClick={async () => {
							const { isValid } = checkValidity();
							if (isValid) {
								setIsUploading(true);
								await toast.promise(
									functions
										.httpsCallable("setUserDetails")({
											fullName,
											preferredName,
											IC,
											gender,
											DOB: DOB.toLocaleDateString(),
											phoneNo,
											address,
											isDifferentAddress,
											deliveryAddress,
											userVerifiedLevel: 1,
										})
										.then(({ data }) => {
											console.log(data);
											if (!data.success) throw "Error in backend";
											router.push("/auth/register/upload-ic");
										}),
									{ loading: "updating user...", success: "user updated 👌", error: "error updating user 😫" }
								);
								setIsUploading(false);
							} else {
								toast.error("Please clear out the errors 😫");
							}
						}}
						className={styles.dropShadow}
					>
						Continue
					</Button>
				</Box>
			</Container>
		</Box>
	);
}

const TextMaskIC = forwardRef((props, ref) => {
	const { onChange, ...other } = props;
	return (
		<IMaskInput
			{...other}
			mask="00-000000"
			definitions={{
				"#": /[1-9]/,
			}}
			inputRef={ref}
			onAccept={onChange}
			overwrite
		/>
	);
});

TextMaskIC.displayName = "TextMaskIC";

const TextMaskPhone = forwardRef((props, ref) => {
	const { onChange, ...other } = props;
	return <IMaskInput {...other} onAccept={onChange} mask="000 0000" inputRef={ref} />;
});

TextMaskPhone.displayName = "TextMaskPhone";
