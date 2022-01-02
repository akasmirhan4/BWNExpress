import { createSlice } from "@reduxjs/toolkit";
import { auth } from "lib/firebase";

export const userSlice = createSlice({
	name: "user",
	initialState: {
		userData: null,
		user: { uid: auth.currentUser?.uid, emailVerified: auth.currentUser?.emailVerified },
		orders: [],
		transactions: [],
		avatarURL: null,
		notifications: [],
	},
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
		setTransactions: (state, action) => {
			state.transactions = action.payload;
		},
		setAvatarURL: (state, action) => {
			state.avatarURL = action.payload;
		},
		setNotifications: (state, action) => {
			state.notifications = action.payload;
		},
	},
});

export const { setUserData, setUser, setOrders, setAvatarURL, setTransactions, setNotifications } = userSlice.actions;

// Selectors
export const selectUserData = (state) => state.user.userData;
export const selectUser = (state) => state.user.user;
export const selectOrders = (state) => state.user.orders;
export const selectAvatarURL = (state) => state.user.avatarURL;
export const selectTransactions = (state) => state.user.transactions;
export const selectNotifications = (state) => state.user.notifications;

export default userSlice.reducer;
