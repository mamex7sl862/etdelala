const {
  recommendJobs,
  recommendCandidates,
} = require("../utils/aiRecommendations");

exports.getJobRecommendations = async (req, res) => {
  try {
    const jobs = await recommendJobs(req.user.id); // Assuming req.user.id is JobSeeker user id, adjust if needed
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getCandidateRecommendations = async (req, res) => {
  try {
    const candidates = await recommendCandidates(req.params.jobId);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
