import {
	AnnouncementRounded,
	CheckRounded,
	CloseRounded,
	DeleteRounded,
	EditRounded,
	FilterListRounded,
	MoreHorizRounded,
	NotificationAddRounded,
	PersonRemoveRounded,
	SaveRounded,
	SendRounded,
} from "@mui/icons-material";
import {
	Breadcrumbs,
	Container,
	Typography,
	Box,
	Paper,
	TableContainer,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Toolbar,
	IconButton,
	Checkbox,
	TableSortLabel,
	TablePagination,
	Tooltip,
	TableHead,
	alpha,
	Chip,
	Dialog,
	DialogContent,
	DialogActions,
	DialogTitle,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	DialogContentText,
	Button,
} from "@mui/material";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import React, { Fragment, useEffect, useRef } from "react";
import { useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { firestore } from "lib/firebase";
import { UserDetails } from "components/UserDetails";
import toast from "react-hot-toast";
import { NotificationForm } from "components/NotificationForm";
import { deleteUser } from "firebase/auth";
import EnhancedTable from "components/EnhancedTable";

export default function ManageUsers() {
	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Manage Users</Typography>
				</Breadcrumbs>
				<UsersTable />
			</Container>
		</ModeratorPageTemplate>
	);
}

const EditDialog = ({ open, onClose, user }) => {
	const userRef = useRef(null);

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{user?.fullName}</DialogTitle>
			<DialogContent>{user && <UserDetails editable={true} user={user} ref={userRef} />}</DialogContent>
			<DialogActions>
				<IconButton>
					<CloseRounded onClick={onClose} />
				</IconButton>
				<IconButton>
					<SaveRounded
						onClick={() => {
							toast.promise(userRef.current.save(), { loading: "saving...", error: "error saving", success: "user saved" });
							onClose();
						}}
					/>
				</IconButton>
			</DialogActions>
		</Dialog>
	);
};

const NotificationDialog = ({ open, onClose, user }) => {
	const notifRef = useRef(null);
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>
				<Typography variant="h5">{`Notify ${user?.fullName}`}</Typography>
				<Typography variant="caption">{user?.email}</Typography>
			</DialogTitle>
			<DialogContent>
				<NotificationForm user={user} ref={notifRef} />
			</DialogContent>
			<DialogActions>
				<IconButton>
					<CloseRounded onClick={onClose} />
				</IconButton>
				<IconButton>
					<SendRounded
						onClick={() => {
							toast.promise(notifRef.current.send(), { loading: "notifying...", error: "error notifying", success: "user notified" });
							onClose();
						}}
					/>
				</IconButton>
			</DialogActions>
		</Dialog>
	);
};

function UsersTable(props) {
	const [users, setUsers] = useState([]);
	const [rows, setRows] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		onSnapshot(collection(firestore, "users"), orderBy("creationDate", "asc"), (snapshots) => {
			let users = [];
			snapshots.forEach((doc) => {
				users.push(doc.data());
			});
			setUsers(users);
			setRows(
				users.map((user) => {
					let status;
					switch (user?.verified?.IC) {
						case "pending":
							status = "pending";
							break;
						case true:
							status = "verified";
							break;
						case false:
							if (user?.IC) {
								status = "unverified";
								break;
							} else {
								status = "unregistered";
								break;
							}
						case "uploadingLater":
							status = "not yet upload";
							break;
						default:
							status = "error";
							break;
					}
					return {
						...user,
						fullName: user?.fullName ?? "-",
						email: user?.email,
						status,
						role: user?.role,
					};
				})
			);
		});
	}, []);

	useEffect(() => {
		console.log({ selectedUser });
	}, [selectedUser]);

	return (
		<>
			<EnhancedTable
				title="Registered Users"
				headers={[
					{
						id: "email",
						alignRight: false,
						disablePadding: false,
						label: "Email",
						searchable: true,
						key: true,
					},
					{
						id: "fullName",
						alignRight: false,
						disablePadding: false,
						label: "Name",
						searchable: true,
					},
					{
						id: "role",
						alignRight: false,
						disablePadding: false,
						label: "Role",
					},
					{
						id: "status",
						alignRight: false,
						disablePadding: false,
						label: "Status",
					},
					{
						id: "action",
						alignRight: true,
						disablePadding: false,
						label: "Action",
						action: true,
					},
				]}
				data={rows}
				actions={(row) => (
					<Fragment>
						<Tooltip title="Edit User">
							<IconButton
								onClick={(e) => {
									console.log({ user: row });
									setSelectedUser(row);
									setEditDialogOpen(true);
									e.stopPropagation();
								}}
							>
								<EditRounded />
							</IconButton>
						</Tooltip>
						<Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
							<MenuItem
								onClick={(e) => {
									e.stopPropagation();
									setAnchorEl(null);
									setNotificationDialogOpen(true);
								}}
							>
								<ListItemIcon>
									<AnnouncementRounded />
								</ListItemIcon>
								<ListItemText>Send Notification</ListItemText>
							</MenuItem>
						</Menu>
						<IconButton
							onClick={(e) => {
								console.log({ user: row });
								setSelectedUser(row);
								setAnchorEl(e.target);
								e.stopPropagation();
							}}
						>
							<MoreHorizRounded />
						</IconButton>
					</Fragment>
				)}
			/>
			<NotificationDialog open={notificationDialogOpen} onClose={() => setNotificationDialogOpen(false)} user={selectedUser} />
			<EditDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} user={selectedUser} />
			<AlertDialog
				open={deleteDialogOpen}
				onClose={() => {
					setDeleteDialogOpen(false);
				}}
				callback={() => {
					toast.promise(deleteDoc(doc(firestore, "users", selectedUser?.uid)), {
						loading: "Deleting user?...",
						error: "Error deleting",
						success: "User deleted",
					});
				}}
				title={"Delete Account"}
				text={
					<Fragment>
						After you have deleted an account, it will be permanently deleted. Accounts cannot be recovered.{"\n\n"}User account:
						<Typography>{selectedUser?.email}</Typography>
					</Fragment>
				}
			/>
			;
		</>
	);
}

function AlertDialog(props) {
	const { callback, title, text, onClose, ...others } = props;
	return (
		<Dialog onClose={onClose} {...others}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ whiteSpace: "pre-line" }}>{text}</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					startIcon={<CloseRounded />}
					onClick={() => {
						if (onClose) onClose();
					}}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					startIcon={<CheckRounded />}
					onClick={() => {
						if (callback) callback();
						if (onClose) onClose();
					}}
				>
					Proceed
				</Button>
			</DialogActions>
		</Dialog>
	);
}
