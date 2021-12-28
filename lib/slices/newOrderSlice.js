import { createSlice } from "@reduxjs/toolkit";

export const newOrderSlice = createSlice({
	name: "newOrder",
	initialState: { data: null, isAcknowledged: false, success: false },
	reducers: {
		setData: (state, action) => {
			state.data = action.payload;
		},
		setIsAcknowledged: (state, action) => {
			state.isAcknowledged = action.payload;
		},
		setSuccess: (state, action) => {
			state.success = action.payload;
		},
	},
});

export const { setData, setIsAcknowledged, setSuccess } = newOrderSlice.actions;

// Selectors
export const selectData = (state) => state.newOrder.data;
export const selectIsAcknowledged = (state) => state.newOrder.isAcknowledged;
export const selectSuccess = (state) => state.newOrder.success;

export default newOrderSlice.reducer;
