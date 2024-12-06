const express = require("express");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

// Foydalanuvchilar uchun endpointlar
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser); // Userni o'chirish
router.put("/:id", updateUser); // Userni yangilash
router.get("/all", getAllUsers); // Barcha userlarni olish

module.exports = router;
