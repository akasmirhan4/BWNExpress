import { ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import CustomHead from "components/CustomHead";
import { UserContext } from "lib/context";
import { useUserData } from "lib/hooks";
import { customTheme } from "styles/customTheme";
import "styles/globals.css";
import { useEffect, useState } from "react";
import cookieCutter from "cookie-cutter";
import NextNProgress from "nextjs-progressbar";

function App({ Component, pageProps }) {
	const userData = useUserData();
	const [lang, setLang] = useState("EN");

	useEffect(() => {
		setLang(cookieCutter.get("lang") ?? "EN");
	}, [lang]);

	return (
		<UserContext.Provider value={{ ...userData, lang, setLang }}>
			<ThemeProvider theme={customTheme}>
				<NextNProgress color={customTheme.palette.secondaryAccent.main} />
				<CustomHead />
				<Component {...pageProps} />
				<Toaster />
			</ThemeProvider>
		</UserContext.Provider>
	);
}

export default App;
