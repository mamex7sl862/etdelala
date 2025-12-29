const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const User = require("./models/User");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Start everything
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    // CREATE ADMIN - FORCE FRESH
    await User.deleteMany({ role: "admin" });
    await Admin.deleteMany({});

    const hashed = await bcrypt.hash("123", 10);

    const adminUser = new User({
      email: "admin@jobportal.com",
      password: hashed,
      role: "admin",
    });
    await adminUser.save();

    await new Admin({
      user: adminUser._id,
      name: "Super Administrator",
    }).save();

    console.log("✅ ADMIN READY!");
    console.log("   Email: admin@jobportal.com");
    console.log("   Password: 123");
    console.log("   Login: http://localhost:5173/login");

    // Routes
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/jobs", require("./routes/jobRoutes"));
    app.use("/api/users", require("./routes/userRoutes"));
    app.use("/api/applications", require("./routes/applicationRoutes"));
    app.use("/api/notifications", require("./routes/notificationRoutes"));
    app.use("/api/recommendations", require("./routes/recommendationRoutes"));
    app.use("/api/admin", require("./routes/adminRoutes"));
    app.use("/api/contact", require("./routes/contactRoutes"));

    // Socket.io
    const io = new Server(server, {
      cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
    });
    global.io = io;
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      socket.on("join", (userId) => socket.join(userId));
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup failed:", err);
  }
})();
