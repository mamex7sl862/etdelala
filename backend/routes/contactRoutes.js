const express = require("express");
const router = express.Router();
const {
  sendContact,
  listMessages,
  markRead,
  removeMessage,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");

// POST /api/contact
router.post("/", sendContact);

// Admin / debug routes for managing messages
router.get("/", protect, authorize("admin"), listMessages);
router.patch("/:id/read", protect, authorize("admin"), markRead);
router.delete("/:id", protect, authorize("admin"), removeMessage);

module.exports = router;
