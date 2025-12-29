import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    experience: "",
    education: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        const data = res.data;
        setFormData({
          name: data.name || "",
          skills: data.skills?.join(", ") || "",
          experience: data.experience || "",
          education: data.education || "",
        });
      } catch (err) {
        console.error("Load profile error:", err);
        // If profile doesn't exist, just start with empty form
        setFormData({ name: "", skills: "", experience: "", education: "" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await api.put("/users/jobseeker", formData);
      setMessage(
        "Profile updated successfully! AI recommendations will now be more accurate."
      );
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 p-12 ml-72 text-center py-32">
          <p className="text-3xl text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        <h1 className="text-5xl font-bold mb-12 text-center text-indigo-800">
          Edit Your Profile
        </h1>

        {message && (
          <div
            className={`text-center p-6 rounded-2xl text-2xl mb-12 ${
              message.includes("success")
                ? "bg-green-100 text-green-800 border-2 border-green-300"
                : "bg-red-100 text-red-800 border-2 border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
          <div>
            <label className="block text-2xl font-semibold mb-4">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-8 py-6 text-xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-2xl font-semibold mb-4">
              Skills (comma separated - crucial for AI recommendations)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, JavaScript, Tailwind CSS"
              className="w-full px-8 py-6 text-xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
            />
            <p className="text-gray-600 mt-3 text-lg">
              Example: React, JavaScript, Python, AWS
            </p>
          </div>

          <div>
            <label className="block text-2xl font-semibold mb-4">
              Work Experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="8"
              placeholder="Describe your roles, companies, achievements..."
              className="w-full px-8 py-6 text-xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-2xl font-semibold mb-4">
              Education
            </label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows="5"
              placeholder="Degrees, institutions, graduation years..."
              className="w-full px-8 py-6 text-xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-24 py-8 rounded-2xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? "Saving Profile..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
