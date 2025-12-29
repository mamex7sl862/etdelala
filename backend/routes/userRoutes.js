const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const JobSeeker = require("../models/JobSeeker");

const router = express.Router();

// Get job seeker profile
router.get("/profile", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update job seeker profile
router.put("/jobseeker", protect, authorize("jobseeker"), async (req, res) => {
  try {
    const { name, skills, experience, education } = req.body;

    // Convert skills string to array
    const skillsArray = skills
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

    const updatedProfile = await JobSeeker.findOneAndUpdate(
      { user: req.user.id },
      {
        name,
        skills: skillsArray,
        experience,
        education,
      },
      { new: true, upsert: true, runValidators: true } // upsert creates if not exists
    );

    res.json({ msg: "Profile updated successfully", profile: updatedProfile });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Server error updating profile" });
  }
});

module.exports = router;
