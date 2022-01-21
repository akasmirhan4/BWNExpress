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
	InputAdornment,
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

export default function Form() {
	const router = useRouter();
	const userData = useSelector(selectUserData);
	const [purchaseFrom, setPurchaseFrom] = useState("");
	const [weightPrice, setWeightPrice] = useState("");
	const [parcelWeight, setParcelWeight] = useState("");
	const [itemCategory, setItemCategory] = useState("");
	const [parcelValue, setParcelValue] = useState("");
	const [currency, setCurrency] = useState("MYR");
	const [itemDescription, setItemDescription] = useState("");
	const [courierProvider, setCourierProvider] = useState("");
	const [specificCourierProvider, setSpecificCourierProvider] = useState("");
	const [trackingNumber, setTrackingNumber] = useState("");
	const [receipts, setReceipts] = useState([]);
	const [deliveryMethod, setDeliveryMethod] = useState("");
	const [isDifferentAddress, setIsDifferentAddress] = useState(false);
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [remark, setRemark] = useState("");

	const [errors, setErrors] = useState({
		purchaseFrom: [],
		parcelWeight: [],
		weightPrice: [],
		itemCategory: [],
		currency: [],
		parcelValue: [],
		itemDescription: [],
		courierProvider: [],
		specificCourierProvider: [],
		trackingNumber: [],
		receipts: [],
		deliveryMethod: [],
		deliveryAddress: [],
	});
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setPurchaseFrom("");
		setParcelWeight("");
		setWeightPrice("");
		setParcelValue("");
		setItemCategory("");
		setCurrency("MYR");
		setItemDescription("");
		setCourierProvider("");
		setSpecificCourierProvider("");
		setTrackingNumber("");
		setReceipts([]);
		setDeliveryMethod("Self-Pickup");
		setIsDifferentAddress(false);
		setDeliveryAddress(userData.deliveryAddress || userData.address || "missing delivery address");
		setRemark("");
	};

	useEffect(() => {
		if (userData) {
			setPurchaseFrom(window.sessionStorage.getItem("purchaseFrom") ?? "");
			setParcelWeight(window.sessionStorage.getItem("parcelWeight") ?? "");
			setWeightPrice(window.sessionStorage.getItem("weightPrice") ?? "");
			setItemCategory(window.sessionStorage.getItem("itemCategory") ?? "");
			setParcelValue(window.sessionStorage.getItem("parcelValue") ?? "");
			setCurrency(window.sessionStorage.getItem("currency") ?? "MYR");
			setItemDescription(window.sessionStorage.getItem("itemDescription") ?? "");
			setCourierProvider(window.sessionStorage.getItem("courierProvider") ?? "");
			setSpecificCourierProvider(window.sessionStorage.getItem("specificCourierProvider") ?? "");
			setTrackingNumber(window.sessionStorage.getItem("trackingNumber") ?? "");
			setReceipts(window.sessionStorage.getItem("receipts") ?? []);
			setDeliveryMethod(window.sessionStorage.getItem("deliveryMethod") ?? "");
			setIsDifferentAddress(window.sessionStorage.getItem("isDifferentAddress") ?? false);
			setDeliveryAddress(window.sessionStorage.getItem("deliveryAddress") ?? (userData.deliveryAddress || userData.address || "missing delivery address"));
			setRemark(window.sessionStorage.getItem("remark") ?? "");
			setLoaded(true);
		}
	}, [userData]);

	useEffect(() => {
		if (!loaded) return;
		let data = {
			purchaseFrom,
			itemCategory,
			parcelWeight,
			weightPrice,
			parcelValue,
			currency,
			itemDescription,
			courierProvider,
			specificCourierProvider,
			trackingNumber,
			receipts,
			deliveryMethod,
			isDifferentAddress,
			deliveryAddress,
			remark,
		};
		Object.entries(data).forEach(([key, value]) => {
			window.sessionStorage.setItem(key, value);
		});
	}, [
		purchaseFrom,
		parcelWeight,
		itemCategory,
		parcelValue,
		currency,
		itemDescription,
		courierProvider,
		specificCourierProvider,
		trackingNumber,
		receipts,
		deliveryMethod,
		isDifferentAddress,
		deliveryAddress,
		remark,
		loaded,
	]);

	useEffect(() => {
		if (window.sessionStorage.getItem("isAcknowledged") != "true") {
			toast("Redirecting...");
			router.push("acknowledgement");
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
	const currencies = ["MYR", "BND", "SGD", "USD", "CNY", "JPY"];
	const couriers = [
		"ABX Express",
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
	const deliveryMethods = ["Self-Pickup", "Select Soon"];

	const MOHPharmacies = ["Skincare", "Cosmetics", "Hair care", "Fragrance", "Essential oils", "Medical Use"];
	const MOHFoodSafeties = ["Snack", "Dried Food", "Tea", "Coffee", "Supplements", "Can Drinks"];
	const AITI = ["Electronics (Household)", "Camera accessories", "Computer parts", "Watch", "Phone accessories", "Mobile phone"];
	const internalSecurities = ["Books"];

	useEffect(() => {
		if (itemCategory) {
			if (MOHPharmacies.includes(itemCategory)) {
				window.sessionStorage.setItem("requiresPermit", true);
				window.sessionStorage.setItem(
					"permitCategory",
					"MOH Pharmacy (cosmetics, skincare products, haircare products, nail polish, fragrances and essential oils)"
				);
			} else if (MOHFoodSafeties.includes(itemCategory)) {
				window.sessionStorage.setItem("requiresPermit", true);
				window.sessionStorage.setItem("permitCategory", "MOH Food Safety and Quality Unit (Food products, coffee and other drinks)");
			} else if (internalSecurities.includes(itemCategory)) {
				window.sessionStorage.setItem("requiresPermit", true);
				window.sessionStorage.setItem("permitCategory", "");
			} else {
				window.sessionStorage.setItem("requiresPermit", false);
				window.sessionStorage.setItem("permitCategory", "");
			}
			window.sessionStorage.setItem("permitRemark", "");
			window.sessionStorage.setItem("productInformations", "[]");
		}
	}, [itemCategory]);

	function validateInputs() {
		const currencyRegex = /^\d*(\.\d{2})?$/;
		let _errors = {
			purchaseFrom: [],
			parcelWeight: [],
			itemCategory: [],
			currency: [],
			parcelValue: [],
			itemDescription: [],
			courierProvider: [],
			specificCourierProvider: [],
			trackingNumber: [],
			receipts: [],
			deliveryMethod: [],
		};

		if (!purchaseFrom) _errors.purchaseFrom.push("This is required");
		if (!parcelWeight) _errors.parcelWeight.push("This is required");
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

		if (!receipts.length) _errors.receipts.push("This is required");
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
				<NewOrderSteppers sx={{ my: 4 }} activestep={1} />
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
						<Grid item xs={12} md={6}>
							<CustomTextField
								tooltip={"E.g: Lazada, UNIQLO, H&M"}
								label="Purchase From"
								value={purchaseFrom}
								onChange={(e) => {
									setPurchaseFrom(e.target.value);
									if (errors.purchaseFrom.length) {
										setErrors({ ...errors, purchaseFrom: [] });
									}
								}}
								errors={errors.purchaseFrom}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<CustomTextField
								type="number"
								tooltip={"Ensure you declare the correct parcel weight"}
								label="Parcel Weight"
								value={parcelWeight}
								onChange={(e) => {
									setParcelWeight(e.target.value);
									if (errors.parcelWeight.length) {
										setErrors({ ...errors, parcelWeight: [] });
									}
								}}
								errors={errors.parcelWeight}
								InputProps={{
									inputMode: "decimal",
									endAdornment: <InputAdornment position="end">kg </InputAdornment>,
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<CustomSelector
								tooltip="Ensure you declare the correct item category. This will be used to apply for permit"
								label="Item Category"
								onChange={(e) => {
									setItemCategory(e.target.value);
									if (errors.itemCategory.length) {
										setErrors({ ...errors, itemCategory: [] });
									}
								}}
								value={itemCategory}
								errors={errors.itemCategory}
								items={itemCategories}
							/>
						</Grid>
						<Grid item xs={12} sm={4} md={2}>
							<CustomSelector
								tooltip="Select the currency used to purchase your parcel"
								label="Currency"
								required
								onChange={(e) => {
									setCurrency(e.target.value);
									if (errors.currency.length) {
										setErrors({ ...errors, currency: [] });
									}
								}}
								value={currency}
								errors={errors.currency}
								items={currencies}
							/>
						</Grid>
						<Grid item xs={12} sm={8} md={4}>
						<CustomTextField
								type="number"
								tooltip={"Ensure you declare the correct parcel weight"}
								label="Parcel Weight"
								value={parcelWeight}
								onChange={(e) => {
									setParcelWeight(e.target.value);
									if (errors.parcelWeight.length) {
										setErrors({ ...errors, parcelWeight: [] });
									}
								}}
								errors={errors.parcelWeight}
								InputProps={{
									inputMode: "decimal",
									endAdornment: <InputAdornment position="end">kg </InputAdornment>,
								}}
							/>
							<Tooltip disableHoverListener title={"Match the exact amount in your receipt(s)"} placement="top" arrow enterTouchDelay={100}>
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
									InputProps={{ inputComponent: NumberFormatCustom }}
									error={!!errors.parcelValue.length}
								/>
							</Tooltip>
							<FormHelperText error>{errors.parcelValue.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12}>
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
						<Grid item xs={12} md={4}>
							<Tooltip
								disableHoverListener
								title={"Refer to your parcel receipt(s) for the tracking ID (Not Order number/id). E.g: NLMYA12345678"}
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
						<Grid item xs={12} sm={6} md={4}>
							<CustomSelector
								tooltip="Select the courier to be handling your parcel"
								label="Courier Provider"
								required
								onChange={(e) => {
									setCourierProvider(e.target.value);
									if (errors.courierProvider.length) {
										setErrors({ ...errors, courierProvider: [] });
									}
								}}
								value={courierProvider}
								errors={errors.courierProvider}
								items={couriers}
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
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
						<Grid item xs={12} md={6}>
							<Tooltip disableHoverListener title={"Accepts only images/pdf with max 5MB size"} placement="top" arrow enterTouchDelay={100}>
								<Button
									variant={!errors.receipts.length ? "contained" : "outlined"}
									color={!errors.receipts.length ? "accent" : "error"}
									sx={{
										color: !errors.receipts.length ? "white.main" : "error.main",
									}}
									size="large"
									fullWidth
									component="label"
								>
									upload receipts / invoices / screenshots*
									<input
										type="file"
										hidden
										multiple
										accept="image/jpeg,image/png,application/pdf"
										onChange={async (e) => {
											const { files } = e.currentTarget;
											if (!files.length) {
												toast.error("No file selected");
												return;
											}
											if (files.length > 4) {
												toast.error("Please select max 4 files only");
												return;
											}

											for (let i = 0; i < files.length; i++) {
												if (files[i].size > 5 * 1024 * 1024) {
													toast.error("File(s) exceed 5MB. Please compress before uploading the file(s).");
													return;
												}
												if (!["image/jpeg", "image/png", "application/pdf"].includes(files[i].type)) {
													toast.error("Upload jpg, png or pdf files only");
													return;
												}
											}
											if (errors.receipts.length) {
												setErrors({ ...errors, receipts: [] });
											}

											const getURL = (file) => {
												return new Promise(async (resolve) => {
													const reader = new FileReader();
													reader.addEventListener(
														"load",
														function () {
															resolve({ URL: reader.result, name: file.name, type: file.type });
														},
														false
													);
													reader.readAsDataURL(file);
												});
											};

											let batchPromises = [];
											for (let i = 0; i < files.length; i++) {
												batchPromises.push(getURL(files[i]));
											}
											await Promise.all(batchPromises).then((results) => setReceipts(JSON.stringify(results)));
											toast.success("File(s) selected 😎");
										}}
									/>
								</Button>
							</Tooltip>
							<FormHelperText>
								{receipts?.length > 0 &&
									`File selected: ${JSON.parse(receipts)
										.map(({ name }) => name)
										.join(" , ")}`}
							</FormHelperText>
							<FormHelperText error>{errors.receipts.join(" , ")}</FormHelperText>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormHelperText>
								Please ensure a complete itemized receipt / invoice / screenshot that clearly indicating the price and shipment cost.
							</FormHelperText>
						</Grid>
						{/* <Grid item xs={12} md={6}>
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
						</Grid> */}
						{/* {paymentMethod == "Bank Transfer" && (
							<Grid item xs={12}>
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
						)} */}
						<Grid item xs={12}>
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
									onChange={(e) => {
										setRemark(e.target.value);
									}}
								/>
							</Tooltip>
						</Grid>
						<Grid item xs={12} sm={6} display={"flex"}>
							<NextLink href="/member/new-order/acknowledgement" passHref>
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
										router.push("permit-application");
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
			inputMode="decimal"
			thousandSeparator
			decimalScale={2}
			allowLeadingZeros={false}
		/>
	);
});

function CustomSelector(props) {
	const { tooltip, errors, required, label, onChange, value, items } = props;
	return (
		<Fragment>
			<Tooltip disableHoverListener title={tooltip} placement="top" arrow enterTouchDelay={100}>
				<FormControl fullWidth sx={{ mt: { xs: 3, sm: 1 } }}>
					<InputLabel error={errors.length}>{`${label} ${required ? " *" : ""}`}</InputLabel>
					<Select
						value={value}
						label={`${label} ${required ? " *" : ""}`}
						onChange={onChange}
						margin="dense"
						sx={{ boxShadow: (theme) => theme.shadows[1] }}
						required
						error={errors.length}
					>
						{items.map((item, index) => (
							<MenuItem value={item} key={index}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Tooltip>
			<FormHelperText error>{errors.join(" , ")}</FormHelperText>
		</Fragment>
	);
}

function CustomTextField(props) {
	const { tooltip, errors } = props;
	return (
		<Fragment>
			<Tooltip disableHoverListener title={tooltip} placement="top" arrow enterTouchDelay={100}>
				<TextField {...props} fullWidth margin="dense" sx={{ boxShadow: (theme) => theme.shadows[1] }} error={errors.length} />
			</Tooltip>
			<FormHelperText error>{errors.join(" , ")}</FormHelperText>
		</Fragment>
	);
}
