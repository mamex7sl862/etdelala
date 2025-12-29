import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const DashboardSidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authUser = useSelector((state) => state.auth.user);

  const decodeToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      return null;
    }
  };

  const tokenPayload = decodeToken();
  const role = authUser?.role || tokenPayload?.role || "jobseeker";

  const links = {
    jobseeker: [
      { to: "/seeker/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/jobs", label: "Browse Jobs", icon: "🔍" },
      { to: "/profile/edit", label: "Edit Profile", icon: "👤" },
      { to: "/applications", label: "My Applications", icon: "📄" },
    ],
    employer: [
      { to: "/employer/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/post-job", label: "Post a Job", icon: "➕" },
      { to: "/my-jobs", label: "My Jobs", icon: "💼" },
      { to: "/employer/applicants", label: "View Applicants", icon: "👥" },
    ],
    admin: [
      { to: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
      { to: "/admin/jobs", label: "Manage Jobs", icon: "📋" },
      { to: "/admin/users", label: "Manage Users", icon: "👥" },
    ],
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside className="w-80 bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto shadow-2xl z-50">
      {/* Logo & Role */}
      <div className="p-10 text-center border-b border-white/10">
        <h1 className="text-4xl font-extrabold tracking-wide text-white mb-3">
          ETDELALA
        </h1>
        <p className="text-lg opacity-90">
          {role.charAt(0).toUpperCase() + role.slice(1)} Panel
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="p-8 space-y-4">
        {links[role].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-6 py-5 px-8 rounded-2xl text-xl font-medium transition-all duration-300 shadow-lg ${
              path === link.to
                ? "bg-white text-indigo-900 scale-105 shadow-2xl"
                : "hover:bg-white/20 hover:scale-105 hover:shadow-xl"
            }`}
          >
            <span className="text-3xl">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-10 left-8 right-8">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl text-xl font-bold transition shadow-xl hover:shadow-2xl"
        >
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-32 left-8 right-8 text-center text-sm opacity-70">
        <p>© 2025 ETDELALA</p>
        <p className="mt-2">Powered by MERN + AI</p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
