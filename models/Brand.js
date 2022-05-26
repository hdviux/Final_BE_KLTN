const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
  {
    brandName: {
      type: String,
    },
    nation: {
      type: String,
    },
    image: {
      type: String,
    }
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", BrandSchema);
module.exports = Brand;
