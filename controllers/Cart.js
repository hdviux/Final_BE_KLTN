const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const AddCart = async (req, res, next) => {
  try {
    const { productID, quantity } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (!productID || !quantity)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const newCart = new Cart({
      productID,
      userID: foundUser._id,
      quantity,
    });
    const result = await newCart.save();
    const findCart = await Cart.find({ productID: result.productID });
    if (findCart.length === 1) {
      return res.json({
        success: true,
        message: "Add New Cart Success!!!",
        result,
      });
    }
    if (findCart.length !== 1) {
      const findProduct = await Product.find({ _id: productID });
      await Cart.findByIdAndUpdate(findCart[0]._id, { quantity: findCart[0].quantity + findCart[1].quantity });
      await Cart.deleteOne({ _id: result._id });
      return res.json({
        success: true,
        message: "Update New Cart Success!!!",
        result: findCart[0],
      });
    }

  } catch (error) {
    next(error);
  }
};

const UpdateCart = async (req, res, next) => {
  try {
    const cartID = req.params.cartID;
    const newCart = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Cart.findByIdAndUpdate(cartID, newCart);
    return res.json({
      success: true,
      message: "Update Cart Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const DeleteCart = async (req, res, next) => {
  try {
    const cartID = req.params.cartID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Cart.deleteOne({ _id: cartID });
    return res.json({
      success: true,
      message: "Delete Cart Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const FindCartByID = async (req, res, next) => {
  try {
    const { cartID } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Cart.findOne({ _id: cartID });
    if (result) {
      return res.json({
        status: 200,
        result,
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const FindCartByProductID = async (req, res, next) => {
  try {
    const { productID, userID } = req.body;
    const result = await Cart.findOne({ productID: productID, userID: userID });
    if (result) {
      return res.json({
        status: 200,
        result,
      });
    }
    if (!result) {
      return res.json({
        status: 400,
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const FindCartByName = async (req, res, next) => {
  try {
    const { productName } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Cart.find({ userID: foundUser._id });
    const listProduct = [];
    for (let index = 0; index < result.length; index++) {
      const findProduct = await Product.findOne({ _id: result[index].productID });
      listProduct.push(findProduct);
    }
    const resultProduct = listProduct.filter((p) => {
      return p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
    })
    const listCart = [];
    for (let index = 0; index < resultProduct.length; index++) {
      const findCart = await Cart.findOne({ productID: resultProduct[index]._id });
      listCart.push(findCart);
    }
    return res.json({
      result: listCart,
    });
  } catch (error) {
    next(error);
  }
};

const FindCartByUserID = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Cart.find({ userID: foundUser._id });
    return res.json({
      success: true,
      message: "Find Cart Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const GetAllCart = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Cart.find({});
    return res.json({
      success: true,
      message: "Get All Cart Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const AddQuantity = async (req, res, next) => {
  try {
    const cartID = req.params.cartID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findCart = await Cart.findOne({ _id: cartID });
    const findProduct = await Product.findOne({ productID: findCart.productID });
    if (findCart.quantity < findProduct.quantity) {
      await Cart.findByIdAndUpdate(cartID, { quantity: findCart.quantity + 1 });
      return res.json({
        success: true,
        message: "Update Cart Success!!!",
        re: findCart.quantity + 1
      });
    }
    if (findCart.quantity >= findProduct.quantity) {
      await Cart.findByIdAndUpdate(cartID, { quantity: findProduct.quantity });
      return res.json({
        success: true,
        message: "Update Cart Success!!!",
      });
    }

  } catch (error) {
    next(error);
  }
};

const RemoveQuantity = async (req, res, next) => {
  try {
    const cartID = req.params.cartID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findCart = await Cart.findOne({ _id: cartID });
    const findProduct = await Product.findOne({ productID: findCart.productID });
    if (findCart.quantity <= findProduct.quantity && findCart.quantity !== 1) {
      await Cart.findByIdAndUpdate(cartID, { quantity: findCart.quantity - 1 });
      return res.json({
        success: true,
        message: "Update Cart Success!!!",
        re: findCart.quantity - 1
      });
    }
    if (findCart.quantity === 1) {
      await Cart.findByIdAndUpdate(cartID, { quantity: 1 });
      return res.json({
        success: true,
        message: "Update Cart Success!!!",
      });
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  AddCart,
  UpdateCart,
  DeleteCart,
  FindCartByName,
  FindCartByUserID,
  FindCartByProductID,
  GetAllCart,
  FindCartByID,
  AddQuantity,
  RemoveQuantity
};
