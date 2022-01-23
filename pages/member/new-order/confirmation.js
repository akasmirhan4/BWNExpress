import { Box, Container, Typography, Button } from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { HomeRounded } from "@mui/icons-material";
import Link from "next/link";

export default function Summary() {
	const router = useRouter();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!loaded) {
			if (!window.sessionStorage.getItem("isAcknowledged")) {
				toast("Redirecting...");
				router.push("acknowledgement");
			} else if (!window.sessionStorage.getItem("success")) {
				toast("Redirecting...");
				console.log({ success: window.sessionStorage.getItem("success") });
				router.push("form");
			} else {
				window.sessionStorage.clear();
			}
			setLoaded(true);
		}
	}, [loaded]);

	return (
		<MemberPageTemplate>
			<Container sx={{ pt: 4 }}>
				<Box
					py={4}
					sx={{ borderWidth: 1, borderStyle: "solid", borderColor: "lightGrey.main", px: { xs: 2, sm: 4, md: 6 }, boxShadow: (theme) => theme.shadows[1] }}
					display={"flex"}
					flexDirection={"column"}
					width={"100%"}
					bgcolor={"white.main"}
					borderRadius={4}
				>
					<Typography fontWeight="bold" variant={"h5"} sx={{ textTransform: "uppercase" }} textAlign={"center"} color="secondaryAccent.main">
						THANK YOU FOR YOUR ORDER!
					</Typography>
					<Typography textAlign={"center"} color="secondaryAccent" sx={{ mt: 2, mb: 4 }}>
						Sit back and relax while we do the hard work for you. Any update we will notify you via push notification.
					</Typography>
					<Box display="flex" justifyContent={"center"}>
						<Link href="/member/dashboard" passHref>
							<Button variant="contained" color="secondary" startIcon={<HomeRounded />}>
								Home
							</Button>
						</Link>
					</Box>
				</Box>
			</Container>
		</MemberPageTemplate>
	);
}
