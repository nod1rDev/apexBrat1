const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Foydalanuvchi ro'yxatdan o'tkazish
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    const token = jwt.sign(
      { id: user._id, admin: user.adminStatus },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        password: user.password,
        adminStatus: user.adminStatus,
      },
      token,
    });
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

    const token = jwt.sign(
      { id: user._id, admin: user.adminStatus },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,

        password: user.password,
        adminStatus: user.adminStatus,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Foydalanuvchini yangilash
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User topilmadi" });
    }
    res.status(200).json({
      message: "User muvaffaqiyatli yangilandi",
      user: {
        id: user._id,
        username: user.username,
        password: user.password,
        adminStatus: user.adminStatus,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Barcha foydalanuvchilarni olish
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Foydalanuvchini o'chirish
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User topilmadi" });
    }
    res.status(200).json({
      message: "User muvaffaqiyatli o'chirildi",
      deletedUser: {
        id: user._id,
        username: user.username,
        password: user.password,
        adminStatus: user.adminStatus,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
