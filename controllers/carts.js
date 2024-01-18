const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || !cart.items.length)
      return res.json({ msg: "Cart is empty..." });
    return res.json(cart);
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    if (req.user.isAdmin)
      return res.json({ msg: "Unable to perform this action!" });

    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    const cart = await Cart.findOne({ user: req.user._id });

    if (quantity > product.quantity)
      return res.json({ msg: "Stock limit exceeded!" });

    if (!cart) {
      const myCart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity,
            subtotal: parseFloat(product.price) * parseInt(quantity),
          },
        ],
        total: parseFloat(product.price) * parseInt(quantity),
      });

      myCart.save();
      return res.json({ msg: "Added to cart!", cart: myCart });
    } else if (cart) {
      const foundItem = cart.items.find(
        (item) => item.product._id == productId
      );

      if (!foundItem) {
        cart.items.push({
          product: productId,
          quantity,
          subtotal: parseFloat(product.price) * parseInt(quantity),
        });
        cart.total += product.price * quantity;
      } else if (foundItem) {
        let total = 0;
        foundItem.quantity += parseInt(quantity);

        if (foundItem.quantity > product.quantity)
          return res.json({ msg: "Stock limit exceeded!" });
        foundItem.subtotal = foundItem.quantity * product.price;
        cart.items.map((item) => (total += item.subtotal));
        cart.total = total;
      }
      cart.save();
      return res.json({ msg: "Added to cart!", cart });
    }
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    let total = 0;

    cart.items = cart.items.filter((item) => item.product._id != req.params.id);
    cart.items.map((item) => (total += item.subtotal));
    cart.total = total;
    await cart.save();
    return res.json({ msg: "Removed from cart!", cart });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ msg: "Cart is already empty!" });
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.json({ msg: "Cart has been deleted!" });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

module.exports = router;
