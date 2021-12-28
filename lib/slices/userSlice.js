import { createSlice } from "@reduxjs/toolkit";
import { auth } from "lib/firebase";

export const userSlice = createSlice({
	name: "user",
	initialState: { userData: null, user: { uid: auth.currentUser?.uid, emailVerified: auth.currentUser?.emailVerified }, orders: [] },
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setUserData: (state, action) => {
			state.userData = action.payload;
		},
		setOrders: (state, action) => {
			state.orders = action.payload;
		},
	},
});

export const { setUserData, setUser, setOrders } = userSlice.actions;

// Selectors
export const selectUserData = (state) => state.user.userData;
export const selectUser = (state) => state.user.user;
export const selectOrders = (state) => state.user.orders;

export default userSlice.reducer;
