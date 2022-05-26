const User = require("../models/User");
const bcrypt = require("bcryptjs");
const UpdateUser = async (req, res, next) => {
  try {
    const newUser = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findUser = await User.findByIdAndUpdate(foundUser._id, newUser);
    const result = await User.findOne({ _id: findUser._id });
    return res.json({
      success: true,
      message: "Update User Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const FindUserByID = async (req, res, next) => {
  try {
    const result = await User.findOne({ _id: req.userID });
    if (!result)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    return res.json({
      success: true,
      message: "Find User Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const FindUserByIDInComment = async (req, res, next) => {
  try {
    const { userID } = req.body;
    const result = await User.findOne({ _id: userID });
    if (result) {
      return res.json({
        status: 200,
        message: "Find User Success!!!",
        result,
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        message: "Find User Success!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const UpdateUserRole = async (req, res, next) => {
  try {
    const { userID, role } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (foundUser.role === 1) {
      await User.findByIdAndUpdate(userID, { role: role });
      const result = await User.findOne({ _id: userID });
      return res.json({
        success: true,
        message: "Update User Success!!!",
        result,
      });
    }
    if (foundUser.role !== 1) {
      return res.json({
        success: false,
        message: "Update User Fail!!!",
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetAllUser = async (req, res, next) => {
  try {
    const result = await User.find({});
    return res.json({
      success: true,
      message: "Find User Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });

    const validPassword = await bcrypt.compareSync(
      oldPassword,
      foundUser.password
    );
    if (!validPassword)
      return res.json({
        status: 400,
        message: "Đổi mật khẩu không thành công!!!",
      });
    const hashedNewPassword = await bcrypt.hashSync(newPassword, 10);
    foundUser.password = hashedNewPassword;
    await foundUser.save();
    const result = await User.findOne({ _id: req.userID });
    return res.json({
      status: 200,
      message: "Đổi mật khẩu thành công!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const AdminUpdateUserPassword = async (req, res, next) => {
  try {
    const { userID, newPassword } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (foundUser.role === 1) {
      const foundUser2 = await User.findOne({ _id: userID });
      const hashedNewPassword = await bcrypt.hashSync(newPassword, 10);
      foundUser2.password = hashedNewPassword;
      await foundUser2.save();
      const result = await User.findOne({ _id: userID });
      return res.json({
        status: 200,
        message: "Đổi mật khẩu thành công!!!",
        result,
      });
    }
    if (foundUser !== 1) {
      return res.json({
        message: "Đổi mật khẩu không thành công!!!",
      });
    }
  } catch (error) {
    next(error);
  }
};

const FindUserByNameChar = async (req, res, next) => {
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
    return res.json({
      success: true,
      message: "Find User Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  UpdateUser,
  FindUserByID,
  changePassword,
  GetAllUser,
  UpdateUserRole,
  FindUserByIDInComment,
  AdminUpdateUserPassword,
  FindUserByNameChar,
};
