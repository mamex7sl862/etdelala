import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardSidebar from "../components/DashboardSidebar";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleBlock = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/block-user/${userId}`);
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isVerified: !currentStatus } : u
        )
      );
    } catch (err) {
      alert("Error updating user");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        <h1 className="text-5xl font-bold mb-12 text-center text-indigo-800">
          Manage Users
        </h1>

        {loading ? (
          <p className="text-center text-3xl">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-3xl text-gray-600">
            No users registered yet
          </p>
        ) : (
          <div className="grid gap-8">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white p-8 rounded-2xl shadow-xl flex justify-between items-center"
              >
                <div>
                  <h3 className="text-3xl font-bold">{user.email}</h3>
                  <p className="text-xl text-gray-600">Role: {user.role}</p>
                  <p className="text-lg mt-2">
                    Status:{" "}
                    <span
                      className={
                        user.isVerified ? "text-green-600" : "text-red-600"
                      }
                    >
                      {user.isVerified ? "Active" : "Blocked"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => toggleBlock(user._id, user.isVerified)}
                  className={`px-10 py-5 rounded-xl text-xl font-bold text-white ${
                    user.isVerified ? "bg-red-600" : "bg-green-600"
                  } hover:opacity-90 transition`}
                >
                  {user.isVerified ? "Block User" : "Unblock User"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;
