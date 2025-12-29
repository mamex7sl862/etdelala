import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    companyName: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      // Auto-login if backend sends token, or dispatch login
      navigate("/"); // or dashboard
    } else {
      alert(result.payload?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-center mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">Full Name</label>
            <input
              name="name"
              type="text"
              required
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength="6"
              onChange={handleChange}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">I am a...</label>
            <select
              name="role"
              onChange={handleChange}
              value={formData.role}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 transition"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer / Company</option>
            </select>
          </div>

          {formData.role === "employer" && (
            <div>
              <label className="block text-lg font-medium mb-2">
                Company Name
              </label>
              <input
                name="companyName"
                type="text"
                required={formData.role === "employer"}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-xl text-xl font-bold hover:shadow-2xl transition transform hover:scale-105"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-lg">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
