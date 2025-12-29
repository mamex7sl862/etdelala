const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

// GET /api/notifications - get notifications for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ msg: "Error fetching notifications" });
  }
});

// PUT /api/notifications/:id/read - mark notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ msg: "Notification not found" });
    if (notif.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    notif.read = true;
    await notif.save();
    res.json({ msg: "Notification marked read", notif });
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
