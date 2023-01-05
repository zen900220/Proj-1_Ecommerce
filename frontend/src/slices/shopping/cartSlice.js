import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (dummy = 0, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/me/cart");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (item, thunkAPI) => {
    try {
      const response = await axios.post("/api/v1/me/cart", item, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (item, thunkAPI) => {
    try {
      const response = await axios.put("/api/v1/me/cart", item, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart/deleteFromCart",
  async (prod_id, thunkAPI) => {
    try {
      //? Big warning! axios.delete accepts only url and config no data. So pass all the data needed for deletion in the url as part of req.query
      const response = await axios.delete(
        `/api/v1/me/cart?id=${prod_id}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const resetCart = createAsyncThunk(
  "cart/resetCart",
  async (dummy = 0, thunkAPI) => {
    try {
      await axios.get("/api/v1/me/cart/reset");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillCartState1(state) {
  state.status = "loading";
}

function fillCartState2(state, action) {
  state.status = "succeeded";
  state.contents = action.payload.cart;
}

function fillCartState3(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    status: "idle",
    contents: [],
    success: undefined,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCartState: (state) => {
      state.status = "idle";
      state.error = null;
      state.contents = [];
    },
    resetSuccess: (state) => (state.success = undefined),
  },
  extraReducers(builder) {
    builder
      .addCase(getCart.pending, fillCartState1)
      .addCase(getCart.fulfilled, fillCartState2)
      .addCase(getCart.rejected, fillCartState3)

      .addCase(addToCart.pending, fillCartState1)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contents = action.payload.cart;
        state.success = true;
      })
      .addCase(addToCart.rejected, fillCartState3)

      .addCase(updateCart.pending, fillCartState1)
      .addCase(updateCart.fulfilled, fillCartState2)
      .addCase(updateCart.rejected, fillCartState3)

      .addCase(deleteFromCart.pending, fillCartState1)
      .addCase(deleteFromCart.fulfilled, fillCartState2)
      .addCase(deleteFromCart.rejected, fillCartState3)

      .addCase(resetCart.pending, fillCartState1)
      .addCase(resetCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(resetCart.rejected, fillCartState3);
  },
});

export default cartSlice.reducer;
export const { clearError, resetCartState, resetSuccess } = cartSlice.actions;
export const cartState = (state) => state.cart;
