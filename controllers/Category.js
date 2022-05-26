const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Order");
const AddCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (!categoryName)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const findCategory = await Category.findOne({ categoryName: categoryName });
    if (!findCategory) {
      const newCategory = new Category({
        categoryName,
      });
      const result = await newCategory.save();
      return res.json({
        success: true,
        message: "Add New Category Success!!!",
        result,
      });
    }
    if (findCategory) {
      return res.json({
        success: false,
        message: "Add New Category Fail!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const UpdateCategory = async (req, res, next) => {
  try {
    const categoryID = req.params.categoryID;
    const newCategory = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Category.findByIdAndUpdate(categoryID, newCategory);
    return res.json({
      success: true,
      message: "Update Category Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const DeleteCategory = async (req, res, next) => {
  try {
    const categoryID = req.params.categoryID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Category.deleteOne({ _id: categoryID });
    return res.json({
      success: true,
      message: "Delete Category Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const FindCategoryByName = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    const findAllCategory = await Category.find({});
    const result = findAllCategory.filter((p) => {
      return (
        p.categoryName.toLowerCase().indexOf(categoryName.toLowerCase()) !== -1
      );
    });
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const FindCategoryByID = async (req, res, next) => {
  try {
    const { categoryID } = req.body;
    const result = await Category.findOne({ _id: categoryID });
    if (result) {
      return res.json({
        success: true,
        message: "Find Category Success!!!",
        result,
      });
    }
    if (!result) {
      return res.json({
        success: false,
        message: "Can Not Find Category!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetAllCategory = async (req, res, next) => {
  try {
    const result = await Category.find({});
    result.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    return res.json({
      success: true,
      message: "Get All Category Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const FindCategoryByNameChar = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findAllCategory = await Category.find({});
    const result = findAllCategory.filter((p) => {
      return (
        p.categoryName.toLowerCase().indexOf(categoryName.toLowerCase()) !== -1
      );
    });
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const ChartCategory = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const array = [];
    const findAllCategory = await Category.find({});
    for (let i = 0; i < findAllCategory.length; i++) {
      let cost = 0;
      const resultProduct = await Product.find({
        categoryID: findAllCategory[i]._id,
      });

      for (let index = 0; index < resultProduct.length; index++) {
        let quan = 0;
        const result = await OrderDetail.find({
          productID: resultProduct[index]._id,
        });
        for (let index2 = 0; index2 < result.length; index2++) {
          const resultOrder = await Order.findOne({
            _id: result[index2].orderID,
          });
          if (resultOrder.orderStatus === "received") {
            quan += result[index2].quantity;
          }
        }
        cost += quan * resultProduct[index].price;
      }
      array.push({
        name: findAllCategory[i].categoryName,
        cost: cost,
        categoryID: findAllCategory[i]._id,
      });
    }
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result: array,
    });
  } catch (error) {
    next(error);
  }
};

const TopCategory = async (req, res, next) => {
  try {
    const array = [];
    const findAllCategory = await Category.find({});
    for (let i = 0; i < findAllCategory.length; i++) {
      let cost = 0;
      const resultProduct = await Product.find({
        categoryID: findAllCategory[i]._id,
      });

      for (let index = 0; index < resultProduct.length; index++) {
        let quan = 0;
        const result = await OrderDetail.find({
          productID: resultProduct[index]._id,
        });
        for (let index2 = 0; index2 < result.length; index2++) {
          const resultOrder = await Order.findOne({
            _id: result[index2].orderID,
          });
          if (resultOrder.orderStatus === "received") {
            quan += result[index2].quantity;
          }
        }
        cost += quan * resultProduct[index].price;
      }
      array.push({
        name: findAllCategory[i].categoryName,
        cost: cost,
        categoryID: findAllCategory[i]._id,
      });
    }
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result: array,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  AddCategory,
  UpdateCategory,
  DeleteCategory,
  FindCategoryByName,
  FindCategoryByID,
  GetAllCategory,
  FindCategoryByNameChar,
  ChartCategory,
  TopCategory,
};
