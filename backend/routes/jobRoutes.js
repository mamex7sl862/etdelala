const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  postJob,
  getJobs,
  getMyJobs,
  getJob,
  editJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

// Protected employer routes (specific first!)
router.get("/my", protect, authorize("employer"), getMyJobs);
router.post("/", protect, authorize("employer"), postJob);
router.put("/:id", protect, authorize("employer"), editJob);
router.delete("/:id", protect, authorize("employer"), deleteJob);

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

module.exports = router;
