import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllUsers = createAsyncThunk(
  "adminUser/getAllUsers",
  async (dummy = 0, thunkAPI) => {
    try {
      const response = await axios.get("/api/v1/admin/users");
      return response.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "adminOrder/deleteUser",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`/api/v1/admin/user/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminOrder/updateUser",
  async (data, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { id, role } = data;
      await axios.put(`/api/v1/admin/user/${id}`, { role }, config);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.error);
    }
  }
);

function fillAdminUserState1(state) {
  state.status = "loading";
}

function fillAdminUserState2(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

export const adminUserSlice = createSlice({
  name: "adminUser",
  initialState: {
    status: "idle",
    users: [],
    user: {},
    error: null,
    success: undefined,
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
            case "users":
              state.users = [];
              break;
            case "user":
              state.user = {};
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
      .addCase(getAllUsers.pending, fillAdminUserState1)
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
      })
      .addCase(getAllUsers.rejected, fillAdminUserState2)

      .addCase(deleteUser.pending, fillAdminUserState1)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(deleteUser.rejected, fillAdminUserState2)

      .addCase(updateUser.pending, fillAdminUserState1)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.success = true;
      })
      .addCase(updateUser.rejected, fillAdminUserState2);
  },
});

export default adminUserSlice.reducer;
export const { reset } = adminUserSlice.actions;
export const adminUserState = (state) => state.adminUser;
