const Comment = require("../models/Comment");
const User = require("../models/User");
const EvaluateController = require("./Evaluate");
const AddComment = async (req, res, next) => {
  try {
    const { content, productID, star } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (!content || !productID)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const newComment = new Comment({
      content,
      userID: foundUser._id,
      productID,
      star,
    });
    const result = await newComment.save();
    return res.json({
      success: true,
      message: "Add New Comment Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const UpdateComment = async (req, res, next) => {
  try {
    const commentID = req.params.commentID;
    const newComment = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Comment.findByIdAndUpdate(commentID, newComment);
    return res.json({
      success: true,
      message: "Update Comment Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const DeleteComment = async (req, res, next) => {
  try {
    const commentID = req.params.commentID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Comment.deleteOne({ _id: commentID });
    return res.json({
      success: true,
      message: "Delete Comment Success!!!",
    });
  } catch (error) {
    next(error);
  }
};
const GetAllCommentProduct = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const result = await Comment.find({ productID: productID });
    if (result) {
      return res.json({
        status: 200,
        message: "Get All Comment Success!!!",
        result: result.sort(function (a, b) {
          return b.timeCreate - a.timeCreate;
        }),
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        message: "Get All Comment Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetAllComment = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Comment.find({});
    return res.json({
      success: true,
      message: "Get All Comment Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const ChangeVote = async (req, res, next) => {
  try {
    const commentID = req.params.commentID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const foundComment = await Comment.findOne({ _id: commentID });
    if (!foundComment)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy bình luận!!!" } });
    let vote = foundComment.vote;
    if (vote.includes(foundUser._id)) {
      vote.remove(foundUser._id);
    } else {
      vote.push(foundUser._id);
    }

    await Comment.findByIdAndUpdate(commentID, {
      vote: vote,
    });
    return res.json({
      success: true,
      message: "Change Comment Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const FindCommentByID = async (req, res, next) => {
  try {
    const { commentID } = req.body;
    const result = await Comment.findOne({ _id: commentID });
    return res.json({
      success: true,
      message: "Get All Comment Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const FindCommentByUserName = async (req, res, next) => {
  try {
    const { userName } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findAllUser = await User.find({});
    const result = findAllUser.filter((p) => {
      return p.userName.toLowerCase().indexOf(userName.toLowerCase()) !== -1;
    });
    let arr = [];
    for (let index = 0; index < result.length; index++) {
      const resultComment = await Comment.find({ userID: result[index]._id });
      for (let index2 = 0; index2 < resultComment.length; index2++) {
        arr.push(resultComment[index2]);
      }
    }
    return res.json({
      success: true,
      message: "Find User Success!!!",
      result: arr,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddComment,
  UpdateComment,
  DeleteComment,
  GetAllComment,
  ChangeVote,
  GetAllCommentProduct,
  FindCommentByID,
  FindCommentByUserName,
};
