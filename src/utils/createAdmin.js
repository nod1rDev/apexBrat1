const User = require("../models/User");

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        password: "123",
        adminStatus: true,
      });
      console.log("Default admin yaratildi.");
    } else {
      console.log("Admin allaqachon mavjud.");
    }
  } catch (error) {
    console.error("Default admin yaratishda xatolik:", error.message);
  }
};

module.exports = createDefaultAdmin;
