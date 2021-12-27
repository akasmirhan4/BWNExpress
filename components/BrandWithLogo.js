import { Typography, Box, useTheme } from "@mui/material";
import Logo from "./Logo";
import Image from "next/image";

export default function BrandWithLogo(props) {
	const { logoColor, textColor, logoWidth,fontSize } = props;
	const { palette } = useTheme();
	return (
		<Box {...props} display="inline-flex" alignItems="center">
			<Typography fontFamily="product sans" fontSize={fontSize ?? "2rem"} fontWeight="bold" mr={"0.1em"} color={textColor ?? "#FFFFFF"}>
				bwn
			</Typography>
			<Logo fill={logoColor ?? palette.secondary.main} width={logoWidth} />
			<Typography fontFamily="product sans" fontSize={fontSize ?? "2rem"} fontWeight="bold" ml={"0.1em"} color={textColor ?? "#FFFFFF"}>
				xpress
			</Typography>
		</Box>
	);
}
