import { PersonRounded } from "@mui/icons-material";
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { blue } from "@mui/material/colors";
import { selectRole } from "lib/slices/userSlice";
import React from "react";
import { useSelector } from "react-redux";

export default function RoleDialog(props) {
	const { onClose, selectedValue, open } = props;
	const currentRole = useSelector(selectRole);

	let roles;
	if (currentRole == "moderator") {
		roles = ["moderator", "employee", "member"];
	} else if (currentRole == "employee") {
		roles = ["employee", "member"];
	} else {
		roles = ["members"];
	}

	const handleClose = () => {
		onClose(selectedValue);
	};

	const handleListItemClick = (value) => {
		onClose(value);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Select Role</DialogTitle>
			<List sx={{ pt: 0 }}>
				{roles.map((role) => (
					<ListItem button onClick={() => handleListItemClick(role)} key={role} sx={{ pr: 8 }}>
						<ListItemAvatar>
							<Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
								<PersonRounded />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={role} />
					</ListItem>
				))}
			</List>
		</Dialog>
	);
}
