const express = require("express");
const {
  createCart,
  getUserCart,
} = require("../controllers/cart.controller");
const { checkSignin, checkUser } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", checkSignin, checkUser, getUserCart);

router.post("/", checkSignin, checkUser, createCart);

module.exports = router;
