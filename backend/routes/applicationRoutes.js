const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");

const router = express.Router();
const { updateStatus } = require("../controllers/applicationController");

/**
 * @desc    Job Seeker applies for a job
 * @route   POST /api/applications/:jobId
 * @access  Private (Job Seeker)
 */
router.post("/:jobId", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { coverLetter } = req.body || {};

    // Find job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (!job.approved) {
      return res
        .status(400)
        .json({ msg: "This job is not open for applications" });
    }

    // Find job seeker profile
    const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
    if (!jobSeeker) {
      return res
        .status(400)
        .json({ msg: "Please complete your profile before applying" });
    }

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: jobSeeker._id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "You have already applied for this job" });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: jobSeeker._id,
      coverLetter: coverLetter || "",
      resume: jobSeeker.resume || "",
      status: "applied",
    });
    await application.save(); // ← Save first

    // Add to job applications (optional but good)
    job.applications = job.applications || [];
    job.applications.push(application._id);
    await job.save();

    // Populate after save
    await application.populate([
      { path: "job", select: "title company" },
      { path: "job.company", select: "companyName" },
    ]);

    res.status(201).json({
      msg: "Application submitted successfully!",
      application,
    });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
});

/**
 * @desc    Job Seeker - Get my applications
 * @route   GET /api/applications/my
 * @access  Private (Job Seeker)
 */
router.get("/my", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
    if (!jobSeeker) return res.json({ applications: [] });

    const applications = await Application.find({ applicant: jobSeeker._id })
      .populate({
        path: "job",
        select: "title company location type salary",
        populate: { path: "company", select: "companyName" },
      })
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.error("Get my applications error:", err);
    res.status(500).json({ msg: "Error fetching applications" });
  }
});

/**
 * @desc    Employer - Get applicants for my jobs
 * @route   GET /api/applications
 * @access  Private (Employer)
 */
router.get("/", protect, authorize("employer"), async (req, res) => {
  try {
    const employer = await Employer.findOne({ user: req.user.id });
    if (!employer) return res.status(404).json({ msg: "Profile not found" });

    const jobs = await Job.find({ company: employer._id });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email resume")
      .populate("job", "title")
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.error("Get employer applications error:", err);
    res.status(500).json({ msg: "Error fetching applicants" });
  }
});

// Employer updates an application status
router.put("/:id/status", protect, authorize("employer"), updateStatus);

// Get applications for a specific job (Employer)
const {
  getApplicationsForJob,
} = require("../controllers/applicationController");
router.get(
  "/job/:jobId",
  protect,
  authorize("employer"),
  getApplicationsForJob
);

module.exports = router;
