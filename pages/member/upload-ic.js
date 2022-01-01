import { CloseRounded, HomeRounded, UploadFileRounded } from "@mui/icons-material";
import { Typography, Box, Container, Button, Grid, Checkbox, FormHelperText, ButtonBase, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import Link2 from "next/link";
import toast from "react-hot-toast";
import { auth, firestore, storage } from "lib/firebase";
import { selectUserData, setUserData } from "lib/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";

export default function UploadIC(params) {
	const [isUploadingLater, setIsUploadingLater] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [isUploading, setIsUploading] = useState(false);
	const [frontImage, setFrontImage] = useState(null);
	const [backImage, setBackImage] = useState(null);
	const [isValid, setIsValid] = useState(true);
	const userData = useSelector(selectUserData);
	const dispatch = useDispatch();

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

	return (
		<Box>
			<Box
				minHeight="100vh"
				alignItems="center"
				justifyContent="center"
				display="flex"
				sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover", backgroundColor: "grey" }}
			>
				<Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mb: 4 }}>
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
						sx={{ boxShadow: (theme) => theme.shadows[1] }}
					>
						<Box sx={{ px: { xs: 2, sm: 4, md: 8 } }} py={4} display="flex" flexDirection="column" width="100%">
							<Typography
								textAlign="center"
								sx={{
									textTransform: "uppercase",
									fontSize: { xs: "1em", sm: "1.3rem", md: "1.8rem" },
									letterSpacing: { xs: "0.1em", sm: "0.2em", md: "0.3em" },
									color: "secondary.main",
									fontWeight: 800,
									lineHeight: "1.25em",
									whiteSpace: "pre-wrap",
									mb: 4,
								}}
							>
								{`Upload Your Front & Back IC To Get Full Access`}
							</Typography>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<FilePreview
										label="FILE #1"
										file={selectedFiles[0]}
										image={frontImage}
										isUploadingLater={isUploadingLater}
										onChange={(e) => {
											const _files = e.currentTarget.files;
											let _isValid = true;
											if (!_files.length) return;
											if (_files.length > 1) {
												_isValid = false;
												toast.error("Please send 1 file only");
											} else {
												let isValidSize = true;
												let isValidType = true;
												for (var i = 0; i < _files.length; i++) {
													if (_files[i].size > 5 * 1024 * 1024) isValidSize = false;
													if (!["image/jpeg", "image/png", "application/pdf"].includes(_files[i].type)) isValidType = false;
												}
												if (!isValidType) {
													_isValid = false;
													toast.error("Upload jpg, png or pdf files only");
												}
												if (!isValidSize) {
													_isValid = false;
													toast.error("File exceed 5MB. Please compress before uploading the file.");
												}
												if (_isValid) {
													let newFiles = [...selectedFiles];
													newFiles[0] = _files[0];
													setSelectedFiles(newFiles);
													let readers = [];
													// Store promises in array
													readFileAsText(newFiles[0]).then((value) => {
														setFrontImage(value);
													});
													toast.success("File Ready to Upload 😎");
												} else {
													setSelectedFiles([]);
												}

												setIsValid(_isValid);
											}
										}}
										onRemove={() => {
											setFrontImage(null);
											let newFiles = [...selectedFiles];
											newFiles[0] = null;
											setSelectedFiles(newFiles);
										}}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<FilePreview
										label="FILE #2"
										file={selectedFiles[1]}
										image={backImage}
										isUploadingLater={isUploadingLater}
										onChange={(e) => {
											const _files = e.currentTarget.files;
											let _isValid = true;
											if (!_files.length) return;
											if (_files.length > 1) {
												_isValid = false;
												toast.error("Please send 1 file only");
											} else {
												let isValidSize = true;
												let isValidType = true;
												for (var i = 0; i < _files.length; i++) {
													if (_files[i].size > 5 * 1024 * 1024) isValidSize = false;
													if (!["image/jpeg", "image/png", "application/pdf"].includes(_files[i].type)) isValidType = false;
												}
												if (!isValidType) {
													_isValid = false;
													toast.error("Upload jpg, png or pdf files only");
												}
												if (!isValidSize) {
													_isValid = false;
													toast.error("File exceed 5MB. Please compress before uploading the file.");
												}
												if (_isValid) {
													let newFiles = [...selectedFiles];
													newFiles[1] = _files[0];
													setSelectedFiles(newFiles);
													let readers = [];
													// Store promises in array
													readFileAsText(newFiles[1]).then((value) => {
														setBackImage(value);
													});
													toast.success("File Ready to Upload 😎");
												} else {
													setSelectedFiles([]);
												}

												setIsValid(_isValid);
											}
										}}
										onRemove={() => {
											setBackImage(null);
											let newFiles = [...selectedFiles];
											newFiles[1] = null;
											setSelectedFiles(newFiles);
										}}
									/>
								</Grid>
								<Grid item md={12}>
									<Typography variant="body2" textAlign="center" mt="1em" mb="2em" sx={{ fontSize: { xs: "0.7rem", sm: "1rem" } }}>
										<b>NOTE:</b> Ensure the scanned image / pdf is clear to read and match with the information you provided during registration.
									</Typography>
								</Grid>
								<Grid item xs={12} md={10}>
									<Button disabled={isUploadingLater} variant="contained" component="label" color="secondaryAccent" fullWidth>
										Load File(s)
										<input
											type="file"
											hidden
											accept="image/jpeg,image/png,application/pdf"
											onChange={(e) => {
												const _files = e.currentTarget.files;
												let _isValid = true;
												if (!_files.length) return;
												if (_files.length > 2) {
													_isValid = false;
													toast.error("Please send 1 or 2 files only");
												} else {
													let isValidSize = true;
													let isValidType = true;
													for (var i = 0; i < _files.length; i++) {
														if (_files[i].size > 5 * 1024 * 1024) isValidSize = false;
														if (!["image/jpeg", "image/png", "application/pdf"].includes(_files[i].type)) isValidType = false;
													}
													if (!isValidType) {
														_isValid = false;
														toast.error("Upload jpg, png or pdf files only");
													}
													if (!isValidSize) {
														_isValid = false;
														toast.error("File(s) exceed 5MB. Please compress before uploading the file(s).");
													}
													if (_isValid) {
														setSelectedFiles(_files);
														let readers = [];
														// Store promises in array
														for (let i = 0; i < _files.length; i++) {
															readers.push(readFileAsText(_files[i]));
														}
														Promise.all(readers).then((values) => {
															setFrontImage(values[0]);
															if (values[1]) setBackImage(values[1]);
														});
														toast.success("Ready to send 😎");
													} else {
														setSelectedFiles([]);
													}

													setIsValid(_isValid);
												}
											}}
											multiple
										/>
									</Button>
									<FormHelperText error={!isValid} sx={{ fontSize: { xs: "0.5rem", sm: "0.7rem" } }}>
										jpg, png & pdf files only <b>(max 2 files & 5MB limit each)</b>
									</FormHelperText>
								</Grid>
								<Grid item xs={12} md={2} justifyContent={"flex-end"} display="flex" alignItems={"center"}>
									<Checkbox checked={isUploadingLater} onChange={(e) => setIsUploadingLater(e.target.checked)} />
									<Typography variant="body2" sx={{ color: "text.main" }}>
										Upload later
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Box>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Link2 href="/dashboard" prefetch={false}>
								<Button fullWidth variant="contained" color="secondary" size="large" startIcon={<HomeRounded />}>
									Home
								</Button>
							</Link2>
						</Grid>
						<Grid item xs={6} display={"flex"} justifyContent={"flex-end"}>
							<Button
								disabled={isUploading || (!isUploadingLater && (!selectedFiles.length || !selectedFiles.some((file) => file)))}
								fullWidth
								variant="contained"
								color="secondary"
								size="large"
								endIcon={<UploadFileRounded />}
								onClick={async () => {
									if (isUploadingLater) {
										const updateDetails = { "verified.IC": "uploadingLater", userVerifiedLevel: 1.5 };
										await toast.promise(
											firestore
												.collection("users")
												.doc(auth.currentUser.uid)
												.update(updateDetails)
												.then(() => {
													dispatch(setUserData({ ...userData, ...updateDetails }));
												}),
											{ loading: "updating user...", success: "user updated 👌", error: "error updating user 😫" }
										);
									} else {
										if (selectedFiles?.length > 0) {
											setIsUploading(true);
											const filteredFile = selectedFiles.filter((file) => file);
											let batchPromises = [];
											for (var i = 0; i < filteredFile.length; i++) {
												const storageRef = storage.ref(`users/${auth.currentUser.uid}/unverifiedIC/${new Date().getTime()}${i}`);
												batchPromises.push(storageRef.put(filteredFile[i]));
											}
											const updateDetails = { "verified.IC": "pending", userVerifiedLevel: 1.5 };
											const result = await toast.promise(
												Promise.all(batchPromises).then(() => {
													firestore
														.collection("users")
														.doc(auth.currentUser.uid)
														.update(updateDetails)
														.then(() => {
															dispatch(setUserData({ ...userData, ...updateDetails }));
														});
												}),
												{ loading: "Uploading file(s) 📦", success: "File(s) uploaded 👌", error: "Error uploading file(s) 😲" }
											);
											setIsUploading(false);
											return result;
										}
									}
								}}
							>
								{isUploadingLater ? "Continue" : "Upload"}
							</Button>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</Box>
	);
}

