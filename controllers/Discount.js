const Discount = require("../models/Discount");
const Product = require("../models/Product");
const User = require("../models/User");
const CreateDiscount = async (req, res, next) => {
  try {
    const { productID, endDate, percent } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (!productID || !endDate || !percent)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const findDiscountProduct = await Discount.findOne({
      productID: productID,
    });
    if (!findDiscountProduct) {
      const newDiscount = new Discount({
        productID,
        endDate,
        percent,
      });
      const result = await newDiscount.save();
      return res.json({
        success: true,
        message: "Add New Discount Success!!!",
        result,
      });
    }
    if (findDiscountProduct) {
      return res.json({
        success: false,
        message: "Add New Discount Fail!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const CheckDiscount = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const findDiscountProduct = await Discount.findOne({
      productID: productID,
    });
    if (findDiscountProduct) {
      return res.json({
        status: true,
        message: "Success!!!",
      });
    }
    if (!findDiscountProduct) {
      return res.json({
        status: false,
        message: "Fail!!!",
      });
    }
  } catch (error) {
    next(error);
  }
};

const UpdateDiscount = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const newDiscount = req.body;
    const findDiscountProduct = await Discount.findOne({
      productID: productID,
    });
    await Discount.findByIdAndUpdate(findDiscountProduct._id, newDiscount);
    return res.json({
      success: true,
      message: "Update Discount Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const FindDiscount = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const result = await Discount.findOne({
      productID: productID,
    });
    if (result) {
      return res.json({
        success: true,
        message: "Delete Discount Success!!!",
        result,
      });
    }
    if (!result) {
      return res.json({
        success: true,
        message: "Delete Discount Success!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const DeleteDiscount = async (req, res, next) => {
  try {
    const { productID } = req.body;
    await Discount.deleteOne({ productID: productID });
    return res.json({
      success: true,
      message: "Delete Discount Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const FindProductDiscount = async (req, res, next) => {
  try {
    const allDiscount = await Discount.find({});
    let arr = [];
    let productID = [];
    for(const discount of allDiscount) {
      productID.push(discount.productID);
    }
    const products = await Product.find({
      _id: {
        $in:[...productID],
      },
      active:true,
    });
    for(const product of products) {
      arr.push(product);
    }
    if (allDiscount) {
      return res.json({
        success: true,
        message: "Delete Discount Success!!!",
        result: arr.slice(0, 5),
      });
    }
    if (!allDiscount) {
      return res.json({
        success: true,
        message: "Delete Discount Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  CreateDiscount,
  CheckDiscount,
  UpdateDiscount,
  DeleteDiscount,
  FindDiscount,
  FindProductDiscount,
};
