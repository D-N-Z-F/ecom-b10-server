const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    let order = await Order.find({ user: req.user._id }).populate("user");
    if (!order && !order.length) return res.json({ msg: "No record found!" });
    return res.json(order);
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.json({ msg: "Unable to perform this action!" });
    let orders = await Order.find().populate("user");
    if (!orders && !orders.length) return res.json({ msg: "No record found!" });
    return res.json(orders);
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ msg: "Your cart is empty!" });

    let order = await Order.create({
      user: req.user._id,
      items: cart.items,
      total: cart.total,
    });

    await order.save();
    await Cart.findByIdAndDelete(cart._id);
    return res.json({ msg: "Checkout success!" });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

module.exports = router;
