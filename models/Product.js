const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  quantity: { type: Number, require: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", ProductSchema); //"Product" is the one connecting to the database table named "Product"
