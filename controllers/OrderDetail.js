const OrderDetail = require("../models/OrderDetail");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const AddOrderDetail = async (req, res, next) => {
  try {
    const { quantity, cartID, productID, orderID } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if ((!quantity && !cartID && !productID) || !orderID)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });

    if (productID !== null && cartID === null && quantity) {
      const findProduct = await Product.findOne({ _id: productID });
      const newOrderDetail = new OrderDetail({
        quantity: quantity,
        uniCost: findProduct.price,
        totalMoney: quantity * findProduct.price,
        orderID: orderID,
        productID: productID,
      });
      const result = await newOrderDetail.save();
      await Product.findByIdAndUpdate(productID, {
        quantity: findProduct.quantity - quantity,
      });
      const findOrder = await Order.findOne({ _id: orderID });
      await Order.findByIdAndUpdate(orderID, {
        totalMoney: findOrder.totalMoney + quantity * findProduct.price,
      });
      return res.json({
        success: true,
        message: "Add New Order Detail Success!!!",
        result,
      });
    }
    if (productID === null && cartID !== null && quantity === null) {
      const findCart = await Cart.findOne({ _id: cartID });
      const findProduct = await Product.findOne({ _id: findCart.productID });
      const newOrderDetail = new OrderDetail({
        quantity: findCart.quantity,
        uniCost: findProduct.price,
        totalMoney: findCart.quantity * findProduct.price,
        orderID: orderID,
        productID: findCart.productID,
      });
      const result = await newOrderDetail.save();
      await Product.findByIdAndUpdate(findCart.productID, {
        quantity: findProduct.quantity - findCart.quantity,
      });
      const findOrder = await Order.findOne({ _id: orderID });
      await Order.findByIdAndUpdate(orderID, {
        totalMoney:
          findOrder.totalMoney + findCart.quantity * findProduct.price,
      });
      await Cart.deleteOne({ _id: cartID });
      return res.json({
        success: true,
        message: "Add New Order Detail Success!!!",
        result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const UpdateOrderDetail = async (req, res, next) => {
  try {
    const orderDetailID = req.params.orderDetailID;
    const { quantity } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findOrderDetail = await OrderDetail.findOne({ _id: orderDetailID });
    const productID = findOrderDetail.productID;
    const findProduct = await Product.findOne({ _id: productID });
    if (findProduct.quantity < quantity)
      return res
        .status(403)
        .json({ error: { message: "Số lượng tồn không đủ!!!" } });
    if (findProduct.quantity - quantity == 2 * findProduct.quantity) {
      await OrderDetail.deleteOne({ _id: orderDetailID });
      await Product.findByIdAndUpdate(productID, {
        quantity: findProduct.quantity - quantity,
      });
      return res.json({
        success: true,
        message: "Update Order Detail Success!!!",
      });
    } else {
      await OrderDetail.findByIdAndUpdate(orderDetailID, {
        quantity: findOrderDetail.quantity + quantity,
        totalMoney: (findOrderDetail.quantity + quantity) * findProduct.price,
      });
    }
    await Product.findByIdAndUpdate(productID, {
      quantity: findProduct.quantity - quantity,
    });
    return res.json({
      success: true,
      message: "Update Order Detail Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const GetAllOrderDetail = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await OrderDetail.find({});
    return res.json({
      success: true,
      message: "Get All Order Detail Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const GetAllOrderDetailByOrderID = async (req, res, next) => {
  try {
    const { orderID } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await OrderDetail.find({ orderID: orderID });
    if (result) {
      return res.json({
        success: 200,
        message: "Get All Order Detail Success!!!",
        result,
      });
    }
    if (!result) {
      return res.json({
        success: 400,
        message: "Get All Order Detail Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetCountProductPurchsed = async (req, res, next) => {
  try {
    const { productID } = req.body;
    let quan = 0;
    const result = await OrderDetail.find({ productID: productID });
    for (let index = 0; index < result.length; index++) {
      const resultOrder = await Order.findOne({ _id: result[index].orderID });
      if (resultOrder.orderStatus === "received") {
        quan += result[index].quantity;
      }
    }

    if (result) {
      return res.json({
        success: 200,
        message: "Get All Order Detail Success!!!",
        result: result.length,
        result2: quan,
      });
    }
    if (!result) {
      return res.json({
        success: 400,
        message: "Get All Order Detail Success!!!",
        result: 0,
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetCountOrderProduct = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const result = await OrderDetail.find({ productID: productID });
    let count = 0;
    for (let index = 0; index < result.length; index++) {
      const resultOrder = await Order.findOne({
        _id: result[index].orderID,
        orderStatus: "received",
      });
      if (resultOrder) {
        count += 1;
      }
    }
    return res.json({
      success: true,
      result: count,
    });
  } catch (error) {
    next(error);
  }
};

const DeleteOrderDetail = async (req, res, next) => {
  try {
    const orderDetailID = req.params.orderDetailID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findOrderDetail = await OrderDetail.findOne({ _id: orderDetailID });
    const totalMoneyOrderDetail = findOrderDetail.totalMoney;
    const findOrder = await Order.findOne({ _id: findOrderDetail.orderID });
    const totalMoneyOrder = findOrder.totalMoney;
    const totalMoneyOrderUpdate =
      Number(totalMoneyOrder) - Number(totalMoneyOrderDetail);
    if (totalMoneyOrderUpdate === 0) {
      await Order.findByIdAndUpdate(findOrderDetail.orderID, {
        orderStatus: "refund",
        totalMoney: 0,
      });
    }
    if (totalMoneyOrderUpdate !== 0) {
      await Order.findByIdAndUpdate(findOrderDetail.orderID, {
        totalMoney: totalMoneyOrderUpdate,
      });
    }
    const quantityOrderDetail = findOrderDetail.quantity;
    const findProduct = await Product.findOne({
      _id: findOrderDetail.productID,
    });
    const quantityProduct = findProduct.quantity;
    const quantityProductUpdate =
      Number(quantityOrderDetail) + Number(quantityProduct);
    await Product.findByIdAndUpdate(findOrderDetail.productID, {
      quantity: quantityProductUpdate,
    });
    await OrderDetail.deleteOne({ _id: orderDetailID });
    return res.json({
      success: true,
      message: "Delete Order Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const GetCountPurchase = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const result = await OrderDetail.find({ productID: productID });
    let count = 0;
    for (let index = 0; index < result.length; index++) {
      count += result[index].quantity;
    }
    return res.json({
      success: true,
      result: count,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddOrderDetail,
  UpdateOrderDetail,
  GetAllOrderDetail,
  GetAllOrderDetailByOrderID,
  GetCountProductPurchsed,
  GetCountOrderProduct,
  DeleteOrderDetail,
  GetCountPurchase,
};
