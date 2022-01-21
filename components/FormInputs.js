import { TextField, FormHelperText, Tooltip, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Fragment } from "react";

export function CustomTextField(props) {
	const { tooltip = "", errors = [] } = props;
	return (
		<Fragment>
			<Tooltip disableHoverListener title={tooltip} placement="top" arrow enterTouchDelay={100}>
				<TextField {...props} fullWidth margin="dense" sx={{ boxShadow: (theme) => theme.shadows[1] }} error={errors.length} />
			</Tooltip>
			{errors.length > 0 && <FormHelperText error>{errors.join(" , ")}</FormHelperText>}
		</Fragment>
	);
}

export function CustomSelector(props) {
	const { tooltip, errors, required, label, onChange, value, items } = props;
	return (
		<Fragment>
			<Tooltip disableHoverListener title={tooltip} placement="top" arrow enterTouchDelay={100}>
				<FormControl fullWidth sx={{ mt: { xs: 3, sm: 1 } }}>
					<InputLabel error={errors.length}>{`${label} ${required ? " *" : ""}`}</InputLabel>
					<Select
						value={value}
						label={`${label} ${required ? " *" : ""}`}
						onChange={onChange}
						margin="dense"
						sx={{ boxShadow: (theme) => theme.shadows[1] }}
						required
						error={errors.length}
					>
						{items.map((item, index) => (
							<MenuItem value={item} key={index}>
								{item}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Tooltip>
			<FormHelperText error>{errors.join(" , ")}</FormHelperText>
		</Fragment>
	);
}
