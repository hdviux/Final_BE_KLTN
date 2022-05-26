const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userName: {
      type: String,
    },
    userPhone: {
      type: String,
    },
    userAddress: {
      type: String,
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
    dateShipped: {
      type: Date,
    },
    totalMoney: {
      type: Number,
      default: 0.00,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
