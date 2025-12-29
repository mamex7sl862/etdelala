import { useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "full-time",
    category: "",
    deadline: "",
    skillsRequired: "",
    logo: "", // URL for company logo
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const skillsArray = formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await api.post("/jobs", {
        ...formData,
        skillsRequired: skillsArray,
      });

      setMessage(
        "🎉 Job posted successfully! It will be reviewed by admin soon."
      );
      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
        type: "full-time",
        category: "",
        deadline: "",
        skillsRequired: "",
        logo: "",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "Failed to post job. Please try again.";
      setMessage("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-6">
            Post a New Job Opening
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            Reach thousands of qualified candidates across Ethiopia
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`text-center p-8 rounded-3xl text-2xl mb-12 max-w-4xl mx-auto font-bold ${
              message.includes("🎉")
                ? "bg-green-100 text-green-800 border-4 border-green-300"
                : "bg-red-100 text-red-800 border-4 border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-16 space-y-16"
        >
          {/* Title & Logo */}
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Full Stack Developer"
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Company Logo URL (optional)
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              />
              <p className="text-lg text-gray-600 mt-4">
                Paste a direct link to your company logo
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-3xl font-bold text-gray-800 mb-6">
              Full Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="12"
              placeholder="Include responsibilities, requirements, benefits, and company info..."
              className="w-full px-10 py-8 text-xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none"
            />
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Addis Ababa, Remote, etc."
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="50,000 - 80,000 ETB"
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              />
            </div>
          </div>

          {/* Type & Category */}
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Job Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition bg-white"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Job Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition bg-white"
              >
                <option value="">Select Category</option>
                <option value="it">IT & Software</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="finance">Finance & Accounting</option>
                <option value="hr">Human Resources</option>
                <option value="engineering">Engineering</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-3xl font-bold text-gray-800 mb-6">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, AWS, Leadership"
              className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
            />
            <p className="text-lg text-gray-600 mt-4">
              These help our AI match your job with the best candidates
            </p>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-32 py-12 rounded-3xl text-4xl font-bold hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
            >
              {loading ? "Posting Your Job..." : "Publish Job Opening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
