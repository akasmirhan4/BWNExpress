import React, { Fragment, useEffect, useRef, useState } from "react";
import {
	Avatar,
	Badge,
	Box,
	Button,
	ButtonBase,
	Checkbox,
	Container,
	Grid,
	IconButton,
	InputAdornment,
	MenuItem,
	Skeleton,
	TextField,
	Typography,
} from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData, selectUser, setAvatarURL, selectAvatarURL } from "lib/slices/userSlice";
import toast from "react-hot-toast";
import { EditRounded } from "@mui/icons-material";
import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { DatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { getAvatarURL, storage } from "lib/firebase";

export default function Profile() {
	const userData = useSelector(selectUserData);
	const user = useSelector(selectUser);
	const prevImageURL = useSelector(selectAvatarURL);
	const dpRef = useRef(null);
	const [imageURL, setImageURL] = useState(prevImageURL);
	const [imgFile, setImgFile] = useState(null);
	const dispatch = useDispatch();

	const [validity, setValidity] = useState(null);

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [preferredName, setPreferredName] = useState("");
	const [IC, setIC] = useState("");
	const [gender, setGender] = useState("");
	const [DOB, setDOB] = useState(null);
	const [phoneNo, setPhoneNo] = useState("");
	const [address, setAddress] = useState("");
	const [isDifferentAddress, setIsDifferentAddress] = useState(false);
	const [deliveryAddress, setDeliveryAddress] = useState("");

	const [loaded, setLoaded] = useState(false);
	const [changes, setChanges] = useState([]);
	const [isUpdating, setIsUpdating] = useState(false);

	const loadUserData = () => {
		if (userData) {
			const { fullName, preferredName, IC, gender, DOB, phoneNo, address, isDifferentAddress, deliveryAddress, email } = userData || {};
			setFullName(fullName ?? "");
			setPreferredName(preferredName ?? "");
			setIC(IC ?? "");
			setGender(gender ?? "");
			setDOB(DOB ? new Date(DOB) : null);
			setPhoneNo(phoneNo ?? "");
			setAddress(address ?? "");
			setIsDifferentAddress(isDifferentAddress ?? false);
			setDeliveryAddress(deliveryAddress ?? "");
			setEmail(email ?? "");
			setLoaded(true);
			setImageURL(prevImageURL);
		}
	};

	useEffect(() => {
		loadUserData();
	}, [userData]);

	useEffect(() => {
		if (loaded) setChanges(checkChanges());
	}, [fullName, preferredName, IC, gender, DOB, phoneNo, address, isDifferentAddress, deliveryAddress, loaded, imageURL]);

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
			fullName: /^(\D{1,20})(\s\D{1,20}){1,20}$/,
			preferredName: /^[^0-9 ]{1,10}( [^0-9 ]{1,10})?$/,
			IC: /^\d{2}-\d{6}$/,
			gender: /^(Male)|(Female)$/,
			phoneNo: /^\d{3} \d{4}$/,
			address: /.{10,}/s,
		};

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

		return { isValid, validity };
	};

	const checkChanges = () => {
		if (!userData) return false;
		let allDetails = {
			imageURL,
			fullName,
			preferredName,
			IC,
			gender,
			DOB: DOB?.toLocaleDateString(),
			phoneNo,
			address,
			isDifferentAddress,
			deliveryAddress,
		};

		let changes = [];
		Object.entries(allDetails).forEach(([key, value]) => {
			if (key == "imageURL") {
				if (prevImageURL !== imageURL) changes.push(key);
			} else if (userData[key] !== value) changes.push(key);
		});
		return changes;
	};

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Grid container rowSpacing={1} columnSpacing={2}>
					<Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						{!userData ? (
							<Skeleton variant="circular" sx={{ width: "20vw", height: "20vw", maxWidth: "16em", maxHeight: "16em", fontSize: { xs: "1rem", xs2: "2rem" } }} />
						) : (
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									dpRef.current.click();
								}}
							>
								<input
									ref={dpRef}
									type="file"
									hidden
									accept="image/jpeg,image/png"
									onChange={async (e) => {
										const imgFiles = e.currentTarget.files;
										let isValid = true;
										if (!imgFiles.length) return;
										if (imgFiles.length > 1) {
											isValid = false;
											toast.error("Please send 1 file only");
										} else {
											const imgFile = imgFiles[0];
											if (!["image/jpeg", "image/png"].includes(imgFile.type)) {
												isValid = false;
												toast.error("Upload jpg, png or pdf files only");
											}
											if (imgFile.size > 5 * 1024 * 1024) {
												isValid = false;
												toast.error("File exceed 5MB. Please compress before uploading the file.");
											}
											if (isValid) {
												setImgFile(imgFile);
												setImageURL(await readFileAsText(imgFile));
												toast.success("Image Loaded 😎");
											}
										}
									}}
								/>
								<Badge
									overlap="circular"
									anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
									badgeContent={
										<Box
											sx={{
												width: "1.8em",
												height: "1.8em",
												borderRadius: "50%",
												bgcolor: "white.main",
												boxShadow: (theme) => theme.shadows[1],
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: { xs: "1rem", sm: "2rem" },
											}}
										>
											<EditRounded sx={{ fontSize: { xs: "1rem", sm: "1.6rem" } }} />
										</Box>
									}
								>
									<Avatar
										sx={{
											width: { xs2: "20vw", xs: "30vw" },
											height: { xs2: "20vw", xs: "30vw" },
											maxWidth: "8em",
											maxHeight: "8em",
											bgcolor: "primary.main",
											fontSize: { xs: "1.4rem", xs2: "1.6rem", sm: "2rem" },
											boxShadow: (theme) => theme.shadows[1],
										}}
										src={imageURL}
									>
										{userData?.preferredName[0]}
									</Avatar>
								</Badge>
							</IconButton>
						)}
					</Grid>
					<Grid item xs={12} sm={8} sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: { xs: "center", sm: "flex-start" } }}>
						{!userData ? (
							<Fragment>
								<Skeleton variant="text" height="4em" width="20em" />
								<Skeleton variant="text" height="2em" width="16em" />
							</Fragment>
						) : (
							<Fragment>
								<Typography variant="h4" sx={{ color: "secondaryAccent.main", textAlign: { xs: "center", sm: "left" } }} fontWeight="bold">
									{fullName}
								</Typography>
								<Typography variant="caption" whiteSpace="pre-wrap" sx={{ textAlign: { xs: "center", sm: "left" } }}>
									{`${email}  |  ${phoneNo}`}
								</Typography>
							</Fragment>
						)}
					</Grid>
					<Grid item xs={12}>
						<TextField
							disabled={userData ? userData.verified.IC == true : true}
							label="Full Name (based on IC)"
							type="text"
							value={fullName}
							onChange={(e) => {
								setFullName(e.target.value);
								if (validity && !validity.fullName.valid) {
									setValidity({ ...validity, fullName: { valid: true } });
								}
							}}
							InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
							InputLabelProps={{ sx: { color: "text.secondary" } }}
							fullWidth
							sx={{ borderRadius: 2 }}
							variant="filled"
							color="secondary"
							margin="dense"
							required
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<TextField
							disabled={userData ? userData.verified.IC == true : true}
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
					<Grid item xs={12} md={4}>
						<TextField
							disabled={userData ? userData.verified.IC == true : true}
							label="IC Number"
							type="tel"
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
					<Grid item xs={12} md={4}>
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
					<Grid item xs={12} md={6}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
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
					<Grid item xs={12} md={6}>
						<TextField
							label="Phone Number"
							type="tel"
							InputProps={{
								inputMode: "tel",
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
					<Grid item xs={12}>
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
					<Grid item xs={12}>
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
					<Grid item xs={12} sm={6}>
						<Button
							fullWidth
							color="secondary"
							variant="contained"
							disabled={!changes.length || (validity && !Object.values(validity).every((v) => v.valid === true))}
							onClick={async () => {
								const { isValid } = checkValidity();
								if (isValid) {
									setIsUpdating(true);
									let detailsToUpdate = {};
									let batchPromises = [];
									changes.forEach((change) => {
										switch (change) {
											case "imageURL":
												const storageRef = storage.ref(`users/${user.uid}/profile/avatar`);
												dispatch(setAvatarURL(imageURL));
												batchPromises.push(storageRef.put(imgFile));
												break;
											case "fullName":
												detailsToUpdate[change] = fullName;
												break;
											case "preferredName":
												detailsToUpdate[change] = preferredName;
												break;
											case "IC":
												detailsToUpdate[change] = IC;
												break;
											case "gender":
												detailsToUpdate[change] = gender;
												break;
											case "DOB":
												detailsToUpdate[change] = new Date(DOB).toLocaleDateString();
												break;
											case "phoneNo":
												detailsToUpdate[change] = phoneNo;
												break;
											case "address":
												detailsToUpdate[change] = address;
												break;
											case "isDifferentAddress":
												detailsToUpdate[change] = isDifferentAddress;
												break;
											case "deliveryAddress":
												detailsToUpdate[change] = deliveryAddress;
												break;
											default:
												break;
										}
									});
									if (Object.keys(detailsToUpdate).length !== 0)
										batchPromises.push(firestore.collection("users").doc(auth.currentUser.uid).update(detailsToUpdate));

									const result = await toast.promise(Promise.all(batchPromises), {
										loading: "Profile updated...",
										success: "Profile updated 👌",
										error: "Error profile updated 😲",
									});
									setIsUpdating(false);
									return result;
								} else {
									toast.error("Please clear out the errors 😫");
								}
							}}
						>
							Save
						</Button>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Button fullWidth color="secondary" variant="outlined" onClick={loadUserData}>
							Reset
						</Button>
					</Grid>
				</Grid>
			</Container>
		</MemberPageTemplate>
	);
}

function readFileAsText(file) {
	return new Promise(function (resolve, reject) {
		let fr = new FileReader();

		fr.onload = function () {
			resolve(fr.result);
		};

		fr.onerror = function () {
			reject(fr);
		};

		fr.readAsDataURL(file);
	});
}

const TextMaskIC = forwardRef(function TextMaskIC(props, ref) {
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

const TextMaskPhone = forwardRef(function TextMaskPhone(props, ref) {
	const { onChange, ...other } = props;
	return <IMaskInput {...other} onAccept={onChange} mask="000 0000" inputRef={ref} />;
});
