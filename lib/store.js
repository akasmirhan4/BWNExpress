import { configureStore } from "@reduxjs/toolkit";
import prefReducer from "./slices/prefSlice";
import userReducer from "./slices/userSlice";
import newOrderReducer from "./slices/newOrderSlice";

export const store = configureStore({
	reducer: {
		user: userReducer,
		pref: prefReducer,
		newOrder: newOrderReducer,
	},
});
