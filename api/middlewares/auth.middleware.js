const jwt = require("jsonwebtoken");

exports.checkSignin = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(400).json({
      message: "Chưa đăng nhập",
      error: error.name,
    });
  }
};

exports.checkUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "Không phải người dùng" });
  }
  next();
};

exports.checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Không có quyền admin" });
  }
  next();
};
