const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
    },
    timeCreate: {
      type: Date,
      default: Date.now(),
    },
    vote: [
      {
        type: String,
      },
    ],
    star: {
      type: Number,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productID: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
