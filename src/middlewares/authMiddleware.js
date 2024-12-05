const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    // Authorization headerini olish
    const token = req.header('Authorization');
    
    // Agar token mavjud bo'lmasa, xatolik qaytarish
    if (!token) return res.status(401).json({ message: 'Token kerak' });

    // Tokenni "Bearer" dan ajratib olish
    const tokenWithoutBearer = token.replace('Bearer ', '');

    try {
        // Tokenni dekodlash
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded;  // Foydalanuvchi ma'lumotlarini req.user ga saqlash
        next();  // Keyingi middleware yoki route handlerga o'tish
    } catch (error) {
        // Agar tokenni tekshirishda xatolik bo'lsa
        res.status(400).json({ message: 'Tokenni tekshirishda xatolik' });
    }
};
