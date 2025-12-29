const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JobSeeker = require("../models/JobSeeker");
const Employer = require("../models/Employer");
const Admin = require("../models/Admin");

exports.register = async (req, res) => {
  const { email, password, role, name, companyName } = req.body;

  // BLOCK ADMIN REGISTRATION
  if (role === "admin") {
    return res.status(403).json({ msg: "Admin registration is not allowed" });
  }

  if (!email || !password || !role) {
    return res.status(400).json({ msg: "Email, password, and role required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ email, password, role });
    await user.save();

    let profile;
    if (role === "jobseeker") {
      if (!name)
        return res.status(400).json({ msg: "Name required for job seekers" });
      profile = new JobSeeker({
        user: user._id,
        name,
        skills: [],
        experience: [],
        education: [],
      });
    } else if (role === "employer") {
      if (!companyName)
        return res.status(400).json({ msg: "Company name required" });
      profile = new Employer({
        user: user._id,
        companyName,
        description: "",
        logo: "",
      });
    }
    await profile.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      msg: "Registration successful",
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("🔍 Login attempt for email:", email);
  console.log("🔑 Plain password received:", password);

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email, "Role:", user.role);
    console.log("🔒 Stored hash:", user.password);

    const isMatch = await user.comparePassword(password);
    console.log("⚡ Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful, token generated");

    res.json({
      token,
      role: user.role,
      userId: user._id,
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ msg: "Server error during login" });
  }
};
