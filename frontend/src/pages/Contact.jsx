import React, { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import api from "../services/api";

const CONTACT_EMAIL = "mohammedshifa800@gmail.com";
const CONTACT_PHONE = "0940034745";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/contact", formData);
      setMessage(res.data.msg || "Thank you! We'll get back to you soon.");
      setPreviewUrl(res.data.previewUrl || null);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact submit error:", err);
      const msg =
        err?.response?.data?.msg || "Failed to send message. Please try again.";
      setMessage(msg);
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-6">
            Contact Us
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            We're here to help! Get in touch with the ETDELALA team
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="text-center p-8 rounded-3xl text-2xl mb-6 max-w-4xl mx-auto bg-green-100 text-green-800 border-4 border-green-300 font-bold">
            <div>{message}</div>
            {previewUrl && (
              <div className="mt-4 text-base">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-indigo-700"
                >
                  Preview test email (Ethereal)
                </a>
              </div>
            )}
          </div>
        )}

        {/* Contact Form */}
        <div className="max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-2xl p-20 space-y-16"
          >
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <label className="block text-3xl font-bold text-gray-800 mb-6">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-3xl font-bold text-gray-800 mb-6">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-3xl font-bold text-gray-800 mb-6">
                Your Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="10"
                placeholder="How can we help you today? Feel free to ask about job postings, account issues, partnerships, or anything else..."
                className="w-full px-10 py-8 text-xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition resize-none"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-32 py-12 rounded-3xl text-4xl font-bold hover:shadow-2xl transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl"
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="text-center mt-24">
            <h2 className="text-4xl font-bold text-indigo-800 mb-12">
              Other Ways to Reach Us
            </h2>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="bg-white p-12 rounded-3xl shadow-xl">
                <div className="text-6xl mb-6">📧</div>
                <h3 className="text-2xl font-bold mb-4">Email</h3>
                <p className="text-xl text-gray-700 ">
                  Email:{" "}
                  <a
                    className="text-indigo-600  underline"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
              <div className="bg-white p-12 rounded-3xl shadow-xl">
                <div className="text-6xl mb-6">📞</div>
                <h3 className="text-2xl font-bold mb-4">Phone</h3>
                <p className="text-xl text-gray-700">
                  Phone:{" "}
                  <a
                    className="text-indigo-600 underline"
                    href={`tel:${CONTACT_PHONE}`}
                  >
                    {CONTACT_PHONE}
                  </a>
                </p>
              </div>
              <div className="bg-white p-12 rounded-3xl shadow-xl">
                <div className="text-6xl mb-6">📍</div>
                <h3 className="text-2xl font-bold mb-4">Office</h3>
                <p className="text-xl text-gray-700">Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
