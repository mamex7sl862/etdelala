const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Job = require("../models/Job");
const JobSeeker = require("../models/JobSeeker");

const router = express.Router();

/**
 * @desc    Get AI recommended jobs for logged-in job seeker
 * @route   GET /api/recommendations/jobs
 * @access  Private (Job Seeker)
 */
router.get("/jobs", protect, async (req, res) => {
  try {
    // Find job seeker profile
    const seeker = await JobSeeker.findOne({ user: req.user.id });

    // If no profile or no skills → return empty array (no crash)
    if (!seeker || !seeker.skills || seeker.skills.length === 0) {
      return res.json([]); // Empty recommendations
    }

    // Simple recommendation: jobs that match any of the seeker's skills
    const jobs = await Job.find({
      approved: true,
      skillsRequired: { $in: seeker.skills },
    })
      .populate("company", "companyName logo description")
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(jobs);
  } catch (err) {
    console.error("Recommendation error:", err);
    // Return empty array instead of 500 crash
    res.json([]);
  }
});

module.exports = router;
