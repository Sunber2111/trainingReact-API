const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Product = require("../model/product");

// @route    post api/product
// @desc     lấy tất cả sản phẩm
// @access   public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().select("-unitPrice");

    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route    post api/product/:_id
// @desc     lấy sản phẩm theo mã
// @access   public
router.get("/:_id", async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params._id }).select(
      "-unitPrice"
    );
    if (product) res.json(product);
    else res.status(404).json({ msg: "Không Tìm Thấy" });
  } catch (error) {
    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Không Tìm Thấy" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route    delte api/product/:_id
// @desc     xóa sản phẩm theo id
// @access   private
// @auth     admin
router.delete("/:_id", async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params._id }).select(
      "-unitPrice"
    );
    if (product) {
      await Product.findOneAndDelete({ _id: req.params._id });
      return res.status(200).json({ msg: "Xóa Thành Công" });
    } else res.status(404).json({ msg: "Không Tìm Thấy" });
  } catch (error) {
    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Không Tìm Thấy" });
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route    post api/product
// @desc     thêm sản phẩm
// @access   private
// @auth     admin
router.post(
  "/",
  [
    check("name", "Tên Bắt Buộc")
      .not()
      .notEmpty(),

    check("unitPrice")
      .isNumeric()
      .withMessage("Gía Phải Là Số")
      .custom(val => val >= 0)
      .withMessage("Gía phải >= 0"),

    check("priceOnOrder")
      .isNumeric()
      .withMessage("Gía Phải Là Số")
      .custom(val => val >= 0)
      .withMessage("Gía phải >= 0")
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json(error);
    }

    try {
      const { image } = req.body;

      let product = new Product(req.body);

      if (image) {
        let imgURL = `${req.headers.host}/api/images/open_image/${image}`;
        product.image = imgURL;
      }

      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.log(error);

      res.status(500).json({ msg: "Server Error" });
    }
  }
);

// @route    post api/product
// @desc     sửa sản phẩm
// @access   private
// @auth     admin
router.put(
  "/",
  [
    check("name", "Tên Bắt Buộc")
      .not()
      .notEmpty(),
    check("_id", "Mã Sản Phẩm Bắt Buộc ")
      .not()
      .notEmpty()
  ],
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json(error);
    }

    try {
      const {
        name,
        unitPrice,
        priceOnOrder,
        category,
        description,
        image,
        _id
      } = req.body;

      let product = await Product.findOne({ _id });

      if (!product)
        return res.status(404).json({ msg: "Không Tìm Thấy Sản Phẩm Cần Sửa" });

      const productFlields = { name };

      if (unitPrice) productFlields.unitPrice = unitPrice;
      if (priceOnOrder) productFlields.priceOnOrder = priceOnOrder;
      if (category) productFlields.category = category;
      if (description) productFlields.description = description;
      if (image) productFlields.image = image;

      await Product.findOneAndUpdate(
        { _id },
        { $set: productFlields },
        { new: true }
      ).then(product => res.status(202).json(product));
    } catch (error) {
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

module.exports = router;
