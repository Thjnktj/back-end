const express = require("express");
const {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductBySlug,
  findProductByPrice,
} = require("../controllers/product.controller");
const { checkSignin, checkAdmin } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload");
const router = express.Router();

router.get("/", getProduct);

router.get("/:slug", getProductBySlug);

router.post("/find", findProductByPrice)

router.post("/", checkSignin, checkAdmin, upload, createProduct);

router.post("/update", checkSignin, checkAdmin, upload, updateProduct);

router.delete("/:id", checkSignin, checkAdmin, deleteProduct);

module.exports = router;
