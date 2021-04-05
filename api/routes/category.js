const express = require("express");
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { checkSignin, checkAdmin } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", getCategory);

router.post("/", checkSignin, checkAdmin, createCategory);

router.post("/update", checkSignin, checkAdmin, updateCategory);

router.post("/delete", checkSignin, checkAdmin, deleteCategory);

module.exports = router;
