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
	IconButton,
} from "@mui/material";
import styles from "styles/main.module.scss";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { ChevronRightRounded, InfoRounded } from "@mui/icons-material";
import toast from "react-hot-toast";
import NumberFormat from "react-number-format";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectData, setData } from "lib/slices/newOrderSlice";
import { useRouter } from "next/router";

export default function Verification() {
	const dispatch = useDispatch();
	const router = useRouter();
	const newOrderData = useSelector(selectData);
	const [purchaseFrom, setPurchaseFrom] = useState(newOrderData ? newOrderData.purchaseFrom ?? "" : "");
	const [itemCategory, setItemCategory] = useState(newOrderData ? newOrderData.itemCategory ?? "" : "");
	const [parcelValue, setParcelValue] = useState(newOrderData ? newOrderData.parcelValue ?? null : null);
	const [currency, setCurrency] = useState(newOrderData ? newOrderData.currency : "MYR");
	const [itemDescription, setItemDescription] = useState(newOrderData ? newOrderData.itemDescription ?? "" : "");
	const [courierProvider, setCourierProvider] = useState(newOrderData ? newOrderData.courierProvider ?? "" : "");
	const [specificCourierProvider, setSpecificCourierProvider] = useState(newOrderData ? newOrderData.specificCourierProvider ?? "" : "");
	const [trackingNumber, setTrackingNumber] = useState(newOrderData ? newOrderData.trackingNumber ?? "" : "");
	const [receipt, setReceipt] = useState(newOrderData ? newOrderData.receipt ?? null : null);
	const [paymentMethod, setPaymentMethod] = useState(newOrderData ? newOrderData.paymentMethod ?? "" : "");
	const [remark, setRemark] = useState(newOrderData ? newOrderData.remark ?? "" : "");
	const [isTouchDevice, setIsTouchDevice] = useState(false);

	const [errors, setErrors] = useState({
		purchaseFrom: [],
		itemCategory: [],
		currency: [],
		parcelValue: [],
		itemDescription: [],
		courierProvider: [],
		specificCourierProvider: [],
		trackingNumber: [],
		receipt: [],
		paymentMethod: [],
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		function isTouchScreendevice() {
			return "ontouchstart" in window || navigator.maxTouchPoints;
		}

		if (isTouchScreendevice()) {
			setIsTouchDevice(true);
		}
	}, []);

	const itemCategories = [
		"Facemasks",
		"Disinfectant spray gun",
		"Clothes",
		"Socks",
		"Pants",
		"Bra",
		"Panty",
		"Shoes",
		"Shoe accessories",
		"Bags",
		"Luggage",
		"Cap",
		"Belt",
		"Scarf",
		"Glove",
		"Glasses",
		"Contact Lens",
		"Watch",
		"Jewelleries",
		"Skincare",
		"Cosmetics",
		"Hair care",
		"Fragrance",
		"Phone accessories",
		"Mobile phone",
		"Computer parts",
		"Car Parts",
		"Car care",
		"Organizers",
		"Daily items",
		"Stationaries",
		"Office supplies",
		"Electronics (Household)",
		"Decoration",
		"Bed sheet",
		"Household items",
		"Toiletries",
		"Camera accessories",
		"Toys or models",
		"Baby items",
		"Baby chair",
		"Furniture",
		"Cleaning items",
		"Music instruments",
		"Fitness gear",
		"Renovation material",
		"Electronic parts",
		"Garden supplies",
		"Machine parts",
		"Camping stuff",
		"Snack",
		"Dried Food",
		"Tea",
		"Coffee",
		"Supplements",
		"Can Drinks",
		"Bicycle",
		"Pet supply",
		"Fishing supply",
		"Hair trimming supply",
		"Games",
		"Kitchenware",
		"Books",
		"Sports Equipment",
		"Medical Use",
	].sort();
	const currencies = ["MYR", "BND", "SGD", "USD"];
	const couriers = ["ABX", "ARAMEX", "GDEX", "Ninja Van", "Pos Laju", "Singpost", "J&T", "Others"];
	const paymentMethods = ["Card Transfer", "Bank Transfer", "Cash Payment", "None"];

	function validateInputs() {
		const currencyRegex = /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{2})?$/;
		let _errors = {
			purchaseFrom: [],
			itemCategory: [],
			currency: [],
			parcelValue: [],
			itemDescription: [],
			courierProvider: [],
			specificCourierProvider: [],
			trackingNumber: [],
			receipt: [],
			paymentMethod: [],
		};

		if (!purchaseFrom) _errors.purchaseFrom.push("This is required");
		if (!itemCategory) _errors.itemCategory.push("This is required");
		if (!currency) _errors.currency.push("This is required");
		if (!parcelValue) {
			_errors.parcelValue.push("This is required");
		} else if (!currencyRegex.test(parcelValue)) {
			_errors.parcelValue.push("Invalid format");
		}
		if (!itemDescription) {
			_errors.itemDescription.push("This is required");
		} else if (itemDescription.length < 10) {
			_errors.itemDescription.push("Need more details");
		}
		if (!courierProvider) _errors.courierProvider.push("This is required");
		if (courierProvider == "Others") {
			if (!specificCourierProvider) _errors.specificCourierProvider.push("This is required");
		}
		if (!trackingNumber) _errors.trackingNumber.push("This is required");

		if (!receipt) _errors.receipt.push("This is required");
		if (!!paymentMethod && !paymentMethods.includes(paymentMethod)) _errors.paymentMethod.push("Unknown method");
		const nErrors = !!Object.values(_errors).reduce((a, v) => a + v.length, 0);
		if (!!nErrors) {
			toast.error("Please remove the errors to continue");
		}
		setErrors(_errors);
		return { errors: _errors, nErrors };
	}

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Box display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{ mb: 4 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="dashboard" prefetch={false} passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<Typography color="text.primary">New Order</Typography>
					</Breadcrumbs>

					{isTouchDevice && (
						<IconButton
							onClick={() => {
								toast("Tap & hold to get more info for each field", {
									icon: "👆",
									style: {
										borderRadius: "10px",
										background: "#333",
										color: "#fff",
									},
								});
							}}
						>
							<InfoRounded />
						</IconButton>
					)}
				</Box>
				{/* ORDER FORM */}
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 } }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
					className={styles.dropShadow}
				>
					<Grid container columnSpacing={4} rowSpacing={2}>
						<Grid item xs={12} md={6}>
							<Tooltip title={"E.g: Lazada, UNIQLO, H&M"} placement="top" arrow enterTouchDelay={100}>
								<TextField
									label="Purchase From"
									fullWidth
									margin="dense"
									className={styles.dropShadow}
									value={purchaseFrom}
									onChange={(e) => {
										setPurchaseFrom(e.target.value);
										if (errors.purchaseFrom.length) {
											setErrors({ ...errors, purchaseFrom: [] });
										}
									}}
									error={!!errors.purchaseFrom.length}
									required
								/>
							</Tooltip>
							<FormHelperText error>{errors.purchaseFrom.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6} />
						<Grid item xs={12} md={6}>
							<Tooltip
								title={"Ensure you declare the correct item category. This will be used to apply for permit"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<FormControl fullWidth sx={{ mt: { xs: 0, sm: 1 } }}>
									<InputLabel error={!!errors.itemCategory.length}>Item Category</InputLabel>
									<Select
										value={itemCategory}
										label="Item Category"
										onChange={(e) => {
											setItemCategory(e.target.value);
											if (errors.itemCategory.length) {
												setErrors({ ...errors, itemCategory: [] });
											}
										}}
										margin="dense"
										className={styles.dropShadow}
										required
										error={!!errors.itemCategory.length}
									>
										{itemCategories.map((category, index) => (
											<MenuItem value={category} key={index} children={category} />
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.itemCategory.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={4} md={2}>
							<Tooltip title={"Select the currency used to purchase your parcel"} placement="top" arrow enterTouchDelay={100}>
								<FormControl fullWidth sx={{ mt: 1 }}>
									<InputLabel error={!!errors.currency.length}>Currency</InputLabel>
									<Select
										value={currency}
										label="Currency"
										onChange={(e) => {
											setCurrency(e.target.value);
											if (errors.currency.length) {
												setErrors({ ...errors, currency: [] });
											}
										}}
										margin="dense"
										className={styles.dropShadow}
										required
										error={!!errors.currency.length}
									>
										{currencies.map((currency, index) => (
											<MenuItem value={currency} key={index} children={currency} />
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.currency.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={8} md={4}>
							<Tooltip title={"Match the exact amount in your receipt"} placement="top" arrow enterTouchDelay={100}>
								<TextField
									name="numberformat"
									label="Parcel Value"
									fullWidth
									margin="dense"
									className={styles.dropShadow}
									value={parcelValue}
									onChange={(e) => {
										setParcelValue(e.target.value);
										if (errors.parcelValue.length) {
											setErrors({ ...errors, parcelValue: [] });
										}
									}}
									required
									InputProps={{ inputComponent: NumberFormatCustom }}
									error={!!errors.parcelValue.length}
								/>
							</Tooltip>
							<FormHelperText error>{errors.parcelValue.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<Tooltip title={"Give a brief description of parcel content"} placement="top" arrow enterTouchDelay={100}>
								<TextField
									multiline
									minRows={4}
									label="Item Description"
									fullWidth
									margin="dense"
									className={styles.dropShadow}
									value={itemDescription}
									sx={{ mt: { xs: 2, sm: 0 } }}
									onChange={(e) => {
										setItemDescription(e.target.value);
										if (errors.itemDescription.length) {
											setErrors({ ...errors, itemDescription: [] });
										}
									}}
									error={!!errors.itemDescription.length}
									required
								/>
							</Tooltip>
							<FormHelperText error>{errors.itemDescription.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Tooltip title={"Select the courier to be handling your parcel"} placement="top" arrow enterTouchDelay={100}>
								<FormControl fullWidth sx={{ mt: { xs: 3, sm: 1 } }}>
									<InputLabel error={!!errors.courierProvider.length}>Courier Provider *</InputLabel>
									<Select
										value={courierProvider}
										label="Courier Provider *"
										onChange={(e) => {
											setCourierProvider(e.target.value);
											if (errors.courierProvider.length) {
												setErrors({ ...errors, courierProvider: [] });
											}
										}}
										margin="dense"
										className={styles.dropShadow}
										required
										error={!!errors.courierProvider.length}
									>
										{couriers.map((courier, index) => (
											<MenuItem value={courier} key={index} children={courier} />
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.courierProvider.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							{courierProvider == "Others" && (
								<Fragment>
									<Tooltip title={"Please specify the other courier provider"} placement="top" arrow enterTouchDelay={100}>
										<TextField
											label="Other Courier Provider"
											fullWidth
											margin="dense"
											className={styles.dropShadow}
											value={specificCourierProvider}
											onChange={(e) => {
												setSpecificCourierProvider(e.target.value);
												if (errors.specificCourierProvider.length) {
													setErrors({ ...errors, specificCourierProvider: [] });
												}
											}}
											error={!!errors.specificCourierProvider.length}
											required
										/>
									</Tooltip>
									<FormHelperText error>{errors.specificCourierProvider.join(" , ")}</FormHelperText>
								</Fragment>
							)}
						</Grid>
						<Grid item xs={12} md={4}>
							<Tooltip
								title={"Refer to your parcel receipt for the tracking number (Not Order number). E.g: NLMYA12345678"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<TextField
									label="Tracking Number"
									fullWidth
									margin="dense"
									className={styles.dropShadow}
									value={trackingNumber}
									onChange={(e) => {
										setTrackingNumber(e.target.value);
										if (errors.trackingNumber.length) {
											setErrors({ ...errors, trackingNumber: [] });
										}
									}}
									error={!!errors.trackingNumber.length}
									required
								/>
							</Tooltip>
							<FormHelperText error>{errors.trackingNumber.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6} mb={2}>
							<Tooltip title={"Accepts only images/pdf with max 5MB size"} placement="top" arrow enterTouchDelay={100}>
								<Button
									variant={!errors.receipt.length ? "contained" : "outlined"}
									color={!errors.receipt.length ? "accent" : "error"}
									sx={{
										color: !errors.receipt.length ? "white.main" : "error.main",
										height: errors.receipt.length || receipt ? "78%" : "105%",
										mt: { xs: 2, sm: 1 },
										fontSize: { xs: "0.8rem", sm: "1rem" },
									}}
									className={styles.dropShadow}
									size="large"
									fullWidth
									component="label"
								>
									upload receipt / invoice *
									<input
										type="file"
										hidden
										accept="image/jpeg,image/png,application/pdf"
										onChange={(e) => {
											const { files } = e.currentTarget;
											if (!files.length) {
												toast.error("Please select a file");
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
											if (errors.receipt.length) {
												setErrors({ ...errors, receipt: [] });
											}
											setReceipt(files[0]);
											toast.success("File selected 😎");
										}}
									/>
								</Button>
							</Tooltip>
							<FormHelperText>{receipt && `File selected: ${receipt.name}`}</FormHelperText>
							<FormHelperText error>{errors.receipt.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6}>
							<Tooltip title={"Specify how you want to pay. You may select soon"} placement="top" arrow enterTouchDelay={100}>
								<FormControl fullWidth sx={{ mt: { xs: 3, sm: 1 } }}>
									<InputLabel>Payment Method (Optional)</InputLabel>
									<Select
										value={paymentMethod}
										label="Payment Method (Optional)"
										onChange={(e) => {
											setPaymentMethod(e.target.value);
											if (errors.paymentMethod.length) {
												setErrors({ ...errors, paymentMethod: [] });
											}
										}}
										margin="dense"
										className={styles.dropShadow}
										error={!!errors.paymentMethod.length}
										required
									>
										{paymentMethods.map((method, index) => (
											<MenuItem value={method} key={index} children={method} />
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.paymentMethod.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
							<Tooltip
								title={"Add remarks for declaration purpose or if theres anything you want to notify us regarding your parcel"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<TextField
									label="Remark"
									multiline
									sx={{ mt: { xs: 2, sm: 0 } }}
									minRows={4}
									fullWidth
									margin="dense"
									className={styles.dropShadow}
									value={remark}
									onChange={(e) => setRemark(e.target.value)}
								/>
							</Tooltip>
						</Grid>
						<Grid item xs={12} md={6}></Grid>
						<Grid item xs={12} md={6} display={"flex"} justifyContent={"flex-end"}>
							<LoadingButton
								onClick={() => {
									setLoading(true);
									const { nErrors } = validateInputs();
									setLoading(false);
									if (!nErrors) {
										dispatch(
											setData({
												purchaseFrom,
												itemCategory,
												currency,
												parcelValue,
												itemDescription,
												courierProvider,
												specificCourierProvider,
												trackingNumber,
												receipt,
												paymentMethod,
												remark,
											})
										);
										router.push("./new-order/summary");
									}
								}}
								disabled={!!Object.values(errors).reduce((a, v) => a + v.length, 0)}
								endIcon={<ChevronRightRounded />}
								loading={loading}
								loadingPosition="end"
								variant="contained"
								color="accent"
								sx={{ color: "white.main", width: { md: "unset", xs: "100%" } }}
								className={styles.dropShadow}
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

const NumberFormatCustom = forwardRef((props, ref) => {
	const { onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={ref}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			thousandsGroupStyle="thousand"
			isNumericString
			decimalSeparator="."
			displayType="input"
			type="text"
			thousandSeparator
			decimalScale={2}
			allowLeadingZeros={false}
		/>
	);
});
