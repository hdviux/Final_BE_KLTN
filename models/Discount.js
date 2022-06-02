const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscountSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
    },
    percent: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", DiscountSchema);
module.exports = Discount;
