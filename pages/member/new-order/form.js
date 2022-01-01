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
	Checkbox,
} from "@mui/material";
import NextLink from "next/link";
import MemberPageTemplate from "components/MemberPageTemplate";
import { forwardRef, Fragment, useEffect, useState } from "react";
import { ChevronLeftRounded, ChevronRightRounded, InfoRounded } from "@mui/icons-material";
import toast from "react-hot-toast";
import NumberFormat from "react-number-format";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { selectData, selectIsAcknowledged, setData } from "lib/slices/newOrderSlice";
import { useRouter } from "next/router";
import NewOrderSteppers from "components/NewOrderSteppers";
import { selectUserData } from "lib/slices/userSlice";

export default function Verification() {
	const dispatch = useDispatch();
	const router = useRouter();
	const newOrderData = useSelector(selectData);
	const userData = useSelector(selectUserData);
	const [purchaseFrom, setPurchaseFrom] = useState("");
	const [itemCategory, setItemCategory] = useState("");
	const [parcelValue, setParcelValue] = useState(null);
	const [currency, setCurrency] = useState("MYR");
	const [itemDescription, setItemDescription] = useState("");
	const [courierProvider, setCourierProvider] = useState("");
	const [specificCourierProvider, setSpecificCourierProvider] = useState("");
	const [trackingNumber, setTrackingNumber] = useState("");
	const [receipt, setReceipt] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [deliveryMethod, setDeliveryMethod] = useState("");
	const [isDifferentAddress, setIsDifferentAddress] = useState(false);
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [remark, setRemark] = useState("");
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
		deliveryMethod: [],
		deliveryAddress: [],
	});
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const isAcknowledged = useSelector(selectIsAcknowledged);

	useEffect(() => {
		if (newOrderData) {
			setPurchaseFrom(newOrderData.purchaseFrom || "");
			setItemCategory(newOrderData.itemCategory || "");
			setParcelValue(newOrderData.parcelValue || null);
			setCurrency(newOrderData.currency || "MYR");
			setCurrency(newOrderData.currency || "MYR");
			setItemDescription(newOrderData.itemDescription || "");
			setCourierProvider(newOrderData.courierProvider || "");
			setSpecificCourierProvider(newOrderData.specificCourierProvider || "");
			setTrackingNumber(newOrderData.trackingNumber || "");
			setReceipt(newOrderData.receipt || null);
			setPaymentMethod(newOrderData.paymentMethod || "");
			setDeliveryMethod(newOrderData.deliveryMethod || "");
			setIsDifferentAddress(newOrderData.isDifferentAddress ?? false);
			setDeliveryAddress(newOrderData.deliveryAddress || "");
			setRemark(newOrderData.remark || "");
		}
		setLoaded(true);
	}, [newOrderData]);
	useEffect(() => {
		if (userData && !newOrderData) {
			setDeliveryAddress(userData.deliveryAddress || userData.address || "missing delivery address");
		}
	}, [userData]);

	useEffect(() => {
		if (!isAcknowledged) {
			toast("Redirecting...");
			router.push("acknowledgement");
		}
		function isTouchScreendevice() {
			return "ontouchstart" in window || navigator.maxTouchPoints;
		}

		if (isTouchScreendevice()) {
			setIsTouchDevice(true);
		}
	}, []);

	useEffect(() => {
		if (isDifferentAddress) {
			setDeliveryAddress("");
		} else if (loaded && userData) {
			if (errors.deliveryAddress.length) {
				setErrors({ ...errors, deliveryAddress: [] });
			}
			setDeliveryAddress(userData.deliveryAddress || userData.address || "missing delivery address");
		}
	}, [isDifferentAddress]);

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
	const couriers = [
		"ABX Express",
		"After5",
		"Airpak Express",
		"ARAMEX",
		"Asiaxpress",
		"City-Link Express",
		"DeliveryLah",
		"DHL Express",
		"DPEX",
		"FEDEX",
		"GD Express",
		"UPS",
		"Ninja Van",
		"Pos Laju",
		"Singpost",
		"J&T",
		"Others",
	];
	const paymentMethods = ["Card Transfer", "Bank Transfer", "Cash Payment", "Select Soon"];
	const deliveryMethods = ["Self-Pickup", "Home Delivery", "Select Soon"];

	function validateInputs() {
		const currencyRegex = /^\d*(\.\d{2})?$/;
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
			deliveryMethod: [],
			deliveryAddress: [],
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
		if (!!deliveryMethod && !deliveryMethods.includes(deliveryMethod)) {
			_errors.deliveryMethod.push("Unknown method");
		}
		if (!!deliveryMethod && deliveryMethod == "Home Delivery" && isDifferentAddress) {
			if (!deliveryAddress) {
				_errors.deliveryAddress.push("This is required");
			} else if (deliveryAddress.length < 10) {
				_errors.deliveryAddress.push("Need more details");
			}
		}
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
				</Box>
				<NewOrderSteppers sx={{ my: 4 }} activeStep={1} />
				{/* ORDER FORM */}
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 }, boxShadow: (theme) => theme.shadows[1] }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
				>
					<Grid container columnSpacing={4} rowSpacing={2}>
						<Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
							<Tooltip disableHoverListener title={"E.g: Lazada, UNIQLO, H&M"} placement="top" arrow enterTouchDelay={100}>
								<TextField
									label="Purchase From"
									fullWidth
									margin="dense"
									sx={{ boxShadow: (theme) => theme.shadows[1] }}
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
						<Grid item xs={12} md={6} display="flex" justifyContent={"flex-end"} order={{ xs: 1, md: 2 }}>
							<Box>
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
						</Grid>
						<Grid item xs={12} md={6} order={{ xs: 3, md: 3 }}>
							<Tooltip
								disableHoverListener
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
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										required
										error={!!errors.itemCategory.length}
									>
										{itemCategories.map((category, index) => (
											<MenuItem value={category} key={index}>
												{category}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.itemCategory.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={4} md={2} order={{ xs: 4, md: 4 }}>
							<Tooltip disableHoverListener title={"Select the currency used to purchase your parcel"} placement="top" arrow enterTouchDelay={100}>
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
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										required
										error={!!errors.currency.length}
									>
										{currencies.map((currency, index) => (
											<MenuItem value={currency} key={index}>
												{currency}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.currency.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={8} md={4} order={{ xs: 5, md: 5 }}>
							<Tooltip disableHoverListener title={"Match the exact amount in your receipt"} placement="top" arrow enterTouchDelay={100}>
								<TextField
									name="numberformat"
									label="Parcel Value"
									fullWidth
									margin="dense"
									sx={{ boxShadow: (theme) => theme.shadows[1] }}
									value={parcelValue}
									onChange={(e) => {
										setParcelValue(e.target.value);
										if (errors.parcelValue.length) {
											setErrors({ ...errors, parcelValue: [] });
										}
									}}
									required
									InputProps={{ inputComponent: NumberFormatCustom, inputMode: "numeric" }}
									error={!!errors.parcelValue.length}
								/>
							</Tooltip>
							<FormHelperText error>{errors.parcelValue.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} order={{ xs: 6, md: 6 }}>
							<Tooltip disableHoverListener title={"Give a brief description of parcel content"} placement="top" arrow enterTouchDelay={100}>
								<TextField
									multiline
									minRows={4}
									label="Item Description"
									fullWidth
									margin="dense"
									sx={{ boxShadow: (theme) => theme.shadows[1], mt: { xs: 2, sm: 0 } }}
									value={itemDescription}
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
						<Grid item xs={12} md={4} order={{ xs: 7, md: 7 }}>
							<Tooltip
								disableHoverListener
								title={"Refer to your parcel receipt for the tracking ID (Not Order number/id). E.g: NLMYA12345678"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<TextField
									label="Tracking ID"
									fullWidth
									margin="dense"
									sx={{ boxShadow: (theme) => theme.shadows[1] }}
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
						<Grid item xs={12} sm={6} md={4} order={{ xs: 8, md: 8 }}>
							<Tooltip disableHoverListener title={"Select the courier to be handling your parcel"} placement="top" arrow enterTouchDelay={100}>
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
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										required
										error={!!errors.courierProvider.length}
									>
										{couriers.map((courier, index) => (
											<MenuItem value={courier} key={index}>
												{courier}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.courierProvider.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} sm={6} md={4} order={{ xs: 9, md: 9 }}>
							{courierProvider == "Others" && (
								<Fragment>
									<Tooltip disableHoverListener title={"Please specify the other courier provider"} placement="top" arrow enterTouchDelay={100}>
										<TextField
											label="Other Courier Provider"
											fullWidth
											margin="dense"
											sx={{ boxShadow: (theme) => theme.shadows[1] }}
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
						<Grid item xs={12} md={6} order={{ xs: 10, md: 10 }}>
							<Tooltip disableHoverListener title={"Accepts only images/pdf with max 5MB size"} placement="top" arrow enterTouchDelay={100}>
								<Button
									variant={!errors.receipt.length ? "contained" : "outlined"}
									color={!errors.receipt.length ? "accent" : "error"}
									sx={{
										color: !errors.receipt.length ? "white.main" : "error.main",
									}}
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
											if (errors.receipt.length) {
												setErrors({ ...errors, receipt: [] });
											}
											setReceipt(files[0]);
											toast.success("File selected 😎");
										}}
									/>
								</Button>
							</Tooltip>
							<FormHelperText sx={{ mb: 2 }}>{receipt && `File selected: ${receipt.name}`}</FormHelperText>
							<FormHelperText error>{errors.receipt.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6} order={{ xs: 11, md: 11 }}>
							<FormHelperText>
								Please ensure the image/pdf capture each items and its price in the package as well as the total price. If you have another parcel, please
								create another form.
							</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6} order={{ xs: 12, md: 12 }}>
							<Tooltip disableHoverListener title={"Specify how you want to pay. You may select soon"} placement="top" arrow enterTouchDelay={100}>
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
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										error={!!errors.paymentMethod.length}
										required
									>
										{paymentMethods.map((method, index) => (
											<MenuItem value={method} key={index}>
												{method}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.paymentMethod.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6} order={{ xs: 13, md: 13 }}>
							<Tooltip
								disableHoverListener
								title={"Specify how you want your parcel to be received. You may select soon"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<FormControl fullWidth sx={{ mt: { xs: 3, sm: 1 } }}>
									<InputLabel>Delivery Method (Optional)</InputLabel>
									<Select
										value={deliveryMethod}
										label="Delivery Method (Optional)"
										onChange={(e) => {
											setDeliveryMethod(e.target.value);
											if (errors.deliveryMethod.length) {
												setErrors({ ...errors, deliveryMethod: [] });
											}
										}}
										margin="dense"
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										error={!!errors.deliveryMethod.length}
										required
									>
										{deliveryMethods.map((method, index) => (
											<MenuItem value={method} key={index}>
												{method}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Tooltip>
							<FormHelperText error>{errors.deliveryMethod.join(" , ")}</FormHelperText>
						</Grid>
						{deliveryMethod == "Home Delivery" && (
							<Grid item xs={12} order={{ xs: 14, md: 14 }}>
								<Box display="flex" alignItems="center">
									<Checkbox checked={isDifferentAddress} onChange={(e) => setIsDifferentAddress(e.target.checked)} />
									<Typography variant="body2" sx={{ color: "text.main" }}>
										Use different delivery address?
									</Typography>
								</Box>
								<Tooltip disableHoverListener title={"Specify your delivery address"} placement="top" arrow enterTouchDelay={100}>
									<TextField
										disabled={!isDifferentAddress}
										label="Delivery Address"
										fullWidth
										margin="dense"
										sx={{ boxShadow: (theme) => theme.shadows[1] }}
										value={deliveryAddress}
										onChange={(e) => {
											setDeliveryAddress(e.target.value);
											if (errors.deliveryAddress.length) {
												setErrors({ ...errors, deliveryAddress: [] });
											}
										}}
										error={!!errors.deliveryAddress.length}
										required
										multiline
										minRows={4}
									/>
								</Tooltip>
								<FormHelperText error>{errors.deliveryAddress.join(" , ")}</FormHelperText>
							</Grid>
						)}
						<Grid item xs={12} order={{ xs: 15, md: 15 }}>
							<Tooltip
								disableHoverListener
								title={"Add remarks for declaration purpose or if theres anything you want to notify us regarding your parcel"}
								placement="top"
								arrow
								enterTouchDelay={100}
							>
								<TextField
									label="Remark"
									multiline
									sx={{ mt: { xs: 2, sm: 0 }, boxShadow: (theme) => theme.shadows[1] }}
									minRows={4}
									fullWidth
									margin="dense"
									value={remark}
									onChange={(e) => setRemark(e.target.value)}
								/>
							</Tooltip>
						</Grid>
						<Grid item xs={6} display={"flex"} order={{ xs: 16, md: 16 }}>
							<NextLink href="acknowledgement" prefetch={false} passHref>
								<Button startIcon={<ChevronLeftRounded />} variant="contained" color="accent" sx={{ width: { md: "unset", xs: "100%" } }}>
									Back
								</Button>
							</NextLink>
						</Grid>
						<Grid item xs={6} display={"flex"} justifyContent={"flex-end"} order={{ xs: 17, md: 17 }}>
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
												deliveryMethod,
												isDifferentAddress,
												deliveryAddress,
												remark,
											})
										);
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

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
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
