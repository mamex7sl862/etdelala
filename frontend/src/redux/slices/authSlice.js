import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { msg: "Registration failed" }
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { msg: "Login failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    loadUserFromToken: (state) => {
      const token = localStorage.getItem("token");
      if (token) {
        state.token = token;
        // You can decode JWT here if needed
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { role: action.payload.role, id: action.payload.userId };
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg;
        alert(action.payload.msg || "Registration failed");
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = { role: action.payload.role, id: action.payload.userId };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.msg;
        alert(action.payload.msg || "Invalid email or password");
      });
  },
});

export const { logout, loadUserFromToken } = authSlice.actions;
export default authSlice.reducer;
