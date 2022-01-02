import { Typography, Box, Container, TextField, Button } from "@mui/material";
import LandingTopbar from "components/LandingTopbar";
import { functions, auth } from "lib/firebase";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab";

import { useState } from "react";
import { IMaskInput } from "react-imask";
import { forwardRef } from "react";
import { httpsCallable } from "firebase/functions";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgetPassword(params) {
	return (
		<Box>
			<LandingTopbar bgColorScroll="primary.main" bgcolor="transparent" />
			<ForgetPasswordContainer pt={"4em"} />
		</Box>
	);
}

function ForgetPasswordContainer(props) {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [IC, setIC] = useState("");
	const [ICError, setICError] = useState("");
	const [sent, setSent] = useState(false);

	return (
		<Box
			{...props}
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			display="flex"
			sx={{ background: "url(/svgs/background.svg) no-repeat", backgroundSize: "cover" }}
		>
			<Container disableGutters>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
					<Box
						bgcolor="#FFFFFF"
						display="flex"
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						borderRadius={4}
						overflow="hidden"
						mt={4}
						mb={8}
						sx={{ boxShadow: (theme) => theme.shadows[1] }}
					>
						<Box sx={{ px: { sm: 4, xs: 2 } }} py={4} display="flex" flexDirection="column" width="100%">
							<Typography
								variant="h4"
								sx={{
									textTransform: "uppercase",
									color: "secondary.main",
									fontWeight: 800,
									lineHeight: "1em",
									textAlign: "center",
								}}
							>
								RESET PASSWORD
							</Typography>
							<Typography
								variant="caption"
								sx={{
									my: 2,
									textAlign: "center",
								}}
							>
								Enter your the details below:
							</Typography>
							<TextField
								label="Email"
								type="email"
								InputProps={{ disableUnderline: true, sx: { bgcolor: "offWhite.secondary", borderRadius: 2 } }}
								InputLabelProps={{ sx: { color: "text.secondary" } }}
								fullWidth
								sx={{ maxWidth: 384, borderRadius: 2, mb: 2 }}
								variant="filled"
								color="secondary"
								margin="dense"
								onChange={(e) => {
									setEmail(e.target.value);
									if (emailError) setEmailError("");
								}}
								value={email}
								error={!!emailError}
								helperText={emailError}
								required
							/>
							<TextField
								label="IC Number"
								type="tel"
								InputProps={{
									disableUnderline: true,
									sx: { bgcolor: "offWhite.secondary", borderRadius: 2 },
									inputComponent: TextMaskIC,
									onChange: (_IC) => {
										setIC(_IC);
										if (ICError) setICError("");
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
								error={!!ICError}
								helperText={ICError}
							/>
							<LoadingButton
								variant="contained"
								disabled={!!emailError || !!ICError}
								loading={sent}
								sx={{
									maxWidth: 384,
									borderRadius: 2,
									mt: "2em",
									py: 1.5,
									fontWeight: "800",
									fontSize: "1rem",
								}}
								color="secondary"
								fullWidth
								onClick={async () => {
									const regexIC = /^\d{2}-\d{6}$/;
									const emailRegex =
										/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
									let isValid = true;

									if (!email) {
										isValid = false;
										setEmailError("Please enter your email address");
									} else if (!emailRegex.test(email)) {
										isValid = false;
										setEmailError("Invalid email");
									}
									if (!IC) {
										isValid = false;
										setICError("Please enter your IC");
									} else if (!regexIC.test(IC)) {
										isValid = false;
										setICError("Invalid IC");
									}

									if (isValid) {
										setSent(true);
										const { data } = await httpsCallable(functions, "resetPassword")({ IC, email });
										if (data) await sendPasswordResetEmail(auth, email, { url: `${process.env.NEXT_URL}/auth/login`, handleCodeInApp: true });
										toast("Check your email");
									}
								}}
							>
								Send Email
							</LoadingButton>
						</Box>
						<Box
							bgcolor="primary.main"
							width="100%"
							sx={{ px: { sm: 4, xs: 2 } }}
							pb={4}
							display="flex"
							flexDirection="column"
							alignItems="center"
							borderTop="1px dashed"
							borderColor="secondary.main"
						>
							<Box maxWidth={384} mt={4}>
								<Typography sx={{ color: "white.main", lineHeight: "1.5em", textAlign: "center" }}>
									We will email you a link to reset your password if the IC number is registered with the email.
								</Typography>
							</Box>
						</Box>
					</Box>
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
