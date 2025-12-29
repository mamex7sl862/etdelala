const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const { upload } = require("../utils/cloudinary");
// Update profile (jobseeker)
exports.updateJobSeekerProfile = async (req, res) => {
  try {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });
    // Handle resume upload
    if (req.file) {
      const result = await upload.single("resume")(req, res, () => {});
      profile.resume = result.secure_url;
    }
    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
// Similar for employer update, get profiles, etc.
exports.updateEmployerProfile = async (req, res) => {
  // Similar to above, with logo upload
};
// Bookmark job
exports.bookmarkJob = async (req, res) => {
  try {
    const profile = await JobSeeker.findOne({ user: req.user.id });
    if (!profile.savedJobs.includes(req.params.jobId)) {
      profile.savedJobs.push(req.params.jobId);
      await profile.save();
    }
    res.json({ msg: "Job bookmarked" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
