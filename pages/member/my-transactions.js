import { BugReportRounded, ExpandMoreRounded, KeyboardArrowDownRounded, KeyboardArrowUpRounded, MapRounded, PageviewRounded } from "@mui/icons-material";
import { DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Breadcrumbs,
	Button,
	Checkbox,
	Collapse,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid,
	IconButton,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	useMediaQuery,
} from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { Fragment, useEffect, useState } from "react";
import ImageWithSkeleton from "components/ImageWithSkeleton";
import PendingPaymentsBox from "components/PendingPaymentBox";
import { currencyFormatter } from "lib/formatter";
import { getTransactions } from "lib/firebase";
import { selectUser, selectUserExists, setTransactions } from "lib/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function MyTransactions() {
	const [status, setStatus] = useState({
		approved: false,
		declined: false,
	});
	const [dateFilter, setDateFilter] = useState([null, null]);

	const handleStatusChange = (event) => {
		setStatus({
			...status,
			[event.target.name]: event.target.checked,
		});
	};

	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();
	const userExist = useSelector(selectUserExists);

	useEffect(() => {
		if (userExist) {
			getTransactions().then((transactions) => {
				if (!transactions) return;
				dispatch(setTransactions(transactions));
				const _rows = transactions.map(({ orderID, transactionDateTime, type, status, value, paymentMethod, lastCardDigits }) => {
					return {
						orderID,
						transactionDateTime: new Date(transactionDateTime.seconds * 1000 + transactionDateTime.nanoseconds / 1000000).toISOString(),
						type,
						status,
						value,
						paymentMethod,
						lastCardDigits,
					};
				});
				setRows(_rows);
				setDisplayedRows(_rows);
			});
			setLoading(false);
		}
	}, [userExist]);

	// const rows = [
	// 	createData("BWN123456", new Date().toLocaleString(), "CHARGE", "approved", 49.97, "mastercard", 2420),
	// 	createData("BWN123456", new Date().toLocaleString(), "CHARGE", "declined", 30, "idk", 2420),
	// 	createData("BWN123456", new Date().toLocaleString(), "CHARGE", "approved", 8, "visa", 9050),
	// 	createData("BWN123456", new Date().toLocaleString(), "CHARGE", "pending", 8, null, null),
	// ];

	const [displayedRows, setDisplayedRows] = useState(rows);
	const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	useEffect(() => {
		const isStatusSelected = Object.values(status).some((e) => e);
		const isDateFilterFilled = dateFilter.some((e) => !!e);
		if (!isStatusSelected && !isDateFilterFilled) setDisplayedRows(rows);
		let filteredRows = rows;
		if (isStatusSelected) {
			const selectedStatus = Object.keys(status).filter((key) => status[key]);
			filteredRows = rows.filter((row) => selectedStatus.includes(row.status));
		}
		if (isDateFilterFilled) {
			const startingDate = dateFilter[0] ?? null;
			const endingDate = dateFilter[1] ?? null;
			if (startingDate && endingDate) {
				filteredRows = filteredRows.filter((row) => new Date(row.transactionDateTime) >= startingDate && new Date(row.transactionDateTime) <= endingDate);
			} else if (startingDate) {
				filteredRows = filteredRows.filter((row) => new Date(row.transactionDateTime) >= startingDate);
			} else {
				filteredRows = filteredRows.filter((row) => new Date(row.transactionDateTime) <= endingDate);
			}
		}
		setDisplayedRows(filteredRows);
	}, [status, dateFilter]);

	return (
		<MemberPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">My Transactions</Typography>d
				</Breadcrumbs>
			</Container>
			<PendingPaymentsBox sx={{ my: 4 }} />
			<Container sx={{ my: 4 }}>
				{/* Filter Container */}
				<Accordion sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightgray", mb: 4, boxShadow: (theme) => theme.shadows[1] }}>
					<AccordionSummary expandIcon={<ExpandMoreRounded />}>
						<Typography>Filter</Typography>
					</AccordionSummary>
					<AccordionDetails sx={{ mx: 4, mb: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<FormControl component="fieldset" variant="standard">
									<FormLabel component="legend" sx={{ mb: 1 }}>
										STATUS
									</FormLabel>
									<FormGroup>
										<FormControlLabel control={<Checkbox checked={status.approved} onChange={handleStatusChange} name="approved" />} label="Approved" />
										<FormControlLabel control={<Checkbox checked={status.declined} onChange={handleStatusChange} name="declined" />} label="Declined" />
									</FormGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography mb={1}>DATE</Typography>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateRangePicker
										mask="__-__-____"
										inputFormat="dd-MM-yyyy"
										startText="Start Date"
										endText="End Date"
										value={dateFilter}
										onChange={(newDate) => {
											setDateFilter(newDate);
										}}
										renderInput={(startProps, endProps) => (
											<Fragment>
												<TextField {...startProps} />
												<Box sx={{ mx: 2 }}> to </Box>
												<TextField {...endProps} />
											</Fragment>
										)}
									/>
								</LocalizationProvider>
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
				{/* Order Table */}
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								{isMdDown && <TableCell />}
								<TableCell>ORDER ID</TableCell>
								<TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw", overflow: "hidden" }}>
									{isSmDown ? "DATE" : "DATE AND TIME"}
								</TableCell>
								{!isMdDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>TYPE</TableCell>}
								{!isSmDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>STATUS</TableCell>}
								{!isSmDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>VALUE</TableCell>}
								{!isMdDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>PAYMENT METHOD</TableCell>}
								{!isMdDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }} />}
							</TableRow>
						</TableHead>
						<TableBody>
							{displayedRows.map((row) => (
								<EnhancedTableRow row={row} key={row.orderID} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
				{!displayedRows.length && <Typography sx={{ my: 4, textAlign: "center" }}>😢 Nothing to display</Typography>}
				{loading && (
					<Fragment>
						<Skeleton variant="rectangular" width={"100%"} height={"2em"} sx={{ my: 1 }} />
						<Skeleton variant="rectangular" width={"100%"} height={"2em"} sx={{ my: 1 }} />
						<Skeleton variant="rectangular" width={"100%"} height={"2em"} sx={{ my: 1 }} />
					</Fragment>
				)}
			</Container>
		</MemberPageTemplate>
	);
}

function EnhancedTableRow(props) {
	const [collapseOpen, setCollapseOpen] = useState(false);
	const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}
	const row = props.row;
	return (
		<Fragment>
			<TableRow key={row.orderID} sx={{ "& > *": { borderBottom: "unset" } }}>
				{isMdDown && (
					<TableCell sx={{ px: 0 }}>
						<IconButton aria-label="expand row" size="small" onClick={() => setCollapseOpen(!collapseOpen)}>
							{collapseOpen ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
						</IconButton>
					</TableCell>
				)}
				<TableCell component="th" scope="row">
					{row.orderID}
				</TableCell>
				<TableCell>{!isSmDown ? new Date(row.transactionDateTime).toLocaleString() : new Date(row.transactionDateTime).toLocaleDateString()}</TableCell>
				{!isMdDown && <TableCell>{row.type}</TableCell>}
				{!isSmDown && <TableCell>{row.status}</TableCell>}
				{!isSmDown && <TableCell>{currencyFormatter.format(row.value)}</TableCell>}
				{!isMdDown && (
					<TableCell>
						<Box display="flex" alignItems={"center"}>
							{row.paymentMethod == "mastercard" ? (
								<ImageWithSkeleton containersx={{ height: "unset", width: "unset", mt: 1 }} src="/svgs/mastercard.svg" width={"50"} height={"30"} />
							) : row.paymentMethod == "visa" ? (
								<ImageWithSkeleton containersx={{ height: "unset", width: "unset" }} src="/svgs/visa.svg" width={"50"} height={"23"} />
							) : !row.paymentMethod ? (
								<Typography>{"-"}</Typography>
							) : (
								<BugReportRounded sx={{ width: "50px" }} color="lightGrey" />
							)}
							{row.paymentMethod ? `**${row.lastCardDigits}` : ""}
						</Box>
					</TableCell>
				)}
				{!isMdDown && (
					<TableCell align="right">
						<Button variant="outlined" sx={{ ml: 1, boxShadow: (theme) => theme.shadows[1] }}>
							View Bill
						</Button>
					</TableCell>
				)}
			</TableRow>
			{isMdDown && (
				<TableRow sx={{ bgcolor: "offWhite.secondary" }}>
					<TableCell colSpan={"100%"} sx={{ py: 0, borderBottom: "unset" }}>
						<Collapse in={collapseOpen} timeout="auto" unmountOnExit>
							<Box m={2}>
								<TableContainer>
									<Table size="small">
										{isSmDown && (
											<TableRow>
												<TableCell sx={{ borderBottom: "unset" }}>TIME</TableCell>
												<TableCell align="right" sx={{ borderBottom: "unset" }}>
													{new Date(row.transactionDateTime).toLocaleTimeString()}
												</TableCell>
											</TableRow>
										)}
										<TableRow>
											<TableCell sx={{ borderBottom: "unset" }}>TYPE</TableCell>
											<TableCell align="right" sx={{ borderBottom: "unset" }}>
												{row.type}
											</TableCell>
										</TableRow>
										{isSmDown && (
											<TableRow>
												<TableCell sx={{ borderBottom: "unset" }}>STATUS</TableCell>
												<TableCell align="right" sx={{ borderBottom: "unset" }}>
													{camelCaseToText(row.status)}
												</TableCell>
											</TableRow>
										)}
										{isSmDown && (
											<TableRow>
												<TableCell sx={{ borderBottom: "unset" }}>VALUE</TableCell>
												<TableCell align="right" sx={{ borderBottom: "unset" }}>
													{currencyFormatter.format(row.value)}
												</TableCell>
											</TableRow>
										)}
										<TableRow>
											<TableCell component={"th"} sx={{ borderBottom: "unset" }}>
												PAYMENT
											</TableCell>
											<TableCell align="right" sx={{ borderBottom: "unset" }}>
												<Box display="flex" alignItems={"center"} justifyContent={"flex-end"}>
													{row.paymentMethod == "mastercard" ? (
														<ImageWithSkeleton containersx={{ height: "unset", width: "unset", mt: 1 }} src="/svgs/mastercard.svg" width={"50"} height={"30"} />
													) : row.paymentMethod == "visa" ? (
														<ImageWithSkeleton containersx={{ height: "unset", width: "unset" }} src="/svgs/visa.svg" width={"50"} height={"23"} />
													) : (
														<BugReportRounded sx={{ width: "50px" }} color="lightGrey" />
													)}
													{`**${row.lastCardDigits}`}
												</Box>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell colSpan={2} align={"center"} sx={{ borderBottom: "unset" }}>
												<Button
													variant="outlined"
													sx={{
														whiteSpace: "nowrap",
														textOverflow: "ellipsis",
														overflow: "hidden",
														boxShadow: (theme) => theme.shadows[1],
													}}
													fullWidth
												>
													View Bill
												</Button>
											</TableCell>
										</TableRow>
									</Table>
								</TableContainer>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</Fragment>
	);
}
