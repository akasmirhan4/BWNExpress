import { Breadcrumbs, Container, Tab, Tabs, Typography } from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import React from "react";
import { useState } from "react";

const Support = ({ navigation, router }) => {
	const [currentTab, setCurrentTab] = useState(0);
	return (
		<MemberPageTemplate>
			<Container>
				<Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
					<Typography color="text.primary">Support</Typography>
				</Breadcrumbs>
				<Tabs value={currentTab} onChange={(_, newTab) => setCurrentTab(newTab)} sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tab label="FAQ" />
					<Tab label="Contact" />
					<Tab label="Report" />
				</Tabs>
				{currentTab === 0 && <FAQ />}
				{currentTab === 1 && <Contact />}
				{currentTab === 2 && <Report />}
			</Container>
		</MemberPageTemplate>
	);
};

const FAQ = () => {
	return (
		<>
			<Typography variant="h4" sx={{ mb: 2 }}>
				FAQ 🛠
			</Typography>
		</>
	);
};

const Contact = () => {
	return (
		<>
			<Typography variant="h4" sx={{ mb: 2 }}>
				Contact 🛠
			</Typography>
		</>
	);
};

const Report = () => {
	return (
		<>
			<Typography variant="h4" sx={{ mb: 2 }}>
				Report 🛠
			</Typography>
		</>
	);
};

export default Support;
