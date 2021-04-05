const express = require("express");
const {
  getAllOrder,
  postOrder,
  checkOrder,
  findSells,
} = require("../controllers/order.controller");

const {
  checkSignin,
  checkUser,
  checkAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", checkSignin, checkAdmin, getAllOrder);

router.post("/bill", findSells);

router.post("/", checkSignin, checkUser, postOrder);

router.post("/check-out", checkSignin, checkAdmin, checkOrder);

module.exports = router;
