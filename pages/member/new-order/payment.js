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
	TableContainer,
	Table,
	TableBody,
	TableRow,
	TableCell,
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
import { currencyFormatter } from "lib/formatter";
import { CustomSelector } from "components/FormInputs";
import CustomUploadButton from "components/CustomUploadButton";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "lib/firebase";
import { getWeightPrice, paymentMethods } from "lib/formConstant";

export default function Payment() {
	const router = useRouter();
	const userData = useSelector(selectUserData);

	const [errors, setErrors] = useState({
		paymentMethod: [],
		bankTransfers: [],
	});

	const [paymentMethod, setPaymentMethod] = useState("");
	const [bankTransfers, setBankTransfers] = useState([]);
	const [total, setTotal] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [parcelWeight, setParcelWeight] = useState("");
	const [requiresPermit, setRequiresPermit] = useState(false);
	const [deliveryMethod, setDeliveryMethod] = useState("");

	const reset = () => {
		setPaymentMethod("");
		setBankTransfers([]);
	};

	useEffect(() => {
		if (userData) {
			setPaymentMethod(window.sessionStorage.getItem("paymentMethod") ?? "");
			if (window.sessionStorage.getItem("bankTransfers")) {
				setBankTransfers(JSON.parse(window.sessionStorage.getItem("bankTransfers")));
			} else {
				setBankTransfers([]);
			}
			setParcelWeight(window.sessionStorage.getItem("parcelWeight") ?? "");
			setRequiresPermit(window.sessionStorage.getItem("requiresPermit") == "true" ?? false);
			setDeliveryMethod(window.sessionStorage.getItem("deliveryMethod") ?? "");
			setLoaded(true);
		}
	}, [userData]);

	useEffect(() => {
		let total = 0;
		const weightPrice = getWeightPrice(parcelWeight);
		total = total + weightPrice;
		if (requiresPermit) total = total + 10;
		if (deliveryMethod == "Home Delivery") total = total + 10;
		setTotal(total);
		window.sessionStorage.setItem("weightPrice", weightPrice);
		window.sessionStorage.setItem("total", total);
	}, [parcelWeight, requiresPermit, deliveryMethod]);

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
		} else if (!window.sessionStorage.getItem("requiresPermit")) {
			toast("Redirecting...");
			router.push("permit-application");
		} else if (!window.sessionStorage.getItem("parcelWeight")) {
			toast("Redirecting...");
			router.push("form");
		}
	}, []);

	function validateInputs() {
		let _errors = {
			paymentMethod: [],
			bankTransfers: [],
		};
		if (!paymentMethods.includes(paymentMethod)) {
			_errors.paymentMethod.push("Unknown method");
		} else if (paymentMethod == "Bank Transfer") {
			if (!bankTransfers.length) _errors.bankTransfers.push("This is required");
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
							<CustomSelector
								tooltip="You may opt for payment soon. We can process everything before your payment"
								label="Payment Method"
								required
								value={paymentMethod}
								fullWidth
								onChange={(e) => {
									setPaymentMethod(e.target.value);
									if (errors.paymentMethod.length) setErrors({ ...errors, paymentMethod: [] });
									if (errors.bankTransfers.length) setErrors({ ...errors, bankTransfers: [] });
								}}
								errors={errors.paymentMethod}
								items={paymentMethods}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TableContainer>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell component="th">{`Parcel Weight (${parcelWeight} kg): `}</TableCell>
											<TableCell>{currencyFormatter.format(getWeightPrice(parcelWeight))}</TableCell>
										</TableRow>
										{requiresPermit && (
											<TableRow>
												<TableCell component="th">Processing Permit:</TableCell>
												<TableCell>{currencyFormatter.format(10)}</TableCell>
											</TableRow>
										)}
										{deliveryMethod == "Home Delivery" && (
											<TableRow>
												<TableCell component="th">Delivery:</TableCell>
												<TableCell>{currencyFormatter.format(10)}</TableCell>
											</TableRow>
										)}
										<TableRow>
											<TableCell component="th">Total:</TableCell>
											<TableCell>{currencyFormatter.format(total)}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>

						{paymentMethod == "Bank Transfer" && (
							<>
								<Grid item xs={12}>
									<Typography variant="body1" gutterBottom>
										Baiduri Bank Account: {"    "}
										<Link
											style={{ cursor: "cursor", fontWeight: "bold" }}
											onClick={() => {
												toast("Baiduri # Copied to clipboard");
												navigator.clipboard.writeText("0201740329221");
											}}
										>
											0201740329221
										</Link>
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<CustomUploadButton
										tooltip="Accepts only images/pdf with max 5MB size"
										label="upload screenshot of bank transfer"
										accept="image/jpeg,image/png,application/pdf"
										type="bankTransfers"
										maxFile={1}
										value={bankTransfers}
										onChange={(results) => {
											if (errors.bankTransfers.length) setErrors({ ...errors, bankTransfers: [] });
											setBankTransfers(results);
											window.sessionStorage.setItem("bankTransfers", JSON.stringify(results));
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<FormHelperText>Please make your payment and send us a screenshot to validate the payment</FormHelperText>
								</Grid>
							</>
						)}
						<Grid item xs={12} sm={6} display={"flex"}>
							<NextLink href="/member/new-order/permit-application" passHref>
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
								onClick={async () => {
									try {
										setLoading(true);
										const { nErrors } = validateInputs();
										setLoading(false);
										if (!nErrors) {
											setLoading(true);
											const dataToUpdate = {
												paymentMethod,
											};
											const orderID = window.sessionStorage.getItem("orderID");
											if (!orderID) throw "missing order ID";
											await setDoc(doc(firestore, "allOrders", orderID), dataToUpdate, { merge: true });
											await router.push("summary");
											setLoading(false);
										}
									} catch (e) {
										toast.error(e);
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
