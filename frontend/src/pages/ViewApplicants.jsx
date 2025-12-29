import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";

const ViewApplicants = () => {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
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
    const fetchApplicants = async () => {
      const role = getRoleFromToken();
      if (role && role !== "employer") {
        if (role === "jobseeker") navigate("/seeker/dashboard");
        else if (role === "admin") navigate("/admin/dashboard");
        else navigate("/");
        return;
      }

      try {
        const res = await api.get("/applications");
        const list = res.data.applications || res.data || [];
        setApplicants(list);
      } catch (err) {
        console.error("Error loading applicants:", err);
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          navigate("/login");
        } else {
          alert("Failed to load applicants");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [navigate]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
      });
      setApplicants((prev) =>
        prev.map((app) => (app._id === appId ? res.data.application : app))
      );
      alert(
        `Applicant ${
          newStatus === "shortlisted" ? "shortlisted" : "rejected"
        } successfully!`
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <DashboardSidebar />
        <div className="flex-1 p-12 ml-72 text-center py-32">
          <p className="text-4xl text-gray-600">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-6">
            View Applicants
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            Review candidates who applied to your job postings
          </p>
        </div>

        {applicants.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl font-bold text-gray-700 mb-8">
              No applicants yet
            </p>
            <p className="text-2xl text-gray-600 mb-12">
              When candidates apply to your jobs, they will appear here
            </p>
            <a
              href="/post-job"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
            >
              Post a New Job
            </a>
          </div>
        ) : (
          <div className="grid gap-16 max-w-7xl mx-auto">
            {applicants.map((app) => (
              <div
                key={app._id}
                className="bg-white p-16 rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-5xl font-extrabold text-indigo-800 mb-4">
                      {app.applicant?.name || "Candidate"}
                    </h2>
                    <p className="text-2xl text-gray-700 mb-4">
                      📧 {app.applicant?.email || "No email"}
                    </p>
                    <p className="text-2xl text-gray-700">
                      Applied for:{" "}
                      <span className="font-bold">
                        {app.job?.title || "Unknown Job"}
                      </span>
                    </p>
                  </div>

                  <div
                    className={`px-12 py-6 rounded-full text-white text-3xl font-bold shadow-lg ${
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

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div className="mb-12">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6">
                      Cover Letter
                    </h3>
                    <p className="text-xl text-gray-700 leading-relaxed bg-gray-50 p-8 rounded-2xl">
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                {/* Resume */}
                {app.resume && (
                  <div className="mb-12">
                    <a
                      href={app.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-indigo-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-indigo-700 transition shadow-lg"
                    >
                      📄 Download Resume
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-8">
                  {app.status === "applied" && (
                    <>
                      <button
                        onClick={() => updateStatus(app._id, "shortlisted")}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-16 py-8 rounded-2xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                      >
                        Shortlist Candidate
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-16 py-8 rounded-2xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === "shortlisted" && (
                    <button
                      onClick={() => updateStatus(app._id, "interview")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-16 py-8 rounded-2xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                    >
                      Schedule Interview
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicants;
