const Video = require("../models/Video");
const multer = require("multer");
const path = require("path");

// Video faylni yuklash konfiguratsiyasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Fayllar 'uploads' papkasiga saqlanadi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomini vaqt asosida o'zgartirish
  },
});

// Multer sozlamalari
const upload = multer({
  storage,
  limits: {
    fileSize: 400 * 1024 * 1024, // Maksimal fayl hajmi: 400MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "video/mp4",
      "video/mkv",
      "video/x-msvideo", // AVI
      "video/avi",
      "video/x-matroska", // MKV
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Allowed types: MP4, MKV, AVI"));
    }
    cb(null, true);
  },
});

// ** Video yuklash (Create) **
exports.uploadVideo = [
  upload.single("video"), // "video" maydonidan faylni olish
  async (req, res) => {
    const { title, genre, duration, description, imgUrl, releaseDate, rating, isFilm } =
      req.body;

    if (!req.file && isFilm === 'true') {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    // Validate required fields based on isFilm
    const requiredFields = isFilm === 'true' ? ['title', 'genre', 'duration', 'description', 'releaseDate', 'rating'] : ['title', 'description', 'imgUrl'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const filePath = isFilm === 'true' ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    // Convert duration to hours and minutes
    let formattedDuration = '';
    if (duration) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      formattedDuration = `${hours}h ${minutes}m`;
    }

    try {
      const video = await Video.create({
        title,
        genre,
        duration: formattedDuration,
        description,
        imgUrl,
        releaseDate,
        rating,
        isFilm: isFilm === 'true', // Convert to boolean
        filePath,
      });
      res
        .status(201)
        .json({ ok: true, message: "Video successfully uploaded", video });
    } catch (error) {
      console.error("Error saving video:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

// ** Videolarni ko‘rish (Read) **
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ releaseDate: -1 }); // Eng yangi videolar birinchi
    res.status(200).json({ ok: true, videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(400).json({ message: error.message });
  }
};

// ** Video ID orqali video olish (Get By ID) **
exports.getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ ok: true, video });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ** Videoni o‘chirish (Delete) **
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json({ ok: true, message: "Video successfully deleted" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(400).json({ message: error.message });
  }
};

// ** Qidiruv va filtrlash (Search & Filter) **
exports.searchAndFilterVideos = async (req, res) => {
  const { title, genre } = req.query;

  try {
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive qidiruv
    }
    if (genre) {
      query.genre = genre; // To‘g‘ri janr bo‘yicha filtrlash
    }

    const videos = await Video.find(query).sort({ releaseDate: -1 }); // Eng yangi videolar birinchi
    res.status(200).json({ ok: true, videos });
  } catch (error) {
    console.error("Error filtering videos:", error);
    res.status(400).json({ message: error.message });
  }
};
