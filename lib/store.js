import { configureStore } from "@reduxjs/toolkit";
import prefReducer from "./slices/prefSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		pref: prefReducer,
	},
});
