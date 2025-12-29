import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-300 overflow-hidden transform hover:scale-105">
      {/* Header with Title & Remote Badge */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-extrabold leading-tight">{job.title}</h2>
          {job.type?.toLowerCase() === "remote" && (
            <span className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-md">
              REMOTE
            </span>
          )}
        </div>

        <p className="text-2xl font-semibold opacity-95 mt-4">
          {job.company?.companyName || "Company Name"}
        </p>
      </div>

      {/* Body */}
      <div className="p-8">
        <div className="space-y-4 mb-8 text-lg text-gray-700">
          <p className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            {job.location || "Anywhere"}
          </p>
          <p className="flex items-center gap-3">
            <span className="text-2xl">💼</span>
            {job.type || "Full-time"}
          </p>
          {job.salary && (
            <p className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              {job.salary}
            </p>
          )}
          <p className="flex items-center gap-3 text-gray-500">
            <span className="text-xl">📅</span>
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-4">
            {(job.skillsRequired || []).length > 0 ? (
              job.skillsRequired.slice(0, 6).map((skill, i) => (
                <span
                  key={i}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-6 py-3 rounded-full text-lg font-medium shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No specific skills listed</p>
            )}
            {(job.skillsRequired || []).length > 6 && (
              <span className="text-gray-500 text-lg">
                +{job.skillsRequired.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/jobs/${job._id}`}
          className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white py-6 rounded-2xl text-2xl font-bold hover:shadow-2xl transition transform hover:scale-105 shadow-lg"
        >
          View Details & Apply
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
