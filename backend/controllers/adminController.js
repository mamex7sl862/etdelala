// backend/controllers/adminController.js
const Job = require("../models/Job"); // ← FIXED: Import actual Job model
const User = require("../models/User");

exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    job.approved = true;
    await job.save();

    // Notify employer that their job was approved
    try {
      const Employer = require("../models/Employer");
      const Notification = require("../models/Notification");
      const employerProfile = await Employer.findById(job.company).populate(
        "user"
      );
      if (employerProfile && employerProfile.user) {
        const message = `Your job "${job.title}" has been approved.`;
        const link = `/my-jobs`;
        const notif = await Notification.create({
          user: employerProfile.user._id,
          message,
          link,
        });
        if (global.io)
          global.io
            .to(employerProfile.user._id.toString())
            .emit("notification", notif);
      }
    } catch (notifErr) {
      console.error("Employer approval notification error:", notifErr);
    }

    res.json({ msg: "Job approved successfully" });
  } catch (err) {
    console.error("Approve job error:", err);
    res.status(500).json({ msg: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isVerified = false;
    await user.save();

    res.json({ msg: "User blocked" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ approved: false });

    res.json({ users, jobs, pendingJobs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
