const express = require("express");
const {
  signin,
  getUser,
  deleteUser,
  updateRole,
} = require("../controllers/admin.controller");
const { checkSignin, checkAdmin } = require("../middlewares/auth.middleware");
const {
  validatorSignin,
  isValidation,
} = require("../middlewares/check-validators");
const router = express.Router();

router.get("/user", checkSignin, checkAdmin, getUser);

router.post("/signin", validatorSignin, isValidation, signin);

router.post("/role", checkSignin, checkAdmin, updateRole);

router.delete("/:id", checkSignin, checkAdmin, deleteUser);

module.exports = router;
