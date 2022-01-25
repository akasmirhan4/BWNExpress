import { Container, Typography, Breadcrumbs, Card, CardContent, CardActions, Button, Grid, Skeleton } from "@mui/material";
import ModeratorPageTemplate from "components/ModeratorPageTemplate";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "lib/firebase";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

export default function Dashboard() {
	const [registeredUsers, setRegisteredUsers] = useState(null);
	const [pendingUsers, setPendingUsers] = useState(null);

	useEffect(() => {
		getRegisteredUsers();
		getPendingUsers();
	}, []);

	const getRegisteredUsers = async () => {
		const docs = await getDocs(collection(firestore, "users"));
		setRegisteredUsers(docs.size);
	};

	const getPendingUsers = async () => {
		const docs = await getDocs(query(collection(firestore, "users"), where("verified.email", "!=", true)));
		setPendingUsers(docs.size);
	};

	return (
		<ModeratorPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Dashboard</Typography>
				</Breadcrumbs>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<StatsCard title="Timeline" body={<FinancialTimeline />} />
					</Grid>
					<Grid item xs={12} md={4}>
						<StatsCard
							title="Pending Orders"
							body={100}
							actions={
								<Button size="small" onClick={getRegisteredUsers}>
									Refresh
								</Button>
							}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						{isNaN(registeredUsers) ? (
							<Skeleton variant="rectangular" height={128} />
						) : (
							<StatsCard
								title="Registered Users"
								body={registeredUsers}
								actions={
									<Button size="small" onClick={getRegisteredUsers}>
										Refresh
									</Button>
								}
							/>
						)}
					</Grid>
					<Grid item xs={12} md={4}>
						{isNaN(pendingUsers) ? (
							<Skeleton variant="rectangular" height={128} />
						) : (
							<StatsCard
								title="Pending Verified Users"
								body={pendingUsers}
								actions={
									<Button size="small" onClick={getPendingUsers}>
										Refresh
									</Button>
								}
							/>
						)}
					</Grid>
				</Grid>
			</Container>
		</ModeratorPageTemplate>
	);
}

function FinancialTimeline(props) {
	Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: props.title,
			},
		},
	};

	const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const data = {
		labels,
		datasets: [
			{
				label: "Revenue",
				data: labels.map(() => Math.floor(Math.random() * 1000)),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				tension: 0.5,
			},
			{
				label: "# Orders",
				data: labels.map(() => Math.floor(Math.random() * 100)),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				tension: 0.5,
			},
		],
	};

	return <Line options={options} data={data} />;
}

function StatsCard(props) {
	const { title, body, actions } = props;
	return (
		<Card>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{body}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{title}
				</Typography>
			</CardContent>
			<CardActions sx={{ flexDirection: "row-reverse" }}>{actions}</CardActions>
		</Card>
	);
}
