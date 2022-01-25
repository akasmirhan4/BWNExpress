import { Container, Typography, Button, Grid, Breadcrumbs, Link, Tooltip } from "@mui/material";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import OTPPhoneDialog from "components/OTPPhoneDialog";
import { useSelector } from "react-redux";
import { selectUserData } from "lib/slices/userSlice";
import { auth, firestore } from "lib/firebase";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";
import { CheckRounded, SendRounded, UploadRounded } from "@mui/icons-material";
import { linkWithCredential, PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { collection, doc, updateDoc } from "firebase/firestore";

export default function Verification() {
	const userData = useSelector(selectUserData);
	const [recaptcha, setRecaptcha] = useState(null);
	const [verificationID, setVerificationID] = useState(null);
	const [isVerifying, setIsVerifying] = useState(false);
	const { verified } = userData || {};
	const [OTPSent, setOTPSent] = useState(false);
	const [openOTPDialog, setOpenOTPDialog] = useState(false);
	const [timer, setTimer] = useState(0);

	const ref = useRef(null);

	useEffect(() => {
		if (!recaptcha) {
			const verifier = new RecaptchaVerifier(
				ref.current,
				{
					size: "invisible",
				},
				auth
			);
			setRecaptcha(verifier);
		}
		return () => {
			if (recaptcha) recaptcha?.clear();
		};
	}, [recaptcha]);

	useEffect(() => {
		let intervalID;
		if (timer > 0) {
			intervalID = setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		} else {
			setOTPSent(false);
		}
		return () => {
			clearInterval(intervalID);
		};
	}, [timer]);

	return (
		<MemberPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
				<NextLink href="/member/dashboard" passHref>
						<Link underline="hover" color="inherit">
							Home
						</Link>
					</NextLink>
					<Typography color="text.primary">Verification Process</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					<Grid item xs={3} md={4}>
						<Typography fontWeight={"bold"}>CATEGORY</Typography>
					</Grid>
					<Grid item xs={5} md={4}>
						<Typography fontWeight={"bold"}>DETAILS</Typography>
					</Grid>
					<Grid item xs={4} />

					<Grid item xs={3} md={4} sx={{ display: "flex", alignItems: "center" }}>
						<Typography>IC</Typography>
					</Grid>
					<Grid item xs={5} md={4} sx={{ display: "flex", alignItems: "center" }}>
						<Typography>{!userData ? "..." : userData.IC}</Typography>
					</Grid>
					<Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
						<Tooltip
							title={verified?.IC == "pending" ? `We will notify you for any update on your IC verification` : ""}
							placement="top"
							arrow
							enterTouchDelay={0}
						>
							<span style={{ width: "100%" }}>
								<NextLink href={"/member/upload-ic"} passHref>
									<LoadingButton
										loading={!userData || verified?.IC == "pending"}
										disabled={verified?.IC == true}
										variant="contained"
										fullWidth
										endIcon={verified?.IC == true ? <CheckRounded /> : verified?.IC == "uploadingLater" ? <UploadRounded /> : null}
									>
										{!userData
											? "..."
											: verified?.IC == "uploadingLater"
											? "upload"
											: verified?.IC == "pending"
											? "verifying..."
											: verified?.IC == true
											? "verified"
											: "verify"}
									</LoadingButton>
								</NextLink>
							</span>
						</Tooltip>
					</Grid>
					<Grid item xs={3} md={4} sx={{ display: "flex", alignItems: "center" }}>
						<Typography>Email</Typography>
					</Grid>
					<Grid item xs={5} md={4} sx={{ display: "flex", alignItems: "center" }}>
						<Typography sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "40vw", overflow: "hidden" }}>
							{!userData ? "..." : userData.email}
						</Typography>
					</Grid>
					<Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
						<Button disabled={!userData || verified?.email} variant="contained" fullWidth endIcon={verified?.email == true ? <CheckRounded /> : null}>
							{!userData ? "Loading..." : verified?.email == true ? "Verified" : "verify"}
						</Button>
					</Grid>
					<Grid item xs={3} md={4} sx={{ display: "flex", alignItems: "center" }}>
						<Typography>Phone # (Optional)</Typography>
					</Grid>
					<Grid item xs={5} md={4} sx={{ display: "flex", alignItems: "center" }}>
						<Typography>{!userData ? "..." : userData.phoneNo}</Typography>
					</Grid>
					<Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
						<LoadingButton
							loading={!userData || isVerifying || !recaptcha}
							ref={ref}
							disabled={verified?.phoneNo || OTPSent}
							variant="contained"
							fullWidth
							endIcon={verified?.phoneNo ? <CheckRounded /> : timer > 0 ? null : <SendRounded />}
							onClick={async () => {
								if (!timer) {
									setIsVerifying(true);
									if (userData?.phoneNo) {
										const phoneNo = "+673 " + userData.phoneNo;
										await new PhoneAuthProvider(auth)
											.verifyPhoneNumber(phoneNo, recaptcha)
											.then((verificationID) => {
												console.log({ verificationID });
												setVerificationID(verificationID);
												toast(`OTP sent to ${phoneNo}`);
												setOpenOTPDialog(true);
												setOTPSent(true);
											})
											.catch((error) => {
												switch (error.code) {
													case "auth/too-many-requests":
														toast.error("You have sent too many requests. Try again later");
														break;
													default:
														toast.error("Error sending SMS");
														console.warn(error);
												}
											});
										setTimer(60);
									} else {
										toast.error("Missing Phone No");
									}
									setIsVerifying(false);
								} else {
									if (OTPSent) {
										setOpenOTPDialog(true);
									}
								}
							}}
						>
							{!userData ? "Loading..." : verified?.phoneNo == true ? "Verified" : isVerifying ? "verifying..." : timer ? timer : "SEND OTP"}
						</LoadingButton>
					</Grid>
				</Grid>
				<OTPPhoneDialog
					open={openOTPDialog}
					onClose={() => setOpenOTPDialog(false)}
					onSubmit={async (OTP) => {
						setIsVerifying(true);
						const phoneCredential = PhoneAuthProvider.credential(verificationID, OTP);
						await linkWithCredential(auth.currentUser, phoneCredential)
							.then(async (usercred) => {
								console.log({ usercred });
								await updateDoc(doc(firestore, "users", auth.currentUser.uid), { "verified.phoneNo": true });
								toast.success("Phone number linked 👍");
							})
							.catch((err) => {
								switch (err.code) {
									case "auth/invalid-verification-code":
										toast.error("Invalid OTP. Please make sure you enter the code correctly");
										break;
									case "auth/account-exists-with-different-credential":
										toast.error(
											"An account already links with the same phone number. Login to such account if you are the owner or change your phone number in the profile settings",
											{ duration: 30000 }
										);
										break;
									default:
										console.warn(err);
										toast.error("Error linking phone number");
										break;
								}
							});
						setIsVerifying(false);
					}}
				/>
			</Container>
		</MemberPageTemplate>
	);
}
