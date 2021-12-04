import { ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import CustomHead from "components/CustomHead";
import { UserContext } from "lib/context";
import { useUserData } from "lib/hooks";
import { customTheme } from "styles/customTheme";
import "styles/globals.css";

function App({ Component, pageProps }) {
	const userData = useUserData();
	return (
		<UserContext.Provider value={userData}>
			<ThemeProvider theme={customTheme}>
				<CustomHead />
				<Component {...pageProps} />
				<Toaster />
			</ThemeProvider>
		</UserContext.Provider>
	);
}

export default App;
