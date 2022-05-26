const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema(
  {
    quantity: {
      type: Number,
    },
    uniCost: {
      type: Number,
    },
    totalMoney: {
      type: Number,
    },
    orderID: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);
module.exports = OrderDetail;
