const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobSeeker",
    required: true,
  },
  coverLetter: { type: String, default: "" },
  resume: { type: String },
  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected", "interview", "hired"],
    default: "applied",
  },
  appliedAt: { type: Date, default: Date.now }, // ← ADD THIS
});

module.exports = mongoose.model("Application", applicationSchema);
