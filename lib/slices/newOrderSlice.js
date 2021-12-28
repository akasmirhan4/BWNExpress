import { createSlice } from "@reduxjs/toolkit";

export const newOrderSlice = createSlice({
	name: "newOrder",
	initialState: { data: null, isAcknowledged: false },
	reducers: {
		setData: (state, action) => {
			state.data = action.payload;
		},
		setIsAcknowledged: (state, action) => {
			state.isAcknowledged = action.payload;
		},
	},
});

export const { setData, setIsAcknowledged } = newOrderSlice.actions;

// Selectors
export const selectData = (state) => state.newOrder.data;
export const selectIsAcknowledged = (state) => state.newOrder.isAcknowledged;

export default newOrderSlice.reducer;
