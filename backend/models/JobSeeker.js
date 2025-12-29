const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  skills: [String], // Array of strings
  experience: {
    type: String, // ← Changed to String (not array of objects)
    default: "",
  },
  education: {
    type: String, // ← Changed to String
    default: "",
  },
  resume: {
    type: String, // URL from cloudinary
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
