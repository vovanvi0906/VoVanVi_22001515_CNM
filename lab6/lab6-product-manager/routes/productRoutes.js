const express = require("express");
const router = express.Router();
const { ProductController, upload } = require("../controllers/productController");

router.get("/", ProductController.index);
router.get("/products/create", ProductController.createForm);
router.post("/products", upload.single("url_image"), ProductController.create);
router.get("/products/:id", ProductController.detail);
router.get("/products/:id/edit", ProductController.editForm);
router.put("/products/:id", upload.single("url_image"), ProductController.update);
router.delete("/products/:id", ProductController.delete);

module.exports = router;