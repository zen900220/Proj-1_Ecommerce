import { createSlice } from "@reduxjs/toolkit";

export const errorAlertSlice = createSlice({
  name: "errorAlert",
  initialState: {
    error: null,
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
});

export default errorAlertSlice.reducer;
export const { setError, resetError } = errorAlertSlice.actions;
export const errorAlertState = (state) => state.errorAlert;
