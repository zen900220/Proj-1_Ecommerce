import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/v1/product/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const newReview = createAsyncThunk(
  "product/newReview",
  async (reviewData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put("/api/v1/review", reviewData, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillProductState1(state) {
  state.status = "loading";
}

function fillProductState2(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const productSlice = createSlice({
  name: "product",
  initialState: {
    status: "idle",
    product: {},
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProduct: (state) => {
      state.product = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSingleProduct.pending, fillProductState1)
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
      })
      .addCase(fetchSingleProduct.rejected, fillProductState2)

      .addCase(newReview.pending, fillProductState1)
      .addCase(newReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
      })
      .addCase(newReview.rejected, fillProductState2);
  },
});

export default productSlice.reducer;
export const { clearError, resetProduct } = productSlice.actions;
export const productState = (state) => state.product;
