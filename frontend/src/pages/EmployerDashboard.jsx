import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    pending: 0,
    applicants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/jobs/my");
        const jobList = res.data.jobs || [];
        setJobs(jobList);

        const totalJobs = jobList.length;
        const pending = jobList.filter((j) => !j.approved).length;
        const applicants = jobList.reduce(
          (sum, j) => sum + (j.applications?.length || 0),
          0
        );
        setStats({ totalJobs, pending, applicants });
      } catch (err) {
        console.error("Error loading dashboard:", err);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-6">
            Employer Dashboard
          </h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            Manage your job postings and connect with top talent in Ethiopia
          </p>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <p className="text-3xl text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-12 mb-24 max-w-6xl mx-auto">
              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <div className="text-7xl mb-8">💼</div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">
                  Total Jobs Posted
                </h3>
                <p className="text-6xl font-extrabold text-blue-600">
                  {stats.totalJobs}
                </p>
              </div>

              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <div className="text-7xl mb-8">⏳</div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">
                  Pending Approval
                </h3>
                <p className="text-6xl font-extrabold text-orange-600">
                  {stats.pending}
                </p>
              </div>

              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <div className="text-7xl mb-8">👥</div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">
                  Total Applicants
                </h3>
                <p className="text-6xl font-extrabold text-green-600">
                  {stats.applicants}
                </p>
              </div>
            </div>

            {/* Quick Action */}
            <div className="text-center mb-20">
              <Link
                to="/post-job"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
              >
                Post a New Job
              </Link>
            </div>

            {/* Recent Jobs */}
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl font-bold mb-16 text-center text-indigo-800">
                Your Recent Job Postings
              </h2>

              {jobs.length === 0 ? (
                <div className="text-center py-32">
                  <p className="text-4xl font-semibold text-gray-600 mb-8">
                    No jobs posted yet
                  </p>
                  <p className="text-xl text-gray-500 mb-12">
                    Start attracting talent by posting your first job opening
                  </p>
                  <Link
                    to="/post-job"
                    className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                  >
                    Post Your First Job
                  </Link>
                </div>
              ) : (
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition transform hover:scale-105"
                    >
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold mb-4 text-indigo-800">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-6 text-lg text-gray-700">
                          <span>📍 {job.location || "Remote"}</span>
                          <span>💼 {job.type || "Full-time"}</span>
                        </div>
                        {job.salary && (
                          <p className="text-lg text-gray-700 mt-3">
                            💰 {job.salary}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-8">
                        <div
                          className={`px-8 py-4 rounded-full text-white text-xl font-bold ${
                            job.approved ? "bg-green-500" : "bg-orange-500"
                          }`}
                        >
                          {job.approved ? "LIVE" : "PENDING APPROVAL"}
                        </div>
                        <p className="text-xl font-semibold text-gray-800">
                          {job.applications?.length || 0} Applicants
                        </p>
                      </div>

                      <Link
                        to={`/jobs/${job._id}`}
                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl text-xl font-bold hover:shadow-xl transition"
                      >
                        View Job & Applicants →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
