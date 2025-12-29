const Job = require("../models/Job");
const Employer = require("../models/Employer");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * @desc    Post a new job
 */
exports.postJob = async (req, res) => {
  try {
    const { title, description, location, salary, type, skillsRequired } =
      req.body;

    if (req.user.role !== "employer") {
      return res.status(403).json({ msg: "Only employers can post jobs" });
    }

    const employerProfile = await Employer.findOne({ user: req.user.id });
    if (!employerProfile)
      return res.status(400).json({ msg: "Employer profile not found" });

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : skillsRequired
      ? skillsRequired.split(",").map((s) => s.trim())
      : [];

    const job = await Job.create({
      title,
      description,
      company: employerProfile._id,
      location,
      salary,
      type,
      skillsRequired: skills,
      approved: false,
    });

    if (global.io)
      global.io.emit("newJobPosted", { msg: `New job posted: ${title}` });

    // Notify all admins that a new job was posted and needs approval
    try {
      const admins = await User.find({ role: "admin" }).select("_id");
      const message = `New job posted: ${title} — awaiting approval`;
      for (const a of admins) {
        const link = `/admin/jobs`;
        const notif = await Notification.create({ user: a._id, message, link });
        if (global.io)
          global.io.to(a._id.toString()).emit("notification", notif);
      }
    } catch (notifErr) {
      console.error("Admin notification error:", notifErr);
    }

    res.status(201).json({ msg: "Job posted successfully", job });
  } catch (err) {
    console.error("Post job error:", err);
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @desc    Get all jobs
 */
exports.getJobs = async (req, res) => {
  try {
    // Support filtering via query params: q (or keyword), location, type, company
    const { q, keyword, location, type, company } = req.query || {};
    const filter = { approved: true };

    const search = (q || keyword || "").trim();
    if (search) {
      // match in title, description, and skillsRequired
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { skillsRequired: regex },
      ];
    }

    if (location) {
      filter.location = { $regex: new RegExp(location, "i") };
    }
    if (type) {
      filter.type = type;
    }
    if (company) {
      // company expected to be employer id
      filter.company = company;
    }

    const jobs = await Job.find(filter)
      .populate("company", "companyName logo description")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

/**
 * @desc    Get single job by ID
 */
exports.getJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid job ID" });
  }

  try {
    const job = await Job.findById(id).populate(
      "company",
      "companyName logo description website"
    );

    if (!job) return res.status(404).json({ msg: "Job not found" });
    if (!job.approved && (!req.user || req.user.role === "jobseeker"))
      return res.status(404).json({ msg: "Job not found" });

    res.json({ job });
  } catch (err) {
    console.error("Get single job error:", err);
    res.status(500).json({ msg: "Server error loading job" });
  }
};

/**
 * @desc    Get jobs posted by logged-in employer
 */
exports.getMyJobs = async (req, res) => {
  try {
    const employerProfile = await Employer.findOne({ user: req.user.id });
    if (!employerProfile)
      return res.status(404).json({ msg: "Profile not found" });

    const jobs = await Job.find({ company: employerProfile._id })
      .populate({
        path: "applications",
        select: "applicant status",
        populate: { path: "applicant", select: "name email resume" },
      })
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching jobs" });
  }
};

/**
 * @desc    Edit job
 */
exports.editJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const employer = await Employer.findOne({ user: req.user.id });
    if (!employer || !job.company.equals(employer._id))
      return res.status(403).json({ msg: "Not authorized to edit this job" });

    Object.assign(job, req.body);
    await job.save();

    res.json({ msg: "Job updated successfully", job });
  } catch (err) {
    console.error("Edit job error:", err);
    res.status(500).json({ msg: err.message });
  }
};

/**
 * @desc    Delete job
 */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const employer = await Employer.findOne({ user: req.user.id });
    if (!employer || !job.company.equals(employer._id))
      return res.status(403).json({ msg: "Not authorized to delete this job" });

    await job.deleteOne();
    res.json({ msg: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ msg: err.message });
  }
};
