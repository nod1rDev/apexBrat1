const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("////////////////////", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB ulanishi muvaffaqiyatli");
  } catch (error) {
    console.error("MongoDB ulanishda xatolik:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
