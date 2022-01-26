import { CloseRounded, DeleteRounded, EditRounded, FilterListRounded, MoreHorizRounded, SaveRounded } from "@mui/icons-material";
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
} from "@mui/material";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import React, { Fragment, useEffect, useRef } from "react";
import { useState } from "react";
import { visuallyHidden } from "@mui/utils";
import { collection, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { firestore } from "lib/firebase";
import { UserDetails } from "components/UserDetails";
import toast from "react-hot-toast";

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

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.alignRight ? "right" : "left"}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

const EnhancedTableToolbar = (props) => {
	const { numSelected } = props;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
					Registered Users
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton>
						<DeleteRounded />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton>
						<FilterListRounded />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};
const headCells = [
	{
		id: "fullName",
		alignRight: false,
		disablePadding: true,
		label: "Full Name",
	},
	{
		id: "email",
		alignRight: false,
		disablePadding: false,
		label: "Email",
	},
	{
		id: "role",
		alignRight: true,
		disablePadding: false,
		label: "Role",
	},
	{
		id: "status",
		alignRight: true,
		disablePadding: false,
		label: "Status",
	},
	{
		id: "action",
		alignRight: true,
		disablePadding: false,
		label: "Action",
	},
];

function UsersTable(props) {
	const [order, setOrder] = useState("asc");
	const [_orderBy, _setOrderBy] = useState("calories");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [users, setUsers] = useState([]);
	const [rows, setRows] = useState([]);

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
					switch (user.verified?.IC) {
						case "pending":
							status = "pending";
							break;
						case true:
							status = "verified";
							break;
						case false:
							status = "unverified";
							break;
						default:
							status = "error";
							break;
					}
					return {
						fullName: user.fullName,
						email: user.email,
						status,
						role: user.role,
					};
				})
			);
		});
	}, []);

	const handleRequestSort = (event, property) => {
		const isAsc = _orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		_setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.email);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, email) => {
		const selectedIndex = selected.indexOf(email);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, email);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar numSelected={selected.length} />
				<TableContainer>
					<Table sx={{ minWidth: 750 }} size={"medium"}>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={_orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{rows
								.slice()
								.sort(getComparator(order, _orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => (
									<EnhancedTableRow row={row} key={index} handleClick={handleClick} selected={selected} user={users[page * rowsPerPage + index]} />
								))}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableRow(props) {
	const { row, handleClick, selected, user } = props;
	const isItemSelected = selected.indexOf(row.email) !== -1;
	const [openDialog, setOpenDialog] = useState(false);
	const userRef = useRef(null);

	return (
		<Fragment>
			<TableRow
				hover
				onClick={(e) => {
					e.stopPropagation();
					handleClick(e, row.email);
				}}
				role="checkbox"
				tabIndex={-1}
				key={row.email}
				selected={isItemSelected}
			>
				<TableCell padding="checkbox">
					<Checkbox color="primary" checked={isItemSelected} />
				</TableCell>
				<TableCell component="th" scope="row" padding="none" align={headCells[1].alignRight ? "right" : "left"}>
					{row.fullName}
				</TableCell>
				<TableCell align={headCells[1].alignRight ? "right" : "left"}>{row.email}</TableCell>
				<TableCell align={headCells[2].alignRight ? "right" : "left"}>{row.role}</TableCell>
				<TableCell align={headCells[3].alignRight ? "right" : "left"}>
					<Chip
						size="small"
						sx={{ color: "white.main" }}
						label={row.status}
						color={row.status == "verified" ? "success" : row.status == "unverified" ? "error" : row.status == "pending" ? "warning" : "info"}
					/>
				</TableCell>
				<TableCell align={headCells[4].alignRight ? "right" : "left"}>
					<IconButton>
						<EditRounded
							onClick={(e) => {
								e.stopPropagation();
								setOpenDialog(true);
							}}
						/>
					</IconButton>
					<IconButton>
						<MoreHorizRounded />
					</IconButton>
				</TableCell>
			</TableRow>
			<Dialog
				open={openDialog}
				onClose={() => {
					setOpenDialog(false);
				}}
			>
				<DialogTitle>{row.fullName}</DialogTitle>
				<DialogContent>
					<UserDetails editable={true} user={user} ref={userRef} />
				</DialogContent>
				<DialogActions>
					<IconButton>
						<CloseRounded
							onClick={() => {
								setOpenDialog(false);
							}}
						/>
					</IconButton>
					<IconButton>
						<SaveRounded
							onClick={() => {
								toast.promise(userRef.current.save(), { loading: "saving...", error: "error saving", success: "user saved" });
								setOpenDialog(false);
							}}
						/>
					</IconButton>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
