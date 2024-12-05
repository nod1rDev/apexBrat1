const express = require("express");
const {
  uploadVideo,
  getVideos,
  deleteVideo,
  searchAndFilterVideos,
  getVideoById,
} = require("../controllers/videoController");

const router = express.Router();

router.post("/", uploadVideo); // Video yuklash
router.get("/", getVideos); // Barcha videolarni ko‘rish
router.get("/search", searchAndFilterVideos); // Qidiruv va filtrlash
router.get("/:id", getVideoById); // Qidiruv va filtrlash
router.delete("/:id", deleteVideo); // Videoni o‘chirish

module.exports = router;
