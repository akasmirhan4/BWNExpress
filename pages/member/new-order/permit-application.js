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

	const [errors, setErrors] = useState({
		permitCategory: [],
	});
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);

	const reset = () => {
		setRequiresPermit(false);
		setPermitCategory("");
		setPermitRemark("");
	};

	useEffect(() => {
		if (userData) {
			setRequiresPermit(window.sessionStorage.getItem("requiresPermit") ?? "");
			setPermitCategory(window.sessionStorage.getItem("permitCategory") ?? "");
			setPermitRemark(window.sessionStorage.getItem("permitRemark") ?? "");
			setLoaded(true);
		}
	}, [userData]);

	useEffect(() => {
		if (!loaded) return;
		let data = {
			requiresPermit,
			permitCategory,
			permitRemark,
		};
		Object.entries(data).forEach(([key, value]) => {
			window.sessionStorage.setItem(key, value);
		});
	}, [requiresPermit, permitCategory, permitRemark]);

	useEffect(() => {
		if (window.sessionStorage.getItem("isAcknowledged") != "true") {
			toast("Redirecting...");
			router.push("acknowledgement");
		} else if (!window.sessionStorage.getItem("weightRange")) {
			toast("Redirecting...");
			router.push("form");
		}
	}, []);

	const permitCategories = [
		"Cosmetics including perfume",
		"Skincare & Healthcare",
		"Medication or Pharmaceutical Products",
		"Traditional Medicines & Health Supplement Products",
		"Food Items",
		"Books",
		"Essential Oils",
	];

	function validateInputs() {
		const currencyRegex = /^\d*(\.\d{2})?$/;
		let _errors = {
			permitCategory: [],
		};

		if (requiresPermit) {
			if (!permitCategory) {
				_errors.permitCategory.push("This is required");
			} else if (!permitCategories.includes(permitCategory)) {
				_errors.permitCategory.push("Unknown method");
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
											<InputLabel error={!!errors.permitCategory.length}>Permit Category</InputLabel>
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
									console.log(errors);
									setLoading(false);
									if (!nErrors) {
										router.push("payment");
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
