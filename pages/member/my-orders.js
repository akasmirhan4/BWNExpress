import { ExpandMoreRounded } from "@mui/icons-material";
import { DateRangePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { Fragment, useState } from "react";
import styles from "styles/main.module.scss";

export default function MyOrders() {
	const allStatus = ["pending action", "processing permit", "delivering", "delivered", "in transit"];
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

	return (
		<MemberPageTemplate>
			<Container sx={{ my: 4 }}>
				{/* Filter Container */}
				<Accordion className={styles.dropShadow} sx={{ borderWidth: 1, borderStyle: "solid" }}>
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
			</Container>
		</MemberPageTemplate>
	);
}
