const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, require: true },
      subtotal: { type: Number, require: true },
      _id: false,
    },
  ],
  total: { type: Number },
});

module.exports = mongoose.model("Cart", CartSchema);
