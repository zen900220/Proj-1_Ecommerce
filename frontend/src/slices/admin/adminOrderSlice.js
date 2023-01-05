import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllOrders = createAsyncThunk(
  "adminOrder/getAllOrders",
  async (dummy = 0, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/admin/orders");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "adminOrder/deleteOrder",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/v1/admin/order/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "adminOrder/updateOrder",
  async (data, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { id, status } = data;
      await axios.put(`/api/v1/admin/order/${id}`, { status }, config);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillAdminOrderState1(state) {
  state.status = "loading";
}

function fillAdminOrderState2(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: {
    status: "idle",
    orders: [],
    order: {},
    totalAmount: 0,
    success: undefined,
    error: null,
  },
  reducers: {
    reset: {
      prepare: (...elements) => {
        return { payload: elements };
      },
      reducer: (state, action) => {
        action.payload.forEach((element) => {
          switch (element) {
            case "status":
              state.status = "idle";
              break;
            case "orders":
              state.orders = [];
              break;
            case "order":
              state.order = {};
              break;
            case "totalAmount":
              state.totalAmount = 0;
              break;
            case "success":
              state.success = undefined;
              break;
            case "error":
              state.error = null;
              break;
            default:
              break;
          }
        });
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllOrders.pending, fillAdminOrderState1)
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(getAllOrders.rejected, fillAdminOrderState2)

      .addCase(deleteOrder.pending, fillAdminOrderState1)
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(deleteOrder.rejected, fillAdminOrderState2)

      .addCase(updateOrder.pending, fillAdminOrderState1)
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(updateOrder.rejected, fillAdminOrderState2);
  },
});

export default adminOrderSlice.reducer;
export const { reset } = adminOrderSlice.actions;
export const adminOrderState = (state) => state.adminOrder;
