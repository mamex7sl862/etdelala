import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { Link } from "react-router-dom";
import api from "../services/api";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/jobs");
        const jobs = res.data.jobs || [];

        // Extract unique companies with job count
        const map = new Map();
        for (const j of jobs) {
          const c = j.company;
          if (!c || !c._id) continue;
          const id = c._id;
          if (!map.has(id)) {
            map.set(id, {
              ...c,
              jobsCount: 1,
            });
          } else {
            map.get(id).jobsCount += 1;
          }
        }

        setCompanies(Array.from(map.values()));
      } catch (err) {
        console.error("Failed loading companies:", err);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <DashboardSidebar />
      <div className="flex-1 p-12 ml-72">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-indigo-800 mb-6">
            Find Companies
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
            Explore top employers hiring on ETDELALA in Ethiopia
          </p>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <p className="text-4xl text-gray-600">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl font-bold text-gray-700 mb-8">
              No companies found yet
            </p>
            <p className="text-2xl text-gray-600 mb-12">
              Companies will appear here once they post jobs
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-20 py-10 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
            >
              Browse All Jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-7xl mx-auto">
              {companies.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition transform hover:scale-105"
                >
                  {/* Header with Logo & Name */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-white">
                    <div className="flex items-center gap-8">
                      <img
                        src={c.logo || "https://via.placeholder.com/100"}
                        alt={c.companyName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div>
                        <h3 className="text-4xl font-extrabold">
                          {c.companyName}
                        </h3>
                        <div className="flex items-center gap-4 mt-4">
                          <span className="bg-white/20 px-6 py-3 rounded-full text-xl font-bold">
                            {c.jobsCount} Job{c.jobsCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-12">
                    <p className="text-xl text-gray-700 leading-relaxed mb-10">
                      {c.description || "No company description available."}
                    </p>

                    <div className="flex justify-between items-center">
                      <Link
                        to={`/jobs?company=${c._id}`}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:shadow-xl transition"
                      >
                        View Open Jobs →
                      </Link>

                      {c.website && (
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-lg font-medium transition"
                        >
                          Visit Website ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-24">
              <Link
                to="/jobs"
                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-24 py-12 rounded-3xl text-3xl font-bold hover:shadow-2xl transition transform hover:scale-105"
              >
                Browse All Jobs
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Companies;
