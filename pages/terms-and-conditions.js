import { Circle } from "@mui/icons-material";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import LandingFooter from "../components/LandingFooter";
import LandingTopbar from "../components/LandingTopbar";

export default function TermsAndConditions() {
	return (
		<Box display="flex" flexDirection="column">
			<LandingTopbar />
			<Container sx={{ mb: 8, mt: 16 }}>
				<Typography variant="h4" fontWeight="700" my={2}>
					Terms and Conditions
				</Typography>
				<Typography whiteSpace="pre-wrap" lineHeight={2}>
					{
						"Terms of Use\nLast update: 26/11/2021\n\nThese Terms of Use (“Terms of Use” or “Agreement”) shall serve as an agreement that sets forth the terms and conditions which will govern your use of bwnexpress.com website (the “Website”). By accessing the Website, you are automatically considered that you accepted these Terms of Use and any other relevant policies, service terms and notices. If you are unwilling to agree to these Terms of Use, you shall discontinue further use of the Website.\n\nBwnexpress.com, reserves the right at any time to change these Terms of Use, the Website, or the Products and Services (as defined below), including eliminating or discontinuing any content on or feature of the Website, or changing any fees or charges for use of the Website or product or services available on the Website. You can determine when these Terms of Use were last revised by referring to the “Last Updated” legend at the top of these Terms of Use.\n\nBy accepting these Terms of Use, you will be bound as follows:"
					}
				</Typography>
				<Typography whiteSpace="pre-wrap" mt={4} fontWeight="bold">
					{"1.\tGeneral Terms & Condition"}
				</Typography>
				<List>
					{TERMS_GENERAL.map((term, index) => {
						return (
							<ListItem sx={{ alignItems: "flex-start" }} key={index}>
								<Circle sx={{ fontSize: 4, mr: 2, mt: 1.8 }} />
								<ListItemText key={index}>{term}</ListItemText>
							</ListItem>
						);
					})}
				</List>
				<Typography whiteSpace="pre-wrap" mt={4} fontWeight="bold">
					{"2.\tUsers Terms & Conditions"}
				</Typography>
				<List>
					{TERMS_USERS.map((term, index) => {
						return (
							<ListItem sx={{ alignItems: "flex-start" }} key={index}>
								<Circle sx={{ fontSize: 4, mr: 2, mt: 1.8 }} />
								<ListItemText key={index}>{term}</ListItemText>
							</ListItem>
						);
					})}
				</List>
			</Container>
			<LandingFooter />
		</Box>
	);
}

const TERMS_GENERAL = [
	"bwnexpress.com reserves the right to refuse service to anyone.",
	"All pricing structures are reserved for our memberss only. We reserve the right to close, block or shut down any accounts that are created by any individual with a fraudulent intent, our competitors and its employees or affiliates.",
	"At bwnexpress.com, fraud Protection is our top priority. Any fraudulent activity will be reported to the appropriate law enforcement and the authority.",
	"As a bwnexpress.com member, you agree not to use our service for any illegal activities or any unlawful purposes or to bring in contraband.",
	"The estimated delivery date by a seller is not guaranteed by bwnepress.com. The estimate delivery of 4 working days by bwnexpress.com may vary depending on the operation times of the Malaysian and Brunei Darussalam borders, its authorities within the borders and whether there are any un-natural circumstances. The actual time for the package delivery may vary depending on location and the ease of locating the address provided.",
	"The delivery time for any parcels purchased through the Amazon SG service will be with a member within 14 to 30 days of purchase. Members will be notified of when the parcel is with bwnexpress.com.",
	"bwnexpress.com will not be responsible for any non-delivery of goods or products from any seller. Any such issues shall be brought up between member and seller to rectify the situation.",
	"bwnexpress.com shall not be responsible for any goods or products that may have been damaged during transit to our Parcel Collection Centre. bwnexpress.com will notify and provide images of the goods upon receiving to all registered members.",
	"For the Amazon SG service, all information provided is to be accurate and true",
	"It is at the discretion of bwnexpress.com management on whether to proceed with purchase or not, refund will be provided if it is unavailable, out of stock or provider is unable to deliver. Any items that are listed as contraband or restricted, a 20% charge will be incurred when a refund is conducted.",
];

const TERMS_USERS = [
	"Must use a legal name, identification number, address, payment provider and all required information.",
	"Must be over 18 years of age to enjoy the services of bwnexpress.com.",
	"Must not use our service for any illegal activity or violate any law in your country or the country of origin for your goods and products.",
	"All payments must be authorized by your own financial account. No third-party payment is allowed.",
	"If there is a likelihood of a member not responding or acknowledging a delivery, there will be a 15 days storage limit. After the storage time is expired, we will keep the package for an additional 30 days, after that, the package is subjected to be removed from the account permanently.",
	"All abandoned packages will be kept for an additional short period of time and will be disposed of under the discretion of bwnexpress.com’s management.",
	"All packages will be delivered via our available delivery methods that is shown on the dashboard upon login only. No third-party shipping method allowed or otherwise agreed between member and bwnexpress.com.",
	"Any misuse of the forwarding address provided by bwnexpress.com will be tracked and reported to the relevant authorities and a termination of the members registration will take place.",
	"We reserved the right to close or suspend any account at our own discretion due to any fraudulent activities, misuse or any illegal activities. All illegal activities will be reported to the Brunei Darussalam authority and law enforcement.",
	"Any goods that require any Wi-Fi and Bluetooth connectivity will require an AITI permit which is the responsibility of a member. If required, a fee will be incurred to a member for bwnexpress.com to apply on behalf",
	"Members are also to be aware that the Brunei customs has enforced permits to be applied for all make up, skincare, hair care products, henna products, perfume/fragrances, essential oils, food, supplements and books to be applied regardless of quantity. A fee will be applied to members for the permit application.",
	"Members are to provide an accurate description of the goods that require permits in the “Permit Application” tab within the dashboard. Bwnexpress.com will not process any permits if it is not complete, which will result in the parcel not being brought in to Brunei Darussalam.",
	"Any requests through the Amazon SG service, payment will be required by a member to bwnexpress.com’s account by bank transfer. No service will be fulfilled when no payment is received.",
	"For any cancellation requests or refund through bwnexpress.com’s service and the Amazon SG service, a 10% charge will be incurred.",
];
