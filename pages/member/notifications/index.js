import {
	AnnouncementOutlined,
	AnnouncementRounded,
	ArchiveRounded,
	BugReportRounded,
	DetailsRounded,
	LocalShippingRounded,
	MoreVertRounded,
} from "@mui/icons-material";
import { Box, Button, Card, CircularProgress, Container, Grid, IconButton, Typography } from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import React, { useState } from "react";
import { cloneElement } from "react";
import styles from "styles/main.module.scss";

export default function Notifications() {
	return (
		<MemberPageTemplate>
			<Container>
				<Box sx={{ display: "flex", justifyContent: "flex-end", my: 4 }}>
					<Button endIcon={<ArchiveRounded />}>See Archive</Button>
				</Box>
				<NotificationCard title="Delivery method required" subtitle="in order to proceed" icon={<AnnouncementRounded />} />
				<NotificationCard />
			</Container>
		</MemberPageTemplate>
	);
}

function NotificationCard(props) {
	const [mouseOver, setMouseOver] = useState(false);
	const Icon = props.icon ? cloneElement(props.icon, { sx: { fontSize: "4rem" }, color: "lightGrey" }) : null;
	return (
		<Card
			onMouseOver={() => setMouseOver(true)}
			onMouseLeave={() => setMouseOver(false)}
			sx={{ cursor: "pointer", mb: 2 }}
			className={mouseOver ? styles.dropShadow2 : styles.dropShadow}
		>
			<Box sx={{ px: 4, py: 2, display: "flex", position: "relative" }}>
				<Box sx={{ bgcolor: "primary.main", width: "4px", height: "100%", position: "absolute", left: 0, top: 0 }} />
				<Grid container spacing={2}>
					<Grid item xs={12} md={1} sx={{ display: "flex", alignItems: "center" }}>
						{Icon ?? <CircularProgress />}
					</Grid>
					<Grid item xs={12} md={7} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
						<Box sx={{ display: "flex", alignItems: "flex-end" }}>
							<Typography fontWeight="bold">{props.title ?? "..."}</Typography>
							<Typography variant="caption" sx={{ ml: 1 }}>
								{props.subtitle}
							</Typography>
						</Box>
						<Typography variant="caption" fontStyle="italic">
							{new Date().toLocaleDateString()}
						</Typography>
					</Grid>
					<Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						<IconButton>
							<ArchiveRounded />
						</IconButton>
						<IconButton>
							<MoreVertRounded />
						</IconButton>
					</Grid>
				</Grid>
			</Box>
		</Card>
	);
}
