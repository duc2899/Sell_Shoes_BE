const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handelError } = require("../utils/handelError");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!role || !["Admin", "Normal"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either 'Admin' or 'Normal'" });
    }

    // Kiểm tra nếu username đã tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    handelError(err, res);
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );
    user.token = token;
    await user.save();
    res.status(200).json({
      message: "Login successful",
      token,
      userName: user.username,
      role: user.role,
      _id: user._id,
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.logout = async (req, res) => {
  try {
    const { user } = req;
    await User.findByIdAndUpdate(user.id, { $unset: { token: "" } });
    return res.status(200).json({ message: "Logout success" });
  } catch (err) {
    handelError(err, res);
  }
};

exports.setRole = async (req, res) => {
  try {
    const { username, role } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!role || !["Admin", "Normal"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either 'Admin' or 'Normal'" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // setRole and save
    user.role = role;
    await user.save();
    res.status(200).json({
      message: "SetRole successful",
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await User.find().select("-password -token");
    res.status(200).json({
      message: "successful",
      data: accounts,
    });
  } catch (err) {
    handelError(err, res);
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.deleteOne({ username });
    res.status(200).json({
      message: "Delete Account successful",
    });
  } catch (err) {
    handelError(err, res);
  }
};
