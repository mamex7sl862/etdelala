import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-4xl font-extrabold text-indigo-700">
              ETDELALA
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Jobs in Ethiopia
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link
              to="/jobs"
              className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
            >
              Companies
            </Link>
            <Link
              to="/blog"
              className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
            >
              Career Advice
            </Link>
            <Link
              to="/contact"
              className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  to={`/${user.role}/dashboard`}
                  className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-lg font-medium text-gray-800 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-10 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-md"
                >
                  Post Your CV
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
