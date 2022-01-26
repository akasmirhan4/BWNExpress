import { TextField, InputAdornment, Button, Box } from "@mui/material";
import { currencies, itemCategories, permitCategories } from "lib/formConstant";
import React, { Fragment, useState } from "react";
import { CustomSelector } from "./FormInputs";

export default function PermitDetails(props) {
	const { editable } = props;

	const [order, setOrder] = useState(props.order);

	return (
		<Fragment>
			<TextField margin="dense" label="Item Category" type="text" fullWidth variant="outlined" value={order.itemCategory} disabled />
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
			<CustomSelector
				margin="dense"
				label="Permit Category"
				fullWidth
				variant="outlined"
				value={order.permitCategory}
				items={permitCategories}
				onChange={(e) => {
					setOrder({ ...order, permitCategory: e.target.value });
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
						>{`See Item Description #${index + 1}`}</Button>
					))}
				</Box>
			)}
		</Fragment>
	);
}
