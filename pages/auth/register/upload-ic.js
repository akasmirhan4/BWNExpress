import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Typography, Box, Container, Button, Grid, Checkbox, FormHelperText } from "@mui/material";
import styles from "styles/main.module.scss";
import { useState } from "react";
import Link2 from "next/link";
import toast from "react-hot-toast";
import { auth, firestore, storage } from "lib/firebase";
import { selectUserData, setUserData } from "lib/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";

export default function UploadIC(params) {
	const [isUploadingLater, setIsUploadingLater] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState(null);
	const [isValid, setIsValid] = useState(true);
	const userData = useSelector(selectUserData);
	const dispatch = useDispatch();

	return (
		<Box>
			<Box
				pt={"4em"}
				minHeight="100vh"
				alignItems="center"
				justifyContent="center"
				display="flex"
				sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover", backgroundColor: "grey" }}
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
								Upload Your Front & Back IC
							</Typography>
							<Typography
								textAlign="center"
								sx={{ textTransform: "uppercase", fontSize: "1.8rem", color: "secondary.main", letterSpacing: "0.22em", fontWeight: 800, mb: "1.2em" }}
							>
								To Get Full Access
							</Typography>
							<Grid container spacing={"1em"}>
								<Grid item md={6}>
									<Box
										width="100%"
										height="100%"
										border="1px dashed"
										borderColor="secondaryAccent.main"
										borderRadius={1}
										py={2}
										sx={{ opacity: isUploadingLater ? 0.4 : 1 }}
									>
										<Typography textAlign="center">{selectedFiles && selectedFiles[0] ? selectedFiles[0].name : "..."}</Typography>
									</Box>
								</Grid>
								<Grid item md={6}>
									<Box
										width="100%"
										height="100%"
										border="1px dashed"
										borderColor="secondaryAccent.main"
										borderRadius={1}
										py={2}
										sx={{ opacity: isUploadingLater ? 0.4 : 1 }}
									>
										<Typography textAlign="center">{selectedFiles && selectedFiles[1] ? selectedFiles[1].name : "..."}</Typography>
									</Box>
								</Grid>
								<Grid item md={12}>
									<Typography variant="body2" textAlign="center" mt="1em" mb="2em">
										<b>NOTE:</b> Ensure the scanned image / pdf is clear to read and match with the information you provided in the previous page.
									</Typography>
								</Grid>
								<Grid item md={10}>
									<Button
										disabled={isUploadingLater}
										variant="contained"
										component="label"
										className={styles.dropShadow}
										color="secondaryAccent"
										sx={{ color: "#FFFFFF" }}
										fullWidth
									>
										Upload File(s)
										<input
											type="file"
											hidden
											accept="image/jpeg,image/png,application/pdf"
											onChange={(e) => {
												const _files = e.currentTarget.files;
												let _isValid = true;
												console.log(_files);
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
														toast.success("Ready to send 😎");
													} else {
														setSelectedFiles(null);
													}
													setIsValid(_isValid);
												}
											}}
											multiple
										/>
									</Button>
									<FormHelperText error={!isValid}>
										jpg, png & pdf files only <b>(max 2 files & 5MB limit each)</b>
									</FormHelperText>
								</Grid>
								<Grid item md={2}>
									<Box display="flex" alignItems="center">
										<Checkbox checked={isUploadingLater} onChange={(e) => setIsUploadingLater(e.target.checked)} />
										<Typography variant="body2" sx={{ color: "text.main" }}>
											Upload later
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</Box>
					</Box>
					<Box width="100%" display="flex" justifyContent="space-between">
						<Link2 href="/home" prefetch={false}>
							<Button
								variant="contained"
								className={styles.dropShadow}
								color="secondary"
								size="large"
								sx={{ color: "#FFFFFF", width: "12em" }}
								startIcon={<ArrowBack />}
							>
								Home
							</Button>
						</Link2>
						<Button
							disabled={!isUploadingLater && !selectedFiles}
							variant="contained"
							className={styles.dropShadow}
							color="secondary"
							size="large"
							sx={{ color: "#FFFFFF", width: "12em" }}
							endIcon={<ArrowForward />}
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
								}
								if (selectedFiles) {
									let batchPromises = [];
									for (var i = 0; i < selectedFiles.length; i++) {
										const storageRef = storage.ref(`users/${auth.currentUser.uid}/unverifiedIC/${new Date().getTime()}${i}`);
										batchPromises.push(storageRef.put(selectedFiles[i]));
									}
									const updateDetails = { "verified.IC": "pending", userVerifiedLevel: 1.5 };
									return await toast.promise(
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
								}
							}}
						>
							Continue
						</Button>
					</Box>
				</Container>
			</Box>
		</Box>
	);
}
