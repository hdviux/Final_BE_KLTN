const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EvaluateSchema = new Schema(
  {
    oneStar: [
      {
        type: String,
      },
    ],
    twoStar: [
      {
        type: String,
      },
    ],
    threeStar: [
      {
        type: String,
      },
    ],
    fourStar: [
      {
        type: String,
      },
    ],
    fiveStar: [
      {
        type: String,
      },
    ],
    avgEvaluate: {
      type: Number,
      default:0.00
    },
    totalCount: {
      type: Number,
      default:0
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Evaluate = mongoose.model("Evaluate", EvaluateSchema);
module.exports = Evaluate;
