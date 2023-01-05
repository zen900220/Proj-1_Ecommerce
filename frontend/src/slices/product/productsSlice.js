import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  //to pass multiple values to the async func we need to put them in an obj.
  //as the func only allows the frst parameter to hold passed values and 2nd parameter is for Thunk API.
  async (query = {}, thunkAPI) => {
    try {
      const {
        keyword = "",
        page = 1,
        price = [0, 250000],
        category,
        rating = 0,
      } = query;
      //Here it might feel fitting to use try catch to deal with any error thrown by axios. But that shdnt be done.
      //the func created by createAsyncThunk resolves to rejected state when error happens and so if catch swallows that error
      //then the func will always resolve to fulfilled even if axios(or any other statement) throws an error.
      //But if using thunkAPI we can call rejectWithValue in the catch part and that will force reject to happen with the custom error passed to action.payload
      let link = `/api/v1/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`;
      if (category) link = link + `&category=${category}`;
      const response = await axios.get(link);
      return response.data; //response.data contains the data sent back by api and goes into action.payload
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

//when the action creator function is executed and an action is passed to the corresponding reducer/extraReducer,
//the data being returned by the func goes into action.payload. If any error happens it goes into action.error,
//action also has 2 more keys namely "type" n "meta".

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    status: "idle",
    products: [],
    productCount: 0,
    resultsPerPage: 0,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultsPerPage = action.payload.resultsPerPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        //On rejection a error obj is automatically passed to action.error containing name, message, code nd stack.
        //Using thunkAPI's rejectWithValue to generate error messsage sends the error to action.payload instead
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
export const { clearError } = productsSlice.actions;
//This takes state of the app as input nd returns the stae of product slice.
//This is being created n exported frm here so that if the syntax needs to be changed in future
//It needs to be done only here.
export const productsState = (state) => state.products;
