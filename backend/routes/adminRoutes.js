const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const Job = require("../models/Job");
const User = require("../models/User");

const router = express.Router();

// Get all users for admin panel
router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Hide password
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ msg: "Error fetching users" });
  }
});

// Get all jobs for admin panel (including pending)
router.get("/jobs", protect, authorize("admin"), async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("company", "companyName")
      .sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    console.error("Get admin jobs error:", err);
    res.status(500).json({ msg: "Error fetching jobs" });
  }
});

const { approveJob } = require("../controllers/adminController");

// Approve job
router.put("/approve-job/:id", protect, authorize("admin"), approveJob);

// Block/Unblock user
router.put("/block-user/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ msg: `User ${user.isVerified ? "unblocked" : "blocked"}` });
  } catch (err) {
    res.status(500).json({ msg: "Error updating user" });
  }
});

// Stats
router.get("/stats", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ approved: false });

    res.json({ users, jobs, pendingJobs });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching stats" });
  }
});

module.exports = router;
