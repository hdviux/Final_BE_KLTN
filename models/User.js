const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      default:""
    },
    phone: {
      type: String,
      default:""
    },
    password: {
      type: String,
    },
    address: {
      type: String,
      default:""
    },
    gender: {
      type: Boolean,
    },
    birthday: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    role: {
      type: Number,
      default: 2,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
