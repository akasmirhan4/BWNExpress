import { ExpandMoreRounded, KeyboardArrowDownRounded, KeyboardArrowUpRounded, MapRounded, PageviewRounded } from "@mui/icons-material";
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
	Tooltip,
	Typography,
	useMediaQuery,
} from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { getOrders } from "lib/firebase";
import { selectUserExists, setOrders } from "lib/slices/userSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

export default function MyOrders() {
	const [status, setStatus] = useState({
		awaitingParcel: false,
		readyForCollection: false,
		atCollectionCenter: false,
		pendingAction: false,
		processingPermit: false,
		delivering: false,
		delivered: false,
		inTransit: false,
	});
	const [dateFilter, setDateFilter] = useState([null, null]);

	const handleStatusChange = (event) => {
		setStatus({
			...status,
			[event.target.name]: event.target.checked,
		});
	};

	const [rows, setRows] = useState([]);
	const [displayedRows, setDisplayedRows] = useState(rows);
	const [loading, setLoading] = useState(true);

	const isMdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const isSmDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const dispatch = useDispatch();
	const userExist = useSelector(selectUserExists);

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
				filteredRows = filteredRows.filter((row) => new Date(row.dateSubmitted) >= startingDate && new Date(row.dateSubmitted) <= endingDate);
			} else if (startingDate) {
				filteredRows = filteredRows.filter((row) => new Date(row.dateSubmitted) >= startingDate);
			} else {
				filteredRows = filteredRows.filter((row) => new Date(row.dateSubmitted) <= endingDate);
			}
		}
		setDisplayedRows(filteredRows);
	}, [status, dateFilter, rows]);

	useEffect(() => {
		if (userExist) {
			getOrders().then((orders) => {
				if (!orders) return;
				dispatch(setOrders(orders));
				console.log(orders);
				const _rows = orders.map(({ orderID, dateSubmitted, status, estimatedDuration }) => {
					return {
						orderID,
						dateSubmitted: dateSubmitted?.toDate(),
						status,
						estimatedDuration,
					};
				});
				setRows(_rows);
				setDisplayedRows(_rows);
			});
			setLoading(false);
		}
	}, [userExist]);

	return (
		<MemberPageTemplate>
			<Container sx={{ my: 4 }}>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">My Orders</Typography>
				</Breadcrumbs>
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
										<FormControlLabel
											control={<Checkbox checked={status.pendingAction} onChange={handleStatusChange} name="pendingAction" />}
											label="Pending Action"
										/>
										<FormControlLabel
											control={<Checkbox checked={status.processingPermit} onChange={handleStatusChange} name="processingPermit" />}
											label="Processing Permit"
										/>
										<FormControlLabel control={<Checkbox checked={status.delivering} onChange={handleStatusChange} name="delivering" />} label="Delivering" />
										<FormControlLabel control={<Checkbox checked={status.delivered} onChange={handleStatusChange} name="delivered" />} label="Delivered" />
										<FormControlLabel control={<Checkbox checked={status.inTransit} onChange={handleStatusChange} name="inTransit" />} label="In Transit" />
										<FormControlLabel
											control={<Checkbox checked={status.awaitingParcel} onChange={handleStatusChange} name="awaitingParcel" />}
											label="Awaiting Parcel"
										/>
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
											<Grid container spacing={2}>
												<Grid item xs={12} md={5}>
													<Box>
														<TextField {...startProps} />
													</Box>
												</Grid>
												<Grid item xs={12} md={2} display={"flex"} sx={{ justifyContent: { md: "center", xs: "flex-start" } }} alignItems={"center"}>
													<Box>to</Box>
												</Grid>
												<Grid item xs={12} md={5}>
													<Box>
														<TextField {...endProps} />
													</Box>
												</Grid>
											</Grid>
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
								{isMdDown && <TableCell sx={{ width: "1em" }} />}
								<TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>ORDER ID</TableCell>
								<TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "15vw", overflow: "hidden" }}>DATE SUBMITTED</TableCell>
								{!isSmDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>STATUS</TableCell>}
								{!isMdDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>ESTIMATED DURATION</TableCell>}
								{!isMdDown && (
									<TableCell align="right" sx={{ minWidth: "18em" }}>
										ACTIONS
									</TableCell>
								)}
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
	const row = props.row;

	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}

	return (
		<Fragment>
			<TableRow key={row.orderID}>
				{isMdDown && (
					<TableCell sx={{ px: 0, width: "1em" }}>
						<IconButton aria-label="expand row" size="small" onClick={() => setCollapseOpen(!collapseOpen)}>
							{collapseOpen ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
						</IconButton>
					</TableCell>
				)}
				<TableCell component="th" scope="row" sx={{ overflow: "hidden", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
					{row.orderID}
				</TableCell>
				<TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", width: "15vw", overflow: "hidden", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
					{new Date(row.dateSubmitted).toLocaleDateString()}
				</TableCell>
				{!isSmDown && <TableCell>{camelCaseToText(row.status)}</TableCell>}
				{!isMdDown && <TableCell>{row.estimatedDuration ?? "-"}</TableCell>}
				{!isMdDown && (
					<TableCell align="right">
						<Link href={`/member/my-orders/${encodeURIComponent(row.orderID)}/details`} passHref>
							<Tooltip title="See more details" placement="top" arrow>
								<IconButton>
									<PageviewRounded color="primary" />
								</IconButton>
							</Tooltip>
						</Link>
						<Tooltip title="In Progress" placement="top" arrow>
							<span>
								<IconButton sx={{ ml: 1 }} disabled={true}>
									<MapRounded color="lightGrey.secondary" />
								</IconButton>
							</span>
						</Tooltip>
						<Link href={`/member/my-orders/${encodeURIComponent(row.orderID)}/track`} passHref>
							<Tooltip title="Trace where your parcel have gone to" placement="top" arrow>
								<Button variant="contained" sx={{ ml: 1 }}>
									Track Order
								</Button>
							</Tooltip>
						</Link>
					</TableCell>
				)}
			</TableRow>
			{isMdDown && (
				<TableRow sx={{ bgcolor: "offWhite.secondary" }}>
					<TableCell colSpan={"100%"} sx={{ py: 0, borderBottom: "unset" }}>
						<Collapse in={collapseOpen} timeout="auto" unmountOnExit>
							<Box my={2}>
								<TableContainer>
									<Table size="small">
										{isSmDown && (
											<TableRow>
												<TableCell component={"th"} sx={{ borderBottom: "unset" }}>
													STATUS
												</TableCell>
												<TableCell align="right" sx={{ borderBottom: "unset", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
													{camelCaseToText(row.status)}
												</TableCell>
											</TableRow>
										)}
										<TableRow>
											<TableCell component={"th"} sx={{ borderBottom: "unset" }}>
												ESTIMATED DURATION
											</TableCell>
											<TableCell align="right" sx={{ borderBottom: "unset", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}>
												{row.estimatedDuration ?? "-"}
											</TableCell>
										</TableRow>
										<TableRow>
											{!isSmDown && <TableCell sx={{ borderBottom: "unset" }}>ACTIONS</TableCell>}
											<TableCell colSpan={isSmDown ? 2 : 1} align={!isSmDown ? "center" : "right"} sx={{ borderBottom: "unset" }}>
												<Box display="flex" justifyContent={isSmDown ? "center" : "flex-end"} mt={1}>
													<Link href={`/member/my-orders/${encodeURIComponent(row.orderID)}/details`} passHref>
														<IconButton>
															<PageviewRounded color="primary" />
														</IconButton>
													</Link>
													<Tooltip title="In Progress" placement="top" arrow>
														<span>
															<IconButton sx={{ mx: 1 }} disabled={true}>
																<MapRounded color="lightGrey.secondary" />
															</IconButton>
														</span>
													</Tooltip>
													<Link href={`/member/my-orders/${encodeURIComponent(row.orderID)}/track`} passHref>
														<Tooltip title="Trace where your parcel have gone to" placement="top" arrow>
															<Button
																variant="contained"
																sx={{
																	whiteSpace: "nowrap",
																	textOverflow: "ellipsis",
																	overflow: "hidden",
																	ml: 1,
																}}
																fullWidth
															>
																Track Order
															</Button>
														</Tooltip>
													</Link>
												</Box>
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
