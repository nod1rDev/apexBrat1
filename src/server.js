const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const videoRoutes = require("./routes/videoRoutes"); // Modul yo‘li to‘g‘rilandi
const userRoutes = require("./routes/userRoutes"); // Modul yo‘li to‘g‘rilandi
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const createDefaultAdmin = require("./utils/createAdmin");


createDefaultAdmin();
dotenv.config();

const app = express();

// CORS konfiguratsiyasi
app.use(cors());

// JSON va URL-encoded ma'lumotlarni o'qish
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 'uploads' papkasini tekshirish va yaratish
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`'uploads' papkasi yaratildi: ${uploadDir}`);
}

// 'uploads' papkasini statik papka sifatida ulash
app.use("/uploads", express.static(uploadDir));

// MongoDB ulanishi
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB ulanishi muvaffaqiyatli"))
  .catch((err) => console.error("MongoDB ulanishida xatolik:", err));

// API yo'nalishlarini qo'shish
app.use("/api/videos", videoRoutes);
app.use("/user", userRoutes);

// Serverni ishga tushurish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlayapti`);
});
