import { createSlice } from "@reduxjs/toolkit";

export const newOrderSlice = createSlice({
	name: "newOrder",
	initialState: { data: null },
	reducers: {
		setData: (state, action) => {
			state.data = action.payload;
		},
	},
});

export const { setData } = newOrderSlice.actions;

// Selectors
export const selectData = (state) => state.newOrder.data;

export default newOrderSlice.reducer;
