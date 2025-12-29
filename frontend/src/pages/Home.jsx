import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import HeroImg from "../assets/hero.svg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-500 to-indigo-700 text-white py-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl font-extrabold mb-8 leading-tight">
                Find Your Next Job in Ethiopia
              </h1>
              <p className="text-2xl mb-12 opacity-90">
                Connect with thousands of employers and discover opportunities
                across all sectors
              </p>

              <SearchBox />

              <p className="mt-8 text-lg opacity-80">
                Popular searches: Accounting · IT · Engineering · Marketing ·
                Sales · Banking
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white rounded-3xl shadow-2xl p-12">
                <img
                  src="https://www.shutterstock.com/image-photo/crop-ethiopian-colleagues-smart-casual-260nw-2297287495.jpg"
                  alt="Professional job search in Ethiopia"
                  className="max-w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" className="w-full">
            <path
              fill="#f3f4f6"
              d="M0,100L48,120C96,140,192,180,288,170C384,160,480,100,576,80C672,60,768,80,864,100C960,120,1056,140,1152,130C1248,120,1344,80,1392,60L1440,40L1440,200L0,200Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-indigo-800 mb-6">
            Why Job Seekers Love ETDELALA
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Trusted by thousands of professionals across Ethiopia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center hover:shadow-2xl transition">
            <div className="text-7xl mb-8">🔍</div>
            <h3 className="text-3xl font-bold mb-6">Easy Job Search</h3>
            <p className="text-lg text-gray-600">
              Filter by location, salary, experience, and company type
            </p>
          </div>

          <div className="bg-white p-12 rounded-3xl shadow-xl text-center hover:shadow-2xl transition">
            <div className="text-7xl mb-8">🤖</div>
            <h3 className="text-3xl font-bold mb-6">Smart Recommendations</h3>
            <p className="text-lg text-gray-600">
              AI matches jobs to your skills and experience
            </p>
          </div>

          <div className="bg-white p-12 rounded-3xl shadow-xl text-center hover:shadow-2xl transition">
            <div className="text-7xl mb-8">📱</div>
            <h3 className="text-3xl font-bold mb-6">Apply Anywhere</h3>
            <p className="text-lg text-gray-600">
              Submit applications with one click from any device
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Find Your Dream Job?
          </h2>
          <Link
            to="/register"
            className="bg-white text-indigo-700 px-16 py-8 rounded-full text-3xl font-bold hover:bg-gray-100 transition inline-block shadow-2xl"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

function SearchBox() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const doSearch = () => {
    const query = (q || "").trim();
    if (!query) return navigate("/jobs");
    navigate(`/jobs?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white rounded-full shadow-2xl p-3 flex items-center max-w-3xl">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && doSearch()}
        placeholder="Job title, skills, or company"
        className="flex-1 px-8 py-6 text-xl text-gray-800 outline-none rounded-full"
      />
      <button
        onClick={doSearch}
        className="bg-indigo-600 text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-indigo-700 transition"
      >
        Search Jobs
      </button>
    </div>
  );
}
