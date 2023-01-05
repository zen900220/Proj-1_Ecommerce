import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post("/api/v1/order/new", data, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (dummy = 0, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/orders/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/v1/order/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillOrderState1(state) {
  state.status = "loading";
}

function fillOrderState2(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    status: "idle",
    details: [],
    orderById: {},
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOrderState: (state) => {
      state.status = "idle";
      state.details = [];
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, fillOrderState1)
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        //This isnt really useful as we prompt user to go to MyOrders after order confirmation
        //Where getMyOrders is called to populate details with the user's orders.
        state.details.push(action.payload.order);
      })
      .addCase(createOrder.rejected, fillOrderState2)

      .addCase(getMyOrders.pending, fillOrderState1)
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.details = action.payload.orders;
      })
      .addCase(getMyOrders.rejected, fillOrderState2)

      .addCase(getOrderById.pending, fillOrderState1)
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderById = action.payload.order;
      })
      .addCase(getOrderById.rejected, fillOrderState2);
  },
});

export default orderSlice.reducer;
export const { clearError, resetOrderState } = orderSlice.actions;
export const orderState = (state) => state.order;
