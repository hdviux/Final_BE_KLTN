const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();
const EmailCodeSchema = new Schema(
  {
    code: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const EmailCode = mongoose.model("EmailCode", EmailCodeSchema);
module.exports = EmailCode;
