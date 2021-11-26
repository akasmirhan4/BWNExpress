import { createTheme } from "@mui/material";
import styles from "../styles/main.module.scss";

const customTheme = createTheme({
	typography: {
		fontFamily: ["Montserrat", "sans-serif"].join(","),
		allVariants: {
			color: "#5B5B5B",
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			md2: 1100,
			lg: 1200,
			xl: 1665,
		},
	},
	palette: {
		primary: {
			main: "#F492A6",
		},
		accent: {
			main: "#AADEE9",
		},
		secondary: {
			main: "#FCCB67",
		},
		secondaryAccent: {
			main: "#458FB4",
		},
		white: {
			main: "#FFFFFF",
		},
		offWhite: {
			main: "#F2F2F2",
			secondary: "#F4F4F4",
		},
		lightGrey: {
			main: "#8F8F8F",
			secondary: "#D5D5D5",
		},
		text: {
			main: "#5B5B5B",
			secondary: "#BDB7B7",
		},
		success: {
			main: "#4CBB87",
		},
		border: {
			main: "#A19D9D",
		},
	},
});

export { customTheme };
