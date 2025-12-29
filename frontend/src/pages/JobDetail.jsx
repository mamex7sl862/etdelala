import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // For bookmark

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job || res.data);
      } catch (err) {
        console.error("Load job error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (applying) return;
    if (!confirm("Submit your application for this job?")) return;

    setApplying(true);
    try {
      await api.post(`/applications/${id}`);
      alert(
        "✅ Application submitted successfully!\nCheck 'My Applications' to track your progress."
      );
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        "Failed to apply. Please ensure you're logged in and have completed your profile.";
      alert("❌ " + msg);
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (saving) return;

    setSaving(true);
    try {
      await api.post(`/users/save-job/${id}`);
      setIsSaved(true);
      alert("💾 Job saved to your profile!");
    } catch (err) {
      alert("Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company?.companyName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("🔗 Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <p className="text-4xl text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-col gap-8">
        <p className="text-5xl text-red-600 font-bold">
          Job not found or pending approval
        </p>
        <Link
          to="/jobs"
          className="bg-indigo-600 text-white px-16 py-8 rounded-3xl text-3xl font-bold hover:bg-indigo-700 transition shadow-2xl"
        >
          ← Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-16 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-6xl font-extrabold mb-6">{job.title}</h1>
                <p className="text-4xl opacity-90 mb-6">
                  {job.company?.companyName || "Company Name"}
                </p>
                <div className="flex flex-wrap gap-10 text-2xl">
                  <span>📍 {job.location || "Remote"}</span>
                  <span>💼 {job.type || "Full-time"}</span>
                  {job.salary && <span>💰 {job.salary}</span>}
                  <span>
                    📅 Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="bg-white/20 hover:bg-white/30 px-6 py-4 rounded-2xl text-xl font-medium transition"
              >
                Share Job 🔗
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-16">
            {/* Skills */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold mb-10 text-indigo-800">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-6">
                {(job.skillsRequired || []).length > 0 ? (
                  job.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-10 py-5 rounded-full text-2xl font-semibold shadow-md"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xl text-gray-600">
                    No specific skills required
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-20">
              <h2 className="text-4xl font-bold mb-10 text-indigo-800">
                Job Description
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.description || "No detailed description provided."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-12 flex-wrap">
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-24 py-10 rounded-3xl text-4xl font-bold hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
              >
                {applying ? "Applying..." : "Apply for this Job"}
              </button>

              <button
                onClick={handleSaveJob}
                disabled={saving || isSaved}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-70"
              >
                {isSaved ? "Saved ✓" : saving ? "Saving..." : "Save Job"}
              </button>
            </div>

            <div className="text-center mt-16">
              <Link
                to="/jobs"
                className="text-indigo-600 hover:text-indigo-800 text-2xl font-medium transition"
              >
                ← Back to All Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
