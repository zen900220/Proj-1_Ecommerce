import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getShippingInfo = createAsyncThunk(
  "shipping/getShippingInfo",
  async (dummy = 0, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/me/shippingInfo");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const setShippingInfo = createAsyncThunk(
  "shipping/setShippingInfo",
  async (details, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.put(
        "/api/v1/me/shippingInfo",
        details,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillShippingState1(state) {
  state.status = "loading";
}

function fillShippingState2(state, action) {
  state.status = "succeeded";
  state.shippingInfo = action.payload.shippingInfo;
}

function fillShippingState3(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    status: "idle",
    shippingInfo: {},
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetShippingState: (state) => {
      state.status = "idle";
      state.shippingInfo = {};
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getShippingInfo.pending, fillShippingState1)
      .addCase(getShippingInfo.fulfilled, fillShippingState2)
      .addCase(getShippingInfo.rejected, fillShippingState3)

      .addCase(setShippingInfo.pending, fillShippingState1)
      .addCase(setShippingInfo.fulfilled, fillShippingState2)
      .addCase(setShippingInfo.rejected, fillShippingState3);
  },
});

export default shippingSlice.reducer;
export const { clearError, resetShippingState } = shippingSlice.actions;
export const shippingState = (state) => state.shipping;
