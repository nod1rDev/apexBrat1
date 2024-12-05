const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    minlength: [6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"],
  },
});

// Parolni shifrlashdan oldin hash qilish
userSchema.pre("save", async function (next) {
  // Agar parol o‘zgarmagan bo‘lsa, davom etish
  if (!this.isModified("password")) {
    return next();
  }
  try {
    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Kiritilgan parolni tekshirish
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Foydalanuvchi modelini yaratish
const User = mongoose.model("User", userSchema);

module.exports = User;
