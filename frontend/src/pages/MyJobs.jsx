import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await api.get("/jobs/my");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
        alert("Failed to load your jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        <h1 className="text-5xl font-bold mb-12 text-center text-indigo-800">
          My Jobs
        </h1>

        {loading ? (
          <p className="text-3xl text-center">Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-3xl text-center text-gray-600">
            No jobs posted yet
          </p>
        ) : (
          <div className="grid gap-10">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-10 rounded-3xl shadow-2xl"
              >
                <h2 className="text-4xl font-bold mb-6">{job.title}</h2>
                <p className="text-2xl text-gray-700 mb-4">
                  Status: {job.approved ? "Approved" : "Pending"}
                </p>
                <p className="text-lg mb-8">
                  Applicants: {job.applications?.length || 0}
                </p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="bg-blue-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-blue-700 transition"
                >
                  View Job
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
