// src/pages/JobList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getJobs } from "../redux/slices/jobSlice";
import JobCard from "../components/JobCard";

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Initialize from query params if present
    const q = searchParams.get("q") || searchParams.get("keyword") || "";
    const company = searchParams.get("company") || null;
    const loc = searchParams.get("location") || "";
    const t = searchParams.get("type") || "";

    if (q) setSearch(q);
    if (loc) setLocation(loc);
    if (t) setType(t);

    const params = {
      keyword: q || search,
      location: loc || location,
      type: t || type,
    };
    if (company) params.company = company;

    dispatch(getJobs(params));
  }, [search, location, type, searchParams, dispatch]);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">Job Listings</h1>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Job title, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Jobs */}
      {loading ? (
        <p className="text-center text-xl">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          No jobs found. Try adjusting filters.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
