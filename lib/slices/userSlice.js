import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
	name: "user",
	initialState: {
		userData: null,
		orders: [],
		transactions: [],
		avatarURL: null,
		notifications: [],
		userExists: false,
		role: "member",
	},
	reducers: {
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
		setUserExists: (state, action) => {
			state.userExists = action.payload;
		},
		setRole: (state, action) => {
			state.role = action.payload;
		},
	},
});

export const { setUserData, setUser, setOrders, setAvatarURL, setTransactions, setNotifications, setUserExists, setRole } = userSlice.actions;

// Selectors
export const selectUserData = (state) => state.user.userData;
export const selectOrders = (state) => state.user.orders;
export const selectAvatarURL = (state) => state.user.avatarURL;
export const selectTransactions = (state) => state.user.transactions;
export const selectNotifications = (state) => state.user.notifications;
export const selectUserExists = (state) => state.user.userExists;
export const selectRole = (state) => state.user.role;

export default userSlice.reducer;
