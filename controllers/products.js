const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs"); //Allowing you to read & write on the File System
const path = require("path"); //Allows you to change directories/paths
const multer = require("multer"); //Handles file uploads
const storage = multer.diskStorage({
  //cb stands for callback
  destination: (req, file, cb) => {
    cb(null, "./public"); //Because of fs, the file directory starts from root folder, hence why we use "./public"
  }, //Where to save the images
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }, //Format the filename before storing it
});
const upload = multer({ storage });
const Product = require("../models/Product");

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.json({ msg: "This action is not allowed!", status: 400 });

    const product = new Product(req.body);
    if (req.file) product.image = req.file.filename;
    product.save();
    return res.json({ product, msg: "Product added successfully!" });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (e) {
    return res.status(400).json({
      error: e.message,
      msg: "Something Went Wrong...",
      status: 400,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ msg: "Product not found!", status: 400 });
    return res.json(product);
  } catch (e) {
    return res.status(400).json({
      error: e.message,
      msg: "Something Went Wrong...",
      status: 400,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.json({
        error: e.message,
        msg: "Unable to perform this action!",
        status: 401,
      });

    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ msg: "Product not found!", status: 400 });

    if (product.image) {
      /*
            const filename = product.image;
            const filepath = path.join(__dirname, "../" + filename);
            fs.unlinkSync(filepath);
        */
      const filePath = `./public/${product.image}`;
      fs.unlinkSync(filePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Product deleted successfully!" });
  } catch (e) {
    return res.status(400).json({
      error: e.message,
      msg: "Something Went Wrong...",
      status: 400,
    });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.json({
        error: e.message,
        msg: "Unable to perform this action!",
        status: 401,
      });

    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ msg: "Product not found!", status: 400 });

    if (req.file && product.image) {
      /*
            const filename = product.image;
            const filepath = path.join(__dirname, "../" + filename);
            fs.unlinkSync(filepath);
        */
      const filePath = `./public/${product.image}`;
      fs.unlinkSync(filePath);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file ? req.file.filename : product.image,
      },
      { new: true }
    );

    return res.json({ msg: "Product updated successfully!", updatedProduct });
  } catch (e) {
    return res.status(401).json({
      error: e.message,
      msg: "Something Went Wrong...",
      status: 401,
    });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.json({ msg: "Unable to perform action!", status: 400 });

    let product = await Product.findById(req.params.id);
    if (!product) return res.json({ msg: "Product not found!", status: 400 });

    product.isActive = !product.isActive;

    let updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      product,
      { new: true } //Gives the updated details, not saves it
    );

    return res.json({
      msg: "Product status has been updated!",
      product: updatedProduct,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

module.exports = router;
