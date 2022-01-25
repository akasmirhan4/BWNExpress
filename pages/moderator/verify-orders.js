import { CheckRounded, CloseRounded } from "@mui/icons-material";
import { Container, Typography, Breadcrumbs, Card, CardContent, CardActions, CardMedia, Button, Box, Grid } from "@mui/material";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "lib/firebase";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";

export default function VerifyOrders() {
	const [pendingOrders, setPendingOrders] = useState([]);

	useEffect(() => {
		onSnapshot(query(collection(firestore, "users"), where("verified.email", "!=", true)), (querySnapshot) => {
			let pendingUsers = [];
			querySnapshot.forEach((doc) => {
				pendingUsers.push(doc.data());
			});
			console.log({ pendingUsers });
			setPendingOrders(pendingUsers);
		});
	}, []);

	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Verify Users</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<PendingUserCard title="Amirrul Kasmirhan" body="01-006697" caption={moment(new Date().getTime()).toNow()} />
					</Grid>
					<Grid item xs={12} md={6}>
						<PendingUserCard title="Amirrul Kasmirhan" body="01-006697" caption={moment(new Date().getTime()).toNow()} />
					</Grid>
				</Grid>
			</Container>
		</ModeratorPageTemplate>
	);
}

function PendingUserCard(props) {
	const { title, body, caption, actions } = props;

	return (
		<Card>
			<CardMedia
				component="img"
				sx={{ maxHeight: 256, cursor: "pointer" }}
				src="https://i.guim.co.uk/img/media/352d9ae443605b5f42a41ac0a994fbb8cfdb543f/149_0_3600_2160/master/3600.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=a630d775e0569289250776efe0c2ab56"
				alt="Paella dish"
				onClick={() => {
					window.open(
						"https://i.guim.co.uk/img/media/352d9ae443605b5f42a41ac0a994fbb8cfdb543f/149_0_3600_2160/master/3600.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=a630d775e0569289250776efe0c2ab56",
						"_blank"
					);
				}}
			/>
			<CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
				<Box>
					<Typography gutterBottom variant="h5" component="div">
						{title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{body}
					</Typography>
				</Box>
				<Typography gutterBottom variant="caption" component="div" sx={{ mt: 1 }}>
					{caption}
				</Typography>
			</CardContent>
			<CardActions sx={{ justifyContent: "space-between" }}>
				{actions ?? (
					<Fragment>
						<Box>
							<Button>details</Button>
						</Box>
						<Box>
							<Button startIcon={<CloseRounded />}>decline</Button>
							<Button sx={{ ml: 2 }} startIcon={<CheckRounded />}>
								accept
							</Button>
						</Box>
					</Fragment>
				)}
			</CardActions>
		</Card>
	);
}
