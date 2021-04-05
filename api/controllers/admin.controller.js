const User = require("../models/user");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

exports.getUser = (req, res) => {
  User.find().exec((error, users) => {
    if (error)
      return res.status(400).json({
        message: "Đã xảy ra lỗi",
      });
    if (users) {
      const userList = users.map((user) => {
        return {
          _id: user._id,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
          email: user.email,
          address: user.address,
        };
      });
      res.status(200).json({
        users: userList,
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error)
      return res.status(400).json({
        message: "Đã xảy ra lỗi",
      });

    if (user) {
      if (user.authenticate(req.body.password) && user.role === "admin") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          message: "Đăng nhập thành công",
          token,
          user: {
            _id,
            lastName,
            email,
            role,
            fullName,
          },
        });
      } else {
        return res.status(400).json({
          message: "Sai mật khẩu",
        });
      }
    } else {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }
  });
};

exports.updateRole = (req, res) => {
  const { id, role } = req.body;
  const update = { role };
  User.findOneAndUpdate({ _id: id }, update, { new: true }).exec(
    (error, result) => {
      if (error) return res.status(400).json({ error });
      if (result)
        return res
          .status(201)
          .json({ message: "Cập nhật quyền người dùng thành công thành công" });
    }
  );
};

exports.deleteUser = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }).exec((error, result) => {
    if (error) return res.status(400).json({ error });
    if (result)
      return res
        .status(200)
        .json({ message: "Xóa người dùng thành công thành công" });
  });
};