function FilePreview(props) {
	const { file, image, label, isUploadingLater } = props || {};
	const inputRef = useRef(null);
	return (
		<ButtonBase
			sx={{ width: "100%", height: "100%" }}
			onClick={(e) => {
				e.stopPropagation();
				inputRef.current.click();
			}}
		>
			<input ref={inputRef} type="file" hidden accept="image/jpeg,image/png,application/pdf" onChange={props.onChange} />
			<Box
				width="100%"
				height="100%"
				minHeight={"12em"}
				border="1px dashed"
				borderColor="secondaryAccent.main"
				display="flex"
				justifyContent={"center"}
				alignItems={"center"}
				borderRadius={1}
				position="relative"
				sx={{ zIndex: 0 }}
			>
				{file && ["image/jpeg", "image/png"].includes(file.type) && (
					<Box
						sx={{
							zIndex: -1,
							width: "100%",
							height: "100%",
							position: "absolute",
							opacity: isUploadingLater ? 0.4 : 1,
							background: image ? `url(${image})` : "unset",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
							backgroundSize: "contain",
						}}
					/>
				)}
				{file && ["application/pdf"].includes(file.type) && (
					<embed src={URL.createObjectURL(file)} width="100%" height="100%" style={{ position: "absolute", zIndex: -1 }} />
				)}
				{file && (
					<IconButton
						sx={{ position: "absolute", top: "5px", right: "5px", zIndex: 100 }}
						onClick={(e) => {
							e.stopPropagation();
							props.onRemove();
						}}
					>
						<CloseRounded />
					</IconButton>
				)}
				<Typography sx={{ bgcolor: "secondary.main", p: 1, color: "white.main", opacity: 0.8, fontSize: "0.7rem" }} textAlign="center">
					{file ? file.name : label}
				</Typography>
			</Box>
		</ButtonBase>
	);
}
