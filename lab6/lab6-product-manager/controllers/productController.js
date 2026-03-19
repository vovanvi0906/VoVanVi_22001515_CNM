const ProductModel = require("../models/productModel");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
  }
});

// lọc file ảnh
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) cb(null, true);
  else cb(new Error("Chỉ cho phép upload ảnh jpg, jpeg, png, gif"));
};

const upload = multer({ storage, fileFilter });

class ProductController {
  static async index(req, res) {
    try {
      const products = await ProductModel.getAll();
      res.render("products/index", { products, message: req.query.message || "" });
    } catch (error) {
      res.send("Lỗi lấy danh sách sản phẩm: " + error.message);
    }
  }

  static createForm(req, res) {
    res.render("products/create", { product: null, error: "" });
  }

  static async create(req, res) {
    try {
      const { name, price, unit_in_stock } = req.body;

      if (!name || !price || !unit_in_stock) {
        return res.render("products/create", {
          product: req.body,
          error: "Vui lòng nhập đầy đủ thông tin"
        });
      }

      const product = {
        id: uuidv4(),
        name,
        price: Number(price),
        unit_in_stock: Number(unit_in_stock),
        url_image: req.file ? `/uploads/${req.file.filename}` : ""
      };

      await ProductModel.create(product);
      res.redirect("/?message=Thêm sản phẩm thành công");
    } catch (error) {
      res.send("Lỗi thêm sản phẩm: " + error.message);
    }
  }

  static async detail(req, res) {
    try {
      const product = await ProductModel.getById(req.params.id);
      if (!product) return res.send("Không tìm thấy sản phẩm");
      res.render("products/detail", { product });
    } catch (error) {
      res.send("Lỗi xem chi tiết: " + error.message);
    }
  }

  static async editForm(req, res) {
    try {
      const product = await ProductModel.getById(req.params.id);
      if (!product) return res.send("Không tìm thấy sản phẩm");
      res.render("products/edit", { product, error: "" });
    } catch (error) {
      res.send("Lỗi mở form sửa: " + error.message);
    }
  }

  static async update(req, res) {
    try {
      const { name, price, unit_in_stock } = req.body;
      const oldProduct = await ProductModel.getById(req.params.id);

      if (!oldProduct) return res.send("Sản phẩm không tồn tại");

      let imagePath = oldProduct.url_image;

      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;

        // điểm cộng: xóa ảnh cũ
        if (oldProduct.url_image) {
          const oldFilePath = path.join(__dirname, "..", "public", oldProduct.url_image);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      await ProductModel.update(req.params.id, {
        name,
        price: Number(price),
        unit_in_stock: Number(unit_in_stock),
        url_image: imagePath
      });

      res.redirect("/?message=Cập nhật sản phẩm thành công");
    } catch (error) {
      res.send("Lỗi cập nhật sản phẩm: " + error.message);
    }
  }

  static async delete(req, res) {
    try {
      const product = await ProductModel.getById(req.params.id);

      if (product && product.url_image) {
        const filePath = path.join(__dirname, "..", "public", product.url_image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await ProductModel.delete(req.params.id);
      res.redirect("/?message=Xóa sản phẩm thành công");
    } catch (error) {
      res.send("Lỗi xóa sản phẩm: " + error.message);
    }
  }
}

module.exports = {
  ProductController,
  upload
};