import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAdminProducts = createAsyncThunk(
  "adminProducts/getAdminProducts",
  async (dummy = 0, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/admin/products");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "/api/v1/admin/product/new",
        productData,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/v1/admin/product/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const editProduct = createAsyncThunk(
  "adminProducts/editProduct",
  async (productData, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { id, ...rest } = productData;

      const response = await axios.put(
        `/api/v1/admin/product/${id}`,
        rest,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const getProductReviews = createAsyncThunk(
  "adminProducts/getProductReviews",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(
        `/api/v1/reviews?productId=${productId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "adminProducts/deleteReview",
  async (data, thunkAPI) => {
    try {
      const { id, productId } = data;
      await axios.delete(`/api/v1/reviews?productId=${productId}&id=${id}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillAdminProductsState1(state) {
  state.status = "loading";
}

function fillAdminProductsState2(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState: {
    status: "idle",
    products: [],
    product: {},
    reviews: [],
    success: undefined,
    error: null,
  },
  reducers: {
    //Dont use arrow func without curly braces in reducer as it acts as an implicit return statement.
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = undefined;
    },
    resetProduct: (state) => {
      state.product = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAdminProducts.pending, fillAdminProductsState1)
      .addCase(getAdminProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
      })
      .addCase(getAdminProducts.rejected, fillAdminProductsState2)

      .addCase(createProduct.pending, fillAdminProductsState1)
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
        state.success = true;
      })
      .addCase(createProduct.rejected, fillAdminProductsState2)

      .addCase(deleteProduct.pending, fillAdminProductsState1)
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(deleteProduct.rejected, fillAdminProductsState2)

      .addCase(editProduct.pending, fillAdminProductsState1)
      .addCase(editProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.product = action.payload.product;
        state.success = true;
      })
      .addCase(editProduct.rejected, fillAdminProductsState2)

      .addCase(getProductReviews.pending, fillAdminProductsState1)
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload.reviews;
      })
      .addCase(getProductReviews.rejected, fillAdminProductsState2)

      .addCase(deleteReview.pending, fillAdminProductsState1)
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(deleteReview.rejected, fillAdminProductsState2);
  },
});

export default adminProductsSlice.reducer;
export const { clearError, resetSuccess, resetProduct } =
  adminProductsSlice.actions;
export const adminProductsState = (state) => state.adminProducts;
