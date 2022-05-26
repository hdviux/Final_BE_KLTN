const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();
const ContactSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    content: {
      type: String,
    },
    timeSend: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
