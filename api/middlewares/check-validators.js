const { check, validationResult } = require("express-validator");

exports.validatorSignup = [
  check("firstName").notEmpty().withMessage("Họ không được được để trống"),
  check("lastName").notEmpty().withMessage("Tên được được để trống"),
  check("email").isEmail().withMessage("Không phải email"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu ít nhất 8 kí tự"),
];

exports.validatorSignin = [
  check("email").isEmail().withMessage("Không phải email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu ít nhất 6 kí tự"),
];

exports.isValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
