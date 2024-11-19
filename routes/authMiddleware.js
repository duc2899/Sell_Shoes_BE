const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/users"); // Giả sử bạn có model User

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Giải mã token mà không kiểm tra hạn sử dụng
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById({ _id: decoded.id });
    if (!user.token) {
      return res.status(401).json({ message: "Token has expired" });
    }
    // Kiểm tra xem token có hết hạn không
    jwt.verify(token, process.env.SECRET_KEY, async (err) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          // Nếu token đã hết hạn, xóa token trong DB
          await User.findByIdAndUpdate(decoded.id, { $unset: { token: "" } });
          return res.status(401).json({ message: "Token has expired" });
        }
        // Nếu token không hợp lệ
        return res.status(401).json({ message: "Invalid token" });
      }

      // Nếu token hợp lệ, thêm thông tin user vào request
      req.user = decoded;
      next(); // Chỉ gọi next() nếu token hợp lệ
    });
  } catch (error) {
    console.error("Error during token validation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ message: "Forbidden: Admins only" });
  next();
};
