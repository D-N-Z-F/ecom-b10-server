const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  purchased_date: { type: Date, default: Date.now() },
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

module.exports = mongoose.model("Order", OrderSchema);
