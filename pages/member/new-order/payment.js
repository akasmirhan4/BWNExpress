import {
	Box,
	Container,
	Typography,
	Button,
	Grid,
	Breadcrumbs,
	Link,
	TextField,
	FormHelperText,
	Tooltip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import toast from "react-hot-toast";
import NumberFormat from "react-number-format";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import NewOrderSteppers from "components/NewOrderSteppers";
import { selectUserData } from "lib/slices/userSlice";

export default function Payment() {
	const router = useRouter();
	const userData = useSelector(selectUserData);

	const [errors, setErrors] = useState({
		paymentMethod: [],
	});

	const [paymentMethod, setPaymentMethod] = useState("");
	const [bankTransfer, setBankTransfer] = useState(null);
	const [bankTransferMetadata, setBankTransferMetadata] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setPaymentMethod("");
	};

	useEffect(() => {
		if (userData) {
			setPaymentMethod(window.sessionStorage.getItem("paymentMethod") ?? "");
			setPaymentMethod(window.sessionStorage.getItem("paymentMethod") ?? "");
			setLoaded(true);
		}
	}, [userData]);

	useEffect(() => {
		if (!loaded) return;
		let data = {
			paymentMethod,
		};
		Object.entries(data).forEach(([key, value]) => {
			window.sessionStorage.setItem(key, value);
		});
	}, [paymentMethod]);

	useEffect(() => {
		if (window.sessionStorage.getItem("isAcknowledged") != "true") {
			toast("Redirecting...");
			router.push("acknowledgement");
		} else if (!window.sessionStorage.getItem("weightRange")) {
			toast("Redirecting...");
			router.push("form");
		}
	}, []);

	const paymentMethods = ["Bank Transfer", "Cash Payment", "Select Soon"];

	function validateInputs() {
		let _errors = {
			paymentMethod: [],
			bankTransfer: [],
		};
		if (!paymentMethods.includes(paymentMethod)) {
			_errors.paymentMethod.push("Unknown method");
		} else if (paymentMethod == "Bank Transfer") {
			if (!bankTransfer) _errors.paymentMethod.push("This is required");
		}
		const nErrors = !!Object.values(_errors).reduce((a, v) => a + v.length, 0);
		if (!!nErrors) {
			toast.error("Please remove the errors to continue");
		}
		setErrors(_errors);
		return { errors: _errors, nErrors };
	}

	return (
		<MemberPageTemplate hideFAB>
			<Container sx={{ pt: 4 }}>
				<Box display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{ mb: 4 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="/member/dashboard" passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<Typography color="text.primary">New Order</Typography>
					</Breadcrumbs>
				</Box>
				<NewOrderSteppers sx={{ my: 4 }} activestep={3} />
				{/* ORDER FORM */}
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: 2, boxShadow: (theme) => theme.shadows[1] }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
				>
					<Grid container columnSpacing={4} rowSpacing={2}>
						<Grid item xs={12} md={6} display="flex" justifyContent={"flex-end"}>
							<Tooltip
								disableHoverListener
								title={"You may opt for payment soon; we can process everything before your payment"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<FormControl fullWidth sx={{ mt: { xs: 0, sm: 1 } }}>
									<InputLabel error={!!errors.paymentMethod.length}>Payment Method</InputLabel>
									<Select
										value={paymentMethod}
										label="Payment Method"
										onChange={(e) => {
											setPaymentMethod(e.target.value);
											if (errors.paymentMethod.length) {
												setErrors({ ...errors, paymentMethod: [] });
											}
										}}
										margin="dense"
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										required
										error={!!errors.paymentMethod.length}
									>
										{paymentMethods.map((method, index) => {
											return (
												<MenuItem value={method} key={index}>
													{method}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
							</Tooltip>
						</Grid>
						<Grid item xs={12} md={6}>
							{paymentMethod == "Bank Transfer" && (
								<Fragment>
									<Tooltip disableHoverListener title={"Accepts only images/pdf with max 5MB size"} placement="top" arrow enterTouchDelay={100}>
										<Button
											variant={!errors.paymentMethod.length ? "contained" : "outlined"}
											color={!errors.paymentMethod.length ? "accent" : "error"}
											sx={{
												color: !errors.paymentMethod.length ? "white.main" : "error.main",
												mt: 1,
											}}
											size="large"
											fullWidth
											component="label"
										>
											upload screenshot of bank transfer
											<input
												type="file"
												hidden
												accept="image/jpeg,image/png,application/pdf"
												onChange={(e) => {
													const { files } = e.currentTarget;
													if (!files.length) {
														toast.error("No file selected");
														return;
													}
													if (files.length > 1) {
														toast.error("Please select 1 files only");
														return;
													}

													if (files[0].size > 5 * 1024 * 1024) {
														toast.error("File(s) exceed 5MB. Please compress before uploading the file(s).");
														return;
													}
													if (!["image/jpeg", "image/png", "application/pdf"].includes(files[0].type)) {
														toast.error("Upload jpg, png or pdf files only");
														return;
													}
													if (errors.paymentMethod.length) {
														setErrors({ ...errors, paymentMethod: [] });
													}
													const reader = new FileReader();
													reader.addEventListener(
														"load",
														function () {
															setBankTransfer(reader.result);
															toast.success("File selected 😎");
															setBankTransferMetadata(JSON.stringify({ name: files[0].name, type: files[0].type }));
														},
														false
													);
													reader.readAsDataURL(files[0]);
												}}
											/>
										</Button>
									</Tooltip>
									<FormHelperText>{bankTransferMetadata && `File selected: ${JSON.parse(bankTransferMetadata).name}`}</FormHelperText>
									<FormHelperText error>{errors.paymentMethod.join(" , ")}</FormHelperText>
								</Fragment>
							)}
						</Grid>
						{paymentMethod == "Bank Transfer" && (
							<Grid item xs={12}>
								<FormHelperText>Please make your payment and send us a screenshot to validate the payment</FormHelperText>
							</Grid>
						)}
						<Grid item xs={12} sm={6} display={"flex"}>
							<NextLink href="/member/new-order/permit" passHref>
								<Button startIcon={<ChevronLeftRounded />} variant="contained" color="accent" sx={{ width: { sm: "unset", xs: "100%" } }}>
									Back
								</Button>
							</NextLink>
							<Button variant="outlined" color="accent" sx={{ width: { sm: "unset", xs: "100%" }, ml: "2em" }} onClick={reset}>
								Reset
							</Button>
						</Grid>
						<Grid item xs={12} sm={6} display={"flex"} justifyContent={"flex-end"}>
							<LoadingButton
								onClick={() => {
									setLoading(true);
									const { nErrors, errors } = validateInputs();
									console.log(errors);
									setLoading(false);
									if (!nErrors) {
										router.push("summary");
									}
								}}
								disabled={!!Object.values(errors).reduce((a, v) => a + v.length, 0)}
								endIcon={<ChevronRightRounded />}
								loading={loading}
								loadingPosition="end"
								variant="contained"
								color="accent"
								sx={{ width: { md: "unset", xs: "100%" } }}
							>
								Continue
							</LoadingButton>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}
