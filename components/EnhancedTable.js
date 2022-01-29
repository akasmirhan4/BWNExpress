import { DeleteRounded, FilterListRounded, MoreHorizRounded, SearchRounded } from "@mui/icons-material";
import {
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
	TextField,
	InputAdornment,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { visuallyHidden } from "@mui/utils";

export default function EnhancedTable(props) {
	const { headers = [], data = [], title = "Untitled", actions, emptyActions, requireSearch = false } = props;
	const [order, setOrder] = useState("asc");
	const { id: key } = headers.find(({ key }) => key) ?? { id: "" };
	const [_orderBy, _setOrderBy] = useState("");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rows, setRows] = useState([]);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [search, setSearch] = useState("");

	const handleRequestSort = (event, property) => {
		const isAsc = _orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		_setOrderBy(property);
	};

	const reset = () => {
		if (!requireSearch) {
			setRows(data);
		} else {
			setRows([]);
		}
	};

	useEffect(() => {
		reset();
	}, [data]);

	useEffect(() => {
		if (!data.length) return;
		if (!search) {
			reset();
			return;
		}
		const searchableIDs = headers.filter(({ searchable }) => searchable).map(({ id }) => id);
		const filteredRow = data.filter((row) => searchableIDs.filter((key) => row[key].toLowerCase().includes(search.toLowerCase())).length);
		setRows(filteredRow);
	}, [search, data]);

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n[key ?? headers[0].id]);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, key) => {
		const selectedIndex = selected.indexOf(key);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, key);
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
				<EnhancedTableToolbar numSelected={selected.length} title={title} search={search} setSearch={setSearch} />
				<TableContainer>
					<Table sx={{ minWidth: 750 }} size={"medium"}>
						<EnhancedTableHead
							headers={headers}
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
									<EnhancedTableRow row={row} key={index} handleClick={handleClick} selected={selected} headers={headers} actions={actions} />
								))}
							{rows.length == 0 && emptyActions && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} align="center">
										{emptyActions}
									</TableCell>
								</TableRow>
							)}
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

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headers } = props;
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
				{headers.map((headCell) => (
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
	const { numSelected, title, search, setSearch } = props;

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
					{title}
				</Typography>
			)}
			<TextField
				label=""
				margin="dense"
				size="small"
				value={search}
				onChangeCapture={(e) => setSearch(e.target.value)}
				label="Search"
				fullWidth
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							{/* <IconButton> */}
							<SearchRounded />
							{/* </IconButton> */}
						</InputAdornment>
					),
				}}
			/>
			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton disabled>
						<DeleteRounded />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton disabled>
						<FilterListRounded />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

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
	const {
		row,
		handleClick,
		selected,
		headers,
		actions = (row) => (
			<IconButton disabled>
				<MoreHorizRounded />
			</IconButton>
		),
	} = props;
	const { id: key } = headers.find(({ key }) => key) ?? { id: "" };
	const isItemSelected = selected.indexOf(row[key]) !== -1;

	return (
		<Fragment>
			<TableRow
				hover
				onClick={(e) => {
					e.stopPropagation();
					handleClick(e, row[key ?? headers[0].id]);
				}}
				role="checkbox"
				tabIndex={-1}
				key={row[key ?? headers[0].id]}
				selected={isItemSelected}
			>
				<TableCell padding="checkbox">
					<Checkbox color="primary" checked={isItemSelected} />
				</TableCell>
				{headers.map((header, i) =>
					i == 0 ? (
						!header.action ? (
							<TableCell key={header.id} component={"th"} scope={"row"} padding="none" align={header.alignRight ? "right" : "left"}>
								{header.value ? header.value(row[header.id]) : row[header.id]}
							</TableCell>
						) : (
							actions
						)
					) : !header.action ? (
						<TableCell key={header.id} align={header.alignRight ? "right" : "left"}>
							{header.value ? header.value(row[header.id]) : row[header.id]}
						</TableCell>
					) : (
						<TableCell key={"actions"} align="right">
							{actions(row)}
						</TableCell>
					)
				)}
			</TableRow>
		</Fragment>
	);
}
