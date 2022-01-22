import {
	Box,
	Container,
	Typography,
	Button,
	Grid,
	Breadcrumbs,
	Link,
	Checkbox,
	Tooltip,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	TextField,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogActions,
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

export default function PermitApplication() {
	const router = useRouter();
	const userData = useSelector(selectUserData);

	const [requiresPermit, setRequiresPermit] = useState(false);
	const [permitCategory, setPermitCategory] = useState("");
	const [permitRemark, setPermitRemark] = useState("");
	const [productInformations, setProductInformations] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [itemCategory, setitemCategory] = useState("");
	const [permitCategories, setPermitCategories] = useState([
		"MOH Pharmacy (cosmetics, skincare products, haircare products, nail polish, fragrances and essential oils)",
		"MOH Food Safety and Quality Unit (Food products, coffee and other drinks)",
		"Pusat Dakhwah Islamiah (Religious books)",
		"Internal Security (All Books)",
	]);

	const [errors, setErrors] = useState({
		permitCategory: [],
		productInformations: [],
	});
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const reset = () => {
		const itemCategory = window.sessionStorage.getItem("itemCategory");
		setitemCategory(itemCategory);
		if (MOHPharmacies.includes(itemCategory)) {
			setRequiresPermit(window.sessionStorage.getItem("requiresPermit") ?? true);
			setPermitCategories(["MOH Pharmacy (cosmetics, skincare products, haircare products, nail polish, fragrances and essential oils)"]);
			setPermitCategory(
				window.sessionStorage.getItem("permitCategory") ??
					"MOH Pharmacy (cosmetics, skincare products, haircare products, nail polish, fragrances and essential oils)"
			);
		} else if (MOHFoodSafeties.includes(itemCategory)) {
			setRequiresPermit(window.sessionStorage.getItem("requiresPermit") == "true" ?? true);
			setPermitCategory(window.sessionStorage.getItem("permitCategory") ?? "MOH Food Safety and Quality Unit (Food products, coffee and other drinks)");
			setPermitCategories(["MOH Food Safety and Quality Unit (Food products, coffee and other drinks)"]);
		} else if (internalSecurities.includes(itemCategory)) {
			setRequiresPermit(window.sessionStorage.getItem("requiresPermit") == "true" ?? true);
			setPermitCategory(window.sessionStorage.getItem("permitCategory") ?? "");
			setPermitCategories(["Pusat Dakhwah Islamiah (Religious books)", "Internal Security (All Books)"]);
		} else {
			setRequiresPermit(window.sessionStorage.getItem("requiresPermit") == "true" ?? false);
			setPermitCategory(window.sessionStorage.getItem("permitCategory") ?? "");
			setPermitCategories([
				"MOH Pharmacy (cosmetics, skincare products, haircare products, nail polish, fragrances and essential oils)",
				"MOH Food Safety and Quality Unit (Food products, coffee and other drinks)",
				"Pusat Dakhwah Islamiah (Religious books)",
				"Internal Security (All Books)",
			]);
		}
		setPermitRemark(window.sessionStorage.getItem("permitRemark") ?? "");
		setProductInformations(window.sessionStorage.getItem("productInformations") ?? []);
		setLoaded(true);
	};

	const MOHPharmacies = ["Skincare", "Cosmetics", "Hair care", "Fragrance", "Essential oils", "Medical Use"];
	const MOHFoodSafeties = ["Snack", "Dried Food", "Tea", "Coffee", "Supplements", "Can Drinks"];
	const AITI = ["Electronics (Household)", "Camera accessories", "Computer parts", "Watch", "Phone accessories", "Mobile phone"];
	const internalSecurities = ["Books"];

	useEffect(() => {
		if (userData) {
			reset();
		}
	}, [userData]);

	useEffect(() => {
		if (!loaded) return;
		let data = {
			requiresPermit,
			permitCategory,
			permitRemark,
			productInformations,
		};
		Object.entries(data).forEach(([key, value]) => {
			window.sessionStorage.setItem(key, value);
		});
	}, [requiresPermit, permitCategory, permitRemark, productInformations]);

	useEffect(() => {
		if (window.sessionStorage.getItem("isAcknowledged") != "true") {
			toast("Redirecting...");
			router.push("acknowledgement");
		} else if (!window.sessionStorage.getItem("weightRange")) {
			toast("Redirecting...");
			router.push("form");
		}
	}, []);

	function validateInputs() {
		const currencyRegex = /^\d*(\.\d{2})?$/;
		let _errors = {
			permitCategory: [],
			productInformations: [],
		};

		if (requiresPermit) {
			if (!permitCategory) {
				_errors.permitCategory.push("This is required");
			} else if (!permitCategories.includes(permitCategory)) {
				_errors.permitCategory.push("Unknown method");
			}
			
			if (!productInformations.length) _errors.productInformations.push("This is required");
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
			<Dialog open={openDialog}>
				<DialogContent>
					<DialogContentText sx={{ whiteSpace: "pre-line" }}>
						{requiresPermit
							? "If the format is not followed and insufficient information is  provided, permit applications will not be processed and bwnexpress.com will not be responsible for any delays or disapproval."
							: `You are to be aware that the Brunei customs has enforced permits to be applied for all make up, skincare, hair care products, henna products, perfume/fragrances, essential oils, food, supplements and books to be applied regardless of quantity. \n\n Any goods that require any Wi-Fi and Bluetooth connectivity will require an AITI permit which is the responsibility of a member. If required, a fee will be incurred to a member  for bwnexpress.com to apply on behalf. \n\n If such items exists in your package, it will result in delays bringing parcel into Brunei Darussalam.`}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpenDialog(false);
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							setOpenDialog(false);
							router.push("payment");
						}}
					>
						I Understand
					</Button>
				</DialogActions>
			</Dialog>
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
				<NewOrderSteppers sx={{ my: 4 }} activestep={2} />
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
						{permitCategory.startsWith("MOH") && (
							<Grid item xs={12}>
								<Typography variant="subtitle1" color="error.main" sx={{ ml: 1 }}>
									<span style={{ fontWeight: "bold" }}>Please Note: </span>
									{permitCategory == "MOH Pharmacy (cosmetics, skincare products, haircare products, nail polish, fragrances and essential oils)" &&
										"Permits will take between 3 to 5 weeks for MOH approval."}
									{permitCategory == "MOH Food Safety and Quality Unit (Food products, coffee and other drinks)" &&
										"Permits will more than 5 weeks for MOH approval for food items."}
								</Typography>
							</Grid>
						)}
						{itemCategory == "Books" && (
							<Grid item xs={12}>
								<Typography variant="subtitle1" color="error.main" sx={{ ml: 1 }}>
									Select permit category as "Pusat Dakhwah Islamiah" if the product is considered a religious books. Else select "Internal Security".
								</Typography>
							</Grid>
						)}
						<Grid item xs={12} md={6}>
							<Box display="flex" alignItems="center">
								<Checkbox checked={requiresPermit} onChange={(e) => setRequiresPermit(e.target.checked)} />
								<Typography variant="body2" sx={{ color: "text.main" }}>
									Parcel content require permit?
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							{requiresPermit && (
								<Fragment>
									<Tooltip disableHoverListener title={"Select the right permit for your parcel"} placement="top" arrow enterTouchDelay={100}>
										<FormControl fullWidth sx={{ mt: 1 }}>
											<InputLabel error={!!errors.permitCategory.length}>Permit Category *</InputLabel>
											<Select
												value={permitCategory}
												label="Permit Category"
												onChange={(e) => {
													setPermitCategory(e.target.value);
													if (errors.permitCategory.length) {
														setErrors({ ...errors, permitCategory: [] });
													}
												}}
												margin="dense"
												sx={{ boxShadow: (theme) => theme.shadows[1] }}
												required
												error={!!errors.permitCategory.length}
											>
												{permitCategories.map((permit, index) => (
													<MenuItem value={permit} key={index}>
														{permit}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Tooltip>
									<FormHelperText error>{errors.permitCategory.join(" , ")}</FormHelperText>
								</Fragment>
							)}
						</Grid>
						{requiresPermit && (
							<Grid item xs={12}>
								<Typography sx={{ my: 2 }}>
									Permits are applied for all items within one parcel and one invoice. Additional invoices will be additional permits required. A permit
									application if for a maximum of 8 items with the quantity of not more than 4 items per item. Any additional quantity or item will require an
									additional permit application with a separate IC. [TODO: wordy and not very clear]
								</Typography>
							</Grid>
						)}
						{requiresPermit && (
							<Fragment>
								<Grid item xs={12} md={6}>
									<Tooltip title={"Accepts only images/pdf/docs with max 5MB size"} placement="top" arrow enterTouchDelay={100}>
										<Button
											variant={!errors.productInformations.length ? "contained" : "outlined"}
											color={!errors.productInformations.length ? "accent" : "error"}
											sx={{
												color: !errors.productInformations.length ? "white.main" : "error.main",
											}}
											size="large"
											fullWidth
											component="label"
										>
											upload product informations*
											<input
												type="file"
												hidden
												multiple
												accept="image/jpeg,image/png,application/pdf,.doc, .docx,.txt"
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
														
														if (
															![
																"image/jpeg",
																"image/png",
																"application/pdf",
																"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
																"application/msword",
																"text/plain",
															].includes(files[i].type)
														) {
															toast.error("Upload images, pdf files, or word files only");
															return;
														}
													}
													if (errors.productInformations.length) {
														setErrors({ ...errors, productInformations: [] });
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
													await Promise.all(batchPromises).then((results) => setProductInformations(JSON.stringify(results)));
													toast.success("File(s) selected 😎");
												}}
											/>
										</Button>
									</Tooltip>
									<FormHelperText>
										{productInformations?.length > 0 &&
											`File selected: ${JSON.parse(productInformations)
												.map(({ name }) => name)
												.join(" , ")}`}
									</FormHelperText>
									<FormHelperText error>{errors.productInformations.join(" , ")}</FormHelperText>
								</Grid>
								<Grid item xs={12} md={6}>
									<Typography sx={{ mt: 1 }}>
										<span style={{ fontWeight: "bold" }}>Important!</span> Please follow this sample{" "}
										<Link href="https://bwnexpress.com/wp-content/uploads/2021/01/BWN02830.pdf" target="_blank" style={{ fontWeight: "bold" }}>
											here
										</Link>
									</Typography>
								</Grid>
							</Fragment>
						)}

						{requiresPermit && (
							<Grid item xs={12}>
								<Tooltip
									disableHoverListener
									title={"Add remarks for declaration purpose or if theres anything you want to notify us regarding your parcel"}
									placement="top"
									arrow
									enterTouchDelay={100}
								>
									<TextField
										label="Permit Remark"
										multiline
										sx={{ mt: { xs: 2, sm: 0 }, boxShadow: (theme) => theme.shadows[1] }}
										minRows={4}
										fullWidth
										margin="dense"
										value={permitRemark}
										onChange={(e) => {
											setPermitRemark(e.target.value);
										}}
									/>
								</Tooltip>
							</Grid>
						)}
						<Grid item xs={12} sm={6} display={"flex"}>
							<NextLink href="/member/new-order/form" passHref>
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
									
									setLoading(false);
									if (!nErrors) {
										setOpenDialog(true);
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
