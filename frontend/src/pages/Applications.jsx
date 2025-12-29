import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { jobId } = useParams();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!jobId) return setApplications([]);
        const res = await api.get(`/applications/job/${jobId}`);
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchApplications();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    setApplications((prev) =>
      prev.map((app) => (app._id === appId ? { ...app, status } : app))
    );
  };

  if (loading)
    return (
      <p className="text-center text-3xl py-20">Loading applications...</p>
    );

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-center mb-12">Job Applications</h1>

      {applications.length === 0 ? (
        <p className="text-center text-2xl text-gray-600">
          No applications yet.
        </p>
      ) : (
        <div className="grid gap-8">
          {applications.map((app) => (
            <div key={app._id} className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold">{app.applicant.name}</h3>
                  <p className="text-xl text-gray-600">
                    Applied for: {app.job.title}
                  </p>
                </div>
                <span
                  className={`px-6 py-3 rounded-full text-white font-bold ${
                    app.status === "shortlisted"
                      ? "bg-green-500"
                      : app.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {app.status.toUpperCase()}
                </span>
              </div>

              <p className="text-lg mb-4">
                <strong>Cover Letter:</strong>{" "}
                {app.coverLetter || "No cover letter"}
              </p>

              {app.resume && (
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-lg"
                >
                  Download Resume
                </a>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => updateStatus(app._id, "shortlisted")}
                  className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => updateStatus(app._id, "rejected")}
                  className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
