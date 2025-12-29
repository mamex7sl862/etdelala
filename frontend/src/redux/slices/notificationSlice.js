import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};

export const getJobs = createAsyncThunk("jobs/getJobs", async (query) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
    params: query,
  });
  return res.data;
});

// Similar for getJob, postJob, getRecommendedJobs, etc.

const jobSlice = createSlice({
  name: "jobs",
  initialState: { jobs: [], job: {} },
  extraReducers: (builder) => {
    builder.addCase(getJobs.fulfilled, (state, action) => {
      state.jobs = action.payload.jobs;
    });
  },
});

export default jobSlice.reducer;
