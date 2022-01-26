import { TextField, InputAdornment, Button, Box, Divider } from "@mui/material";
import { currencies, getWeightPrice, itemCategories, paymentMethods, permitCategories } from "lib/formConstant";
import React, { Fragment, useState } from "react";
import { CustomSelector } from "./FormInputs";

export default function PaymentDetails(props) {
	const { editable } = props;

	const [order, setOrder] = useState(props.order);

	return (
		<Fragment>
			<TextField
				margin="dense"
				label="Parcel Weight"
				type="text"
				fullWidth
				variant="outlined"
				value={order.parcelWeight}
				onChange={(e) => {
					setOrder({ ...order, parcelWeight: e.target.value });
				}}
				disabled={!editable}
				InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
			/>
			<TextField
				margin="dense"
				label="Weight Cost"
				type="text"
				fullWidth
				variant="outlined"
				value={getWeightPrice(order.parcelWeight)}
				disabled
				InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
			/>
			<Divider sx={{ my: 2 }} />
			<CustomSelector
				margin="dense"
				label="Permit Required?"
				fullWidth
				variant="outlined"
				value={String(order.requiresPermit)}
				items={["true", "false"]}
				onChange={(e) => {
					setOrder({ ...order, requiresPermit: e.target.value == "true" });
				}}
				disabled={!editable}
			/>
			<TextField
				margin="dense"
				label="Permit Application Cost"
				type="text"
				fullWidth
				variant="outlined"
				value={10}
				disabled
				InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
			/>
			<Divider sx={{ my: 2 }} />
			<TextField
				margin="dense"
				label="Total"
				type="text"
				fullWidth
				variant="outlined"
				value={order.total}
				disabled
				InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
			/>
			<CustomSelector
				margin="dense"
				label="Payment Method"
				fullWidth
				variant="outlined"
				value={order.paymentMethod}
				items={paymentMethods}
				onChange={(e) => {
					setOrder({ ...order, requiresPermit: e.target.value == "true" });
				}}
				disabled={!editable}
			/>
			{props.files?.length > 0 && (
				<Box sx={{ mt: 2 }}>
					{props.files.map((file, index) => (
						<Button
							key={index}
							variant="contained"
							onClick={() => {
								window.open(file.URL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=512,height=512");
							}}
							sx={{ mr: 1 }}
						>{`See Bank Transfer #${index + 1}`}</Button>
					))}
				</Box>
			)}
		</Fragment>
	);
}
