const User = require("../models/user");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error)
      return res.status(400).json({
        message: "Đã xảy ra lỗi",
      });

    if (user) {
      if (user.authenticate(req.body.password)) {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        const {
          _id,
          firstName,
          lastName,
          phone,
          address,
          email,
          role,
          fullName,
        } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            phone,
            address,
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

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "Tài khoản đã tồn tại",
      });

    const { firstName, lastName, phone, address, email, password } = req.body;
    const _user = new User({
      firstName,
      lastName,
      phone,
      address,
      email,
      password,
      username: shortid.generate(),
    });

    _user.save((error, data) => {
      if (error)
        return res.status(400).json({
          message: "Đã xảy ra lỗi",
        });

      if (data)
        return res.status(201).json({
          message: "Tạo tài khoản thành công",
        });
    });
  });
};

exports.updateUser = (req, res) => {
  const { firstName, lastName, phone, address, email } = req.body;
  const update = { firstName, lastName, phone, address, email };
  User.updateOne({ _id: req.user._id }, update, { new: true }).exec(
    (error, user) => {
      if (error) {
        console.log(error);
        res.status(400).json(error);
      }
      if (user) {
        return res.status(201).json({
          message: "Cập nhật thành công"
        });
      }
    }
  );
};
