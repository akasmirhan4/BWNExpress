import { ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import CustomHead from "components/CustomHead";

import { customTheme } from "styles/customTheme";
import "styles/globals.css";

import NextNProgress from "nextjs-progressbar";
import { Provider } from "react-redux";
import { store } from "lib/store";

import MiddleComponent from "components/MiddleComponent";

function App({ Component, pageProps }) {
	return (
		<Provider store={store}>
			<ThemeProvider theme={customTheme}>
				<NextNProgress color={customTheme.palette.secondaryAccent.main} />
				<CustomHead />
				<MiddleComponent>
					<Component {...pageProps} />
				</MiddleComponent>
				<Toaster />
			</ThemeProvider>
		</Provider>
	);
}

export default App;
