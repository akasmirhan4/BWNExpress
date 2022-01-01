import { Box, Container, Typography, Button } from "@mui/material";
import MemberPageTemplate from "components/MemberPageTemplate";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { selectData, selectIsAcknowledged, selectSuccess, setData, setIsAcknowledged, setSuccess } from "lib/slices/newOrderSlice";
import { useRouter } from "next/router";
import { HomeRounded } from "@mui/icons-material";
import Link from "next/link";

export default function Summary() {
	const dispatch = useDispatch();
	const router = useRouter();

	const isAcknowledged = useSelector(selectIsAcknowledged);
	const success = useSelector(selectSuccess);
	const newOrderData = useSelector(selectData);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!loaded) {
			if (!isAcknowledged) {
				toast("Redirecting...");
				router.push("acknowledgement");
			} else if (!newOrderData) {
				toast("Redirecting...");
				router.push("form");
			} else if (!success) {
				toast("Redirecting...");
				router.push("summary");
			} else {
				dispatch(setIsAcknowledged(false));
				dispatch(setData(null));
				dispatch(setSuccess(false));
				setLoaded(true);
			}
		}
	}, [newOrderData, isAcknowledged]);

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
						<Link prefetch={false} href="/member/dashboard" passHref>
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
