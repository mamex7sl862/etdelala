import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, pendingJobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-2xl text-gray-600">
            Manage your job portal with full control
          </p>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <p className="text-3xl text-gray-600">Loading statistics...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-12 mb-20 max-w-6xl mx-auto">
              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <div className="text-7xl mb-6">👥</div>
                <h2 className="text-5xl font-extrabold text-blue-600 mb-4">
                  {stats.users}
                </h2>
                <p className="text-2xl font-semibold text-gray-700">
                  Total Users
                </p>
              </div>

              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <div className="text-7xl mb-6">💼</div>
                <h2 className="text-5xl font-extrabold text-green-600 mb-4">
                  {stats.jobs}
                </h2>
                <p className="text-2xl font-semibold text-gray-700">
                  Total Jobs
                </p>
              </div>

              <div className="bg-white p-12 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition duration-300">
                <div className="text-7xl mb-6">⏳</div>
                <h2 className="text-5xl font-extrabold text-orange-600 mb-4">
                  {stats.pendingJobs || 0}
                </h2>
                <p className="text-2xl font-semibold text-gray-700">
                  Pending Approval
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-indigo-800 mb-12">
                Quick Actions
              </h2>
              <div className="flex justify-center gap-12 flex-wrap">
                <a
                  href="/admin/jobs"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-16 py-8 rounded-2xl text-2xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                >
                  Manage Jobs
                </a>
                <a
                  href="/admin/users"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-16 py-8 rounded-2xl text-2xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                >
                  Manage Users
                </a>
                <a
                  href="/admin/messages"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-16 py-8 rounded-2xl text-2xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                >
                  Manage Messages
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
