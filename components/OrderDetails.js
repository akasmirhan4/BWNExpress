import { TextField, InputAdornment, Button, Box } from "@mui/material";
import { currencies, itemCategories } from "lib/formConstant";
import React, { Fragment, useState } from "react";
import { CustomSelector } from "./FormInputs";

export default function OrderDetails(props) {
	const { editable } = props;

	const [order, setOrder] = useState(props.order);

	return (
		<Fragment>
			<TextField margin="dense" label="Order ID" type="text" fullWidth variant="outlined" value={order.orderID} disabled />
			<TextField
				margin="dense"
				label="Date Submitted"
				type="text"
				fullWidth
				variant="outlined"
				value={order.dateSubmitted?.toDate().toLocaleString()}
				disabled
			/>
			<TextField margin="dense" label="Tracking ID" type="text" fullWidth variant="outlined" value={order.trackingNumber} disabled={!editable} />
			<CustomSelector
				label="Status"
				value={order.status}
				items={[
					"arrivedLabuan",
					"orderApproved",
					"orderRejected",
					"orderSubmitted",
					"awaitingParcel",
					"readyForCollection",
					"atCollectionCenter",
					"pendingAction",
					"processingPermit",
					"delivering",
					"delivered",
					"inTransit",
				]}
				onChange={(e) => {
					setOrder({ ...order, status: e.target.value });
				}}
				disabled={!editable}
			/>
			<TextField margin="dense" label="Purchase From" type="text" fullWidth variant="outlined" value={order.purchaseFrom} disabled={!editable} />
			<CustomSelector
				label="Currency"
				value={order.currency}
				items={currencies}
				onChange={(e) => {
					setOrder({ ...order, currency: e.target.value });
				}}
				disabled={!editable}
			/>
			<TextField
				margin="dense"
				label="Parcel Value"
				type="number"
				fullWidth
				variant="outlined"
				value={order.parcelValue}
				disabled={!editable}
				InputProps={{ startAdornment: <InputAdornment position="start">{order.currency}</InputAdornment> }}
			/>
			<CustomSelector
				label="Item Category"
				value={order.itemCategory}
				items={itemCategories}
				onChange={(e) => {
					setOrder({ ...order, itemCategory: e.target.value });
				}}
				disabled={!editable}
			/>
			<TextField
				margin="dense"
				label="Parcel Weight"
				type="number"
				fullWidth
				variant="outlined"
				value={order.parcelWeight}
				disabled={!editable}
				InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
			/>
			<TextField
				margin="dense"
				label="Courier Provider"
				type="text"
				fullWidth
				variant="outlined"
				value={order.courierProvider == "Others" ? order.specificCourierProvider : order.courierProvider}
				disabled={!editable}
			/>
			<TextField
				margin="dense"
				label="Item Description"
				type="text"
				fullWidth
				multiline
				minRows={3}
				variant="outlined"
				value={order.itemDescription}
				disabled={!editable}
			/>
			<TextField margin="dense" label="Remark" type="text" fullWidth multiline minRows={3} variant="outlined" value={order.remark} disabled={!editable} />
			<TextField margin="dense" label="Labuan Remark" type="text" fullWidth multiline minRows={3} variant="outlined" value={order.labuanRemark} disabled={!editable} />
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
						>{`See Receipt #${index + 1}`}</Button>
					))}
				</Box>
			)}
		</Fragment>
	);
}
