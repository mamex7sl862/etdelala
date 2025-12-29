require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Admin = require("./models/Admin");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

async function createAdmin() {
  try {
    const email = "admindelala@gmail.com";
    const password = "1234";

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Admin already exists!");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    await user.save();

    // Create Admin profile
    const profile = new Admin({
      user: user._id,
      name: "Mohammed",
    });
    await profile.save();

    console.log("Admin created successfully!");
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
