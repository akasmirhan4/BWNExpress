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

		if (!!Object.values(_errors).reduce((a, v) => a + v.length, 0)) {
			toast.error("Please remove the errors to continue");
		}
		setErrors(_errors);
	}

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Box display={"flex"} justifyContent="space-between" alignItems={"center"} sx={{ mb: 4 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="/member/dashboard" prefetch={false} passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<NextLink href="/member/new-order" prefetch={false} passHref>
							<Link underline="hover" color="inherit">
								New Order
							</Link>
						</NextLink>
						<Typography color="text.primary">Summary</Typography>
					</Breadcrumbs>
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
