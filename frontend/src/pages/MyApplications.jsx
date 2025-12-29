import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoleFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      const role = getRoleFromToken();
      if (role && role !== "jobseeker") {
        // Redirect non-jobseekers to their dashboard
        if (role === "employer") navigate("/employer/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/");
        return;
      }
      try {
        const res = await api.get("/applications/my");
        // Safe access: handle both { applications } and direct array
        const appList = res.data.applications || res.data || [];
        setApplications(appList);
      } catch (err) {
        console.error("Error loading applications:", err);
        // If backend returns 403, redirect based on token role
        if (err?.response?.status === 403) {
          const r = getRoleFromToken();
          if (r === "employer") navigate("/employer/dashboard");
          else if (r === "admin") navigate("/admin/dashboard");
          else navigate("/");
          return;
        }
        alert("Failed to load your applications");
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        <h1 className="text-5xl font-bold mb-16 text-center text-indigo-800">
          My Applications
        </h1>

        {loading ? (
          <div className="text-center py-32">
            <p className="text-3xl text-gray-600">
              Loading your applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-4xl font-semibold text-gray-600">
              No applications yet
            </p>
            <p className="text-xl text-gray-500 mt-6">
              Start applying to jobs to track your progress here!
            </p>
            <Link
              to="/jobs"
              className="inline-block mt-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-16 py-8 rounded-2xl text-2xl font-bold hover:shadow-2xl transition transform hover:scale-105"
            >
              Browse Jobs Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 max-w-6xl mx-auto">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition"
              >
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-4xl font-bold mb-4">
                      {app.job?.title || "Job Title"}
                    </h2>
                    <p className="text-2xl text-indigo-600 mb-4">
                      {app.job?.company?.companyName || "Company Name"}
                    </p>
                    <p className="text-xl text-gray-700">
                      📍 {app.job?.location || "Remote"} • 💼{" "}
                      {app.job?.type || "Full-time"}
                    </p>
                  </div>

                  <div
                    className={`px-10 py-6 rounded-2xl text-white text-2xl font-bold ${
                      app.status === "applied"
                        ? "bg-orange-500"
                        : app.status === "shortlisted"
                        ? "bg-green-500"
                        : app.status === "interview"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }`}
                  >
                    {app.status.toUpperCase()}
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="mb-10">
                    <h3 className="text-2xl font-semibold mb-4">
                      Your Cover Letter
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-600">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>

                  <Link
                    to={`/jobs/${app.job?._id}`}
                    className="bg-blue-600 text-white px-12 py-6 rounded-xl text-xl font-bold hover:bg-blue-700 transition"
                  >
                    View Job Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
