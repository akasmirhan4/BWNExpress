import { Check } from "@mui/icons-material";
import { Stack, Step, StepConnector, stepConnectorClasses, StepLabel, Stepper } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

export default function NewOrderSteppers(props) {
	const steps = ["Acknowledgement", "Order Form", "Permit Application", "Payment", "Summary"];
	return (
		<Stack {...props} sx={{ ...props.sx, width: "100%" }} spacing={4}>
			<Stepper alternativeLabel activeStep={props.activestep} connector={<QontoConnector />}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
		</Stack>
	);
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 10,
		left: "calc(-50% + 16px)",
		right: "calc(50% + 16px)",
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.main,
		},
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.main,
		},
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
		borderTopWidth: 3,
		borderRadius: 1,
	},
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
	color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
	display: "flex",
	height: 22,
	alignItems: "center",
	...(ownerState.active && {
		color: theme.palette.primary.main,
	}),
	"& .QontoStepIcon-completedIcon": {
		color: theme.palette.primary.main,
		zIndex: 1,
		fontSize: 18,
	},
	"& .QontoStepIcon-circle": {
		width: 8,
		height: 8,
		borderRadius: "50%",
		backgroundColor: "currentColor",
	},
}));

function QontoStepIcon(props) {
	const { active, completed, className } = props;

	return (
		<QontoStepIconRoot ownerState={{ active }} className={className}>
			{completed ? <Check className="QontoStepIcon-completedIcon" /> : <div className="QontoStepIcon-circle" />}
		</QontoStepIconRoot>
	);
}
