const mongoose = require("mongoose");

// Foydalanuvchi sxemasi
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Foydalanuvchi nomi kiritilishi shart"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Parol kiritilishi shart"],
  },
  adminStatus: {
    type: Boolean,
    default: false, // Admin bo‘lmasa oddiy user
  },
});

// Adminni tekshirish
userSchema.methods.isAdmin = function () {
  return this.adminStatus;
};

// Foydalanuvchi modelini yaratish
const User = mongoose.model("User", userSchema);

module.exports = User;
