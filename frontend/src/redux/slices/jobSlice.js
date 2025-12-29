import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Use the axios instance with token

// Get list of jobs (with search/filter)
export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async (query = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/jobs", { params: query });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single job by ID
export const getJob = createAsyncThunk(
  "jobs/getJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/jobs/${jobId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get AI-recommended jobs for logged-in job seeker
export const getRecommendedJobs = createAsyncThunk(
  "jobs/getRecommendedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/recommendations/jobs");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// You can add more: postJob, applyJob, etc.

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    job: null,
    recommendedJobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearJob: (state) => {
      state.job = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getJobs
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs || action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getJob
      .addCase(getJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
      })
      .addCase(getJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getRecommendedJobs
      .addCase(getRecommendedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJob } = jobSlice.actions;
export default jobSlice.reducer;
