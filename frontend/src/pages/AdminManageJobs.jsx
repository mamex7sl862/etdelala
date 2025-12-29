import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/admin/jobs");
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
        alert("Failed to load jobs for admin");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const approveJob = async (jobId) => {
    try {
      await api.put(`/admin/approve-job/${jobId}`);
      setJobs(
        jobs.map((j) => (j._id === jobId ? { ...j, approved: true } : j))
      );
      alert("Job approved!");
    } catch (err) {
      alert("Error approving job");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        <h1 className="text-5xl font-bold mb-12 text-center text-indigo-800">
          Manage Jobs
        </h1>

        {loading ? (
          <p className="text-center text-3xl">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-3xl text-gray-600">
            No jobs posted yet
          </p>
        ) : (
          <div className="grid gap-10">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-10 rounded-3xl shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-4xl font-bold">{job.title}</h2>
                    <p className="text-2xl text-gray-700 mt-3">
                      {job.company?.companyName || "Company"} •{" "}
                      {job.location || "Remote"}
                    </p>
                  </div>
                  <span
                    className={`px-8 py-4 rounded-full text-white text-2xl font-bold ${
                      job.approved ? "bg-green-500" : "bg-orange-500"
                    }`}
                  >
                    {job.approved ? "APPROVED" : "PENDING"}
                  </span>
                </div>

                <p className="text-lg mb-8">{job.description}</p>

                {!job.approved && (
                  <button
                    onClick={() => approveJob(job._id)}
                    className="bg-green-600 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:bg-green-700"
                  >
                    APPROVE JOB
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageJobs;
