import { ExpandMoreRounded, KeyboardArrowDownRounded, KeyboardArrowUpRounded, MapRounded, PageviewRounded } from "@mui/icons-material";
import { DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
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
import styles from "styles/main.module.scss";

export default function MyOrders() {
	const [status, setStatus] = useState({
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

	function createData(orderID, dateSubmitted, status, expectedArrival) {
		return { orderID, dateSubmitted, status, expectedArrival };
	}

	function camelCaseToText(camel) {
		const result = camel.replace(/([A-Z])/g, " $1");
		const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		return finalResult;
	}

	const rows = [
		createData("BWN123456", new Date().toLocaleDateString(), "pendingAction", null),
		createData("BWN123457", new Date().toLocaleDateString(), "processingPermit", "3 days"),
		createData("BWN123458", new Date().toLocaleDateString(), "delivered", null),
	];

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
				filteredRows = filteredRows.filter((row) => new Date(row.dateSubmitted) >= startingDate && new Date(row.dateSubmitted) <= endingDate);
			} else if (startingDate) {
				filteredRows = filteredRows.filter((row) => new Date(row.dateSubmitted) >= startingDate);
			} else {
				filteredRows = filteredRows.filter((row) => new Date(row.dateSubmitted) <= endingDate);
			}
		}
		setDisplayedRows(filteredRows);
	}, [status, dateFilter]);

	return (
		<MemberPageTemplate>
			<Container sx={{ my: 4 }}>
				{/* Filter Container */}
				<Accordion className={styles.dropShadow} sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightgray", mb: 4 }}>
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
									</FormGroup>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography mb={1}>DATE</Typography>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateRangePicker
										inputFormat="dd-MMM-yyyy"
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
								<TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw", overflow: "hidden" }}>DATE SUBMITTED</TableCell>
								{!isSmDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>STATUS</TableCell>}
								{!isMdDown && <TableCell sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "10vw" }}>EXPECTED ARRIVAL</TableCell>}
								{!isMdDown && (
									<TableCell align="right" sx={{ minWidth: "18em" }}>
										ACTIONS
									</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{displayedRows.map((row) => {
								const [collapseOpen, setCollapseOpen] = useState(false);

								return (
									<TableRow key={row.orderID} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										{isMdDown && (
											<TableCell sx={{px: 0}}>
												<IconButton aria-label="expand row" size="small" onClick={() => setCollapseOpen(!collapseOpen)}>
													{collapseOpen ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
												</IconButton>
											</TableCell>
										)}
										<TableCell component="th" scope="row">
											{row.orderID}
										</TableCell>
										<TableCell>{row.dateSubmitted}</TableCell>
										{!isSmDown && <TableCell>{camelCaseToText(row.status)}</TableCell>}
										{!isMdDown && <TableCell>{row.expectedArrival ?? "-"}</TableCell>}
										{!isMdDown && (
											<TableCell align="right">
												<IconButton>
													<PageviewRounded color="primary" />
												</IconButton>
												<IconButton sx={{ ml: 1 }}>
													<MapRounded color="primary" />
												</IconButton>
												<Button variant="contained" sx={{ color: "white.main", ml: 1 }} className={styles.dropShadow}>
													Track Order
												</Button>
											</TableCell>
										)}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
		</MemberPageTemplate>
	);
}
