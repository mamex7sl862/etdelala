import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Companies from "./pages/Companies";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";

import PostJob from "./pages/PostJob";
import ProfileEdit from "./pages/ProfileEdit";
import Applications from "./pages/Applications";

import MyJobs from "./pages/MyJobs";
import ViewApplicants from "./pages/ViewApplicants";
import MyApplications from "./pages/MyApplications";

import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AdminManageJobs from "./pages/AdminManageJobs";
import AdminManageUsers from "./pages/AdminManageUsers";
import AdminMessages from "./pages/AdminMessages";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Job Seeker Routes */}
          <Route path="/seeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/applications" element={<MyApplications />} />

          {/* Employer Routes */}
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/employer/applicants" element={<ViewApplicants />} />
          <Route path="/applications/:jobId" element={<Applications />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/jobs" element={<AdminManageJobs />} />
          <Route path="/admin/users" element={<AdminManageUsers />} />
          <Route path="/admin/messages" element={<AdminMessages />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
