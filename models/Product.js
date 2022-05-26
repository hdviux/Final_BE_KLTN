const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
    },
    image: [{
      type: String,
    }],
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    color: [{
      type: String,
    }],
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    brandID: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
