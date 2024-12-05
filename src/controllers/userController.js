const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Foydalanuvchi ro'yxatdan o'tkazish
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ ok: true, username, password, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Foydalanuvchi login qilish
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !user.password === password) {
      return res.status(401).json({ message: "Noto'g'ri login yoki parol" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ ok: true, username, password, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
