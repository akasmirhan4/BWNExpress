import { createTheme } from "@mui/material";

const breakpoints = {
	values: {
		xs: 0,
		xs2: 360,
		sm: 600,
		md: 900,
		md2: 1000,
		lg: 1200,
		xl: 1665,
	},
};

const shadows = {
	1: "rgba(0, 0, 0, 0.1) 0px 2px 4px",
	2: "rgba(0, 0, 0, 0.4) 0px 2px 4px",
};

const customTheme = createTheme({
	typography: {
		fontFamily: ["Montserrat", "sans-serif"].join(","),
		allVariants: {
			color: "#5B5B5B",
		},
		h6: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "1rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "0.8rem",
			},
		},
		h5: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "1.3rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "1.1rem",
			},
		},
		h4: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "1.6rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "1.2rem",
			},
		},
		h3: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "2.8rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "2.6rem",
			},
		},
		button: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "1rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "0.8rem",
			},
		},
		caption: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "0.8rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "0.6rem",
			},
		},
		body1: {
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "0.9rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "0.8rem",
			},
		},
		body2: {
			[`@media (max-width: ${breakpoints.values.md2}px)`]: {
				fontSize: "0.8rem",
			},
			[`@media (max-width: ${breakpoints.values.sm}px)`]: {
				fontSize: "0.7rem",
			},
			[`@media (max-width: ${breakpoints.values.xs2}px)`]: {
				fontSize: "0.6rem",
			},
		},
	},
	shadows,
	breakpoints,
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
			main: "#DCDCDC",
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
	components: {
		MuiButton: {
			variants: [
				{
					props: { variant: "contained" },
					style: {
						boxShadow: shadows[1],
						color: "white",
					},
				},
			],
		},
	},
});

export { customTheme };
