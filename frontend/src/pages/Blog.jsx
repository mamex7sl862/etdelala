import React from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        <h1 className="text-4xl font-bold text-indigo-800 mb-8">
          Career Advice
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Helpful articles to grow your career.
        </p>
        <div className="space-y-6">
          <article className="bg-white p-8 rounded-xl shadow">
            Article placeholder
          </article>
          <article className="bg-white p-8 rounded-xl shadow">
            Article placeholder
          </article>
        </div>
        <Link
          to="/register"
          className="inline-block mt-8 bg-indigo-600 text-white px-6 py-3 rounded"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Blog;
