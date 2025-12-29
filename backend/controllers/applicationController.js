const Application = require("../models/Application");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const Notification = require("../models/Notification");

const User = require("../models/User");

// Update application status (Employer action)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const { status } = req.body;

    // Validate status
    const allowed = [
      "applied",
      "shortlisted",
      "rejected",
      "interview",
      "hired",
    ];
    if (!allowed.includes(status))
      return res.status(400).json({ msg: "Invalid status" });

    // Find application
    const application = await Application.findById(id).populate("job");
    if (!application)
      return res.status(404).json({ msg: "Application not found" });

    // Check employer owns the job
    const employer = await Employer.findOne({ user: req.user.id });
    if (!employer) return res.status(403).json({ msg: "Profile not found" });
    if (!application.job.company.equals(employer._id))
      return res.status(403).json({ msg: "Not authorized" });

    application.status = status;
    await application.save();

    await application.populate({
      path: "applicant",
      select: "name email resume",
    });
    await application.populate({ path: "job", select: "title" });

    // Create notification for the applicant (find JobSeeker -> user)
    const applicantProfile = await JobSeeker.findById(
      application.applicant
    ).populate("user");
    if (applicantProfile && applicantProfile.user) {
      const message = `Your application for ${application.job.title} has been ${status}.`;
      const link = `/applications`;
      const notif = await Notification.create({
        user: applicantProfile.user._id,
        message,
        link,
      });

      try {
        if (global.io) {
          global.io
            .to(applicantProfile.user._id.toString())
            .emit("notification", notif);
        }
      } catch (emitErr) {
        console.error("Notification emit error:", emitErr);
      }
    }

    res.json({ msg: "Application updated", application });
  } catch (err) {
    console.error("Update application status error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (!job.approved) {
      return res
        .status(400)
        .json({ msg: "This job is not available for applications" });
    }

    // Find job seeker profile
    const jobSeeker = await JobSeeker.findOne({ user: req.user.id });
    if (!jobSeeker) {
      return res
        .status(400)
        .json({ msg: "Complete your profile before applying" });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: jobSeeker._id,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ msg: "You have already applied for this job" });
    }

    // Create application (use `applicant` to match Application model)
    const application = await Application.create({
      job: jobId,
      applicant: jobSeeker._id,
      resume: jobSeeker.resume || "",
      status: "applied",
    });

    // Add application to job
    job.applications.push(application._id);
    await job.save();

    // Populate for nice response
    await application.populate("job", "title company");
    await application.populate("job.company", "companyName");

    // Notify the employer that a new applicant applied
    try {
      const employerProfile = await Employer.findById(job.company).populate(
        "user"
      );
      if (employerProfile && employerProfile.user) {
        const msg = `New applicant for ${job.title}`;
        const link = `/applications/${job._id}`;
        const notif = await Notification.create({
          user: employerProfile.user._id,
          message: msg,
          link,
        });
        if (global.io)
          global.io
            .to(employerProfile.user._id.toString())
            .emit("notification", notif);
      }
    } catch (notifErr) {
      console.error("Employer notification error:", notifErr);
    }

    res.status(201).json({
      msg: "Application submitted successfully!",
      application,
    });
  } catch (err) {
    console.error("Apply for job error:", err);
    res.status(500).json({ msg: "Server error. Please try again." });
  }
};

// GET applications for a specific job (employer view)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    const employer = await Employer.findOne({ user: req.user.id });
    if (!employer || !job.company.equals(employer._id))
      return res.status(403).json({ msg: "Not authorized" });

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email resume")
      .populate("job", "title")
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err) {
    console.error("Get applications for job error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
