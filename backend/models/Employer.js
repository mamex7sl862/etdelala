const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  logo: { type: String },
});

module.exports = mongoose.model("Employer", employerSchema);
