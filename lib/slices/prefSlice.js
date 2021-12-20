import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	lang: "EN",
};

export const prefSlice = createSlice({
	name: "pref",
	initialState,
	reducers: {
		setLang: (state, action) => {
			state.lang = action.payload;
		},
	},
});

export const { setLang } = prefSlice.actions;

// Selectors
export const selectLang = (state) => state.pref.lang;

export default prefSlice.reducer;