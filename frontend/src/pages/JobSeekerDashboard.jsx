import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedJobs } from "../redux/slices/jobSlice";
import JobCard from "../components/JobCard";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";

const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const { recommendedJobs, loading, error } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(getRecommendedJobs());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-6">
            Welcome Back, Job Seeker!
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            Discover personalized job opportunities tailored just for you
          </p>
        </div>

        {/* AI Recommendations Title */}
        <h2 className="text-5xl font-bold mb-16 text-center text-indigo-700">
          AI-Recommended Jobs for You
        </h2>

        {loading ? (
          <div className="text-center py-32">
            <p className="text-4xl text-gray-600 font-medium">
              Finding the best jobs for you...
            </p>
            <div className="mt-12 text-6xl animate-pulse">🔍</div>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-4xl text-red-600 font-bold mb-8">
              Failed to load recommendations
            </p>
            <p className="text-xl text-gray-600">
              Please try refreshing the page
            </p>
          </div>
        ) : recommendedJobs.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl font-bold text-gray-700 mb-8">
              No recommendations yet
            </p>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Complete your profile with your skills and experience to get
              personalized AI-powered job matches!
            </p>
            <Link
              to="/profile/edit"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
            >
              Update Your Profile Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {recommendedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

        {/* Bottom CTA for more jobs */}
        {recommendedJobs.length > 0 && (
          <div className="text-center mt-24">
            <Link
              to="/jobs"
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
            >
              Browse All Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
