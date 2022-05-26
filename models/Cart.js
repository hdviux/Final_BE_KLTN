const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    quantity: {
      type: Number,
    },
    dateAdd: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
