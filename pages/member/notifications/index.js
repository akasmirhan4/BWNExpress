import {
	AnnouncementOutlined,
	AnnouncementRounded,
	ArchiveRounded,
	BugReportRounded,
	ChevronLeft,
	ChevronRightRounded,
	DetailsRounded,
	LocalShippingRounded,
	MessageRounded,
	MoreVertRounded,
	UnarchiveRounded,
} from "@mui/icons-material";
import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	IconButton,
	Link,
	Typography,
} from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { archiveNotification, seeNotification } from "lib/firebase";
import { selectNotifications } from "lib/slices/userSlice";
import moment from "moment";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { cloneElement } from "react";
import { useSelector } from "react-redux";
import NextLink from "next/link";

export default function Notifications() {
	const notifications = useSelector(selectNotifications);
	const [seeArchives, setSeeArchives] = useState(false);

	useEffect(() => {
		if (notifications.length > 0) {
			(async () => {
				const unseenNotifications = notifications.filter((notification) => !notification.seen);
				let batchPromises = [];
				unseenNotifications.forEach((notification) => {
					batchPromises.push(seeNotification(notification.id));
				});
				await Promise.all(batchPromises);
			})();
		}
	}, [notifications]);

	return (
		<MemberPageTemplate>
			<Container>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<Breadcrumbs aria-label="breadcrumb">
						<NextLink href="/member/dashboard" passHref>
							<Link underline="hover" color="inherit">
								Home
							</Link>
						</NextLink>
						<Typography color="text.primary">Notifications</Typography>
					</Breadcrumbs>
					<Button onClick={() => setSeeArchives(!seeArchives)} startIcon={seeArchives ? <ChevronLeft /> : <ArchiveRounded />} sx={{ mt: -1 }}>
						{seeArchives ? "Go Back" : "See Archive"}
					</Button>
				</Box>
			</Container>
			<Container>
				{notifications?.map((notification, index) => {
					if (seeArchives && !notification.archived) {
						return null;
					} else if (!seeArchives && notification.archived) {
						return null;
					}

					let icon;
					switch (notification.type) {
						case "message":
							icon = <MessageRounded />;
							break;
						case "alert":
							icon = <AnnouncementRounded />;
							break;
						default:
							icon = <BugReportRounded />;
					}

					return (
						<NotificationCard
							key={notification.id}
							title={notification.title}
							subtitle={notification.subtitle}
							timestamp={moment(notification.timestamp).fromNow(true)}
							icon={icon}
							href={notification.href}
							id={notification.id}
							archive={seeArchives}
							details={notification.details}
						/>
					);
				})}
			</Container>
		</MemberPageTemplate>
	);
}

function NotificationCard(props) {
	const [mouseOver, setMouseOver] = useState(false);
	const Icon = props.icon ? cloneElement(props.icon, { sx: { fontSize: { md: "4rem", sm: "3.5rem", xs2: "3.2rem", xs: "2rem" } }, color: "lightGrey" }) : null;
	const router = useRouter();
	const [openDialog, setOpenDialog] = useState(false);
	return (
		<Fragment>
			{!!props.details && (
				<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
					<DialogTitle>{props.title + " " + props.subtitle}</DialogTitle>
					<DialogContent>
						<DialogContentText>{props.details}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpenDialog(false)}>Continue</Button>
					</DialogActions>
				</Dialog>
			)}
			<Card
				onMouseOver={() => setMouseOver(true)}
				onMouseLeave={() => setMouseOver(false)}
				sx={{ boxShadow: (theme) => (mouseOver ? theme.shadows[2] : theme.shadows[1]), cursor: "pointer", mb: 2, position: "relative" }}
				onClick={(e) => {
					e.preventDefault();
					if (!!props.details) setOpenDialog(true);
				}}
			>
				<Box sx={{ display: "flex" }}>
					{/* <Box sx={{ bgcolor: "primary.main", width: "4px", height: "100%", position: "absolute", left: 0, top: 0 }} /> */}
					<Grid container>
						<Grid item xs={3} sm={2} md={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
							{Icon ?? <CircularProgress />}
						</Grid>
						<Grid item xs={9} sm={10} md={9} lg={9.5} sx={{ display: "flex", justifyContent: "center", flexDirection: "column", py: 2 }}>
							<Grid container sx={{ display: "flex", alignItems: "center", pr: 2 }}>
								<Grid item xs={8}>
									<Typography fontWeight="bold">{props.title ?? "..."}</Typography>
								</Grid>
								<Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
									<Typography variant="caption" fontStyle="italic" textAlign={"right"}>
										{props.timestamp}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="caption" sx={{ mb: 2 }}>
										{props.subtitle}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="caption" fontStyle="italic">
										{props.caption ?? ""}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item
							xs={12}
							md={2}
							lg={1.5}
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								bgcolor: props.archive ? "lightGrey.secondary" : "primary.main",
								pr: 4,
								py: 1,
							}}
						>
							{props.archive ? (
								<IconButton
									onClick={async (e) => {
										e.preventDefault();
										console.log("unarchived");
										await archiveNotification(props.id, false);
									}}
								>
									<UnarchiveRounded color="white" />
								</IconButton>
							) : (
								<IconButton
									onClick={async (e) => {
										e.preventDefault();
										console.log("archived");
										await archiveNotification(props.id);
									}}
								>
									<ArchiveRounded color="white" />
								</IconButton>
							)}

							<IconButton
								onClick={(e) => {
									e.preventDefault();
									if (props.href) router.push(props.href);
								}}
							>
								<ChevronRightRounded color="white" />
							</IconButton>
						</Grid>
					</Grid>
				</Box>
			</Card>
		</Fragment>
	);
}
