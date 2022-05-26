const Product = require("../models/Product");
const User = require("../models/User");
const Evaluate = require("../models/Evaluate");
const Category = require("../models/Category");
const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const AddProduct = async (req, res, next) => {
  try {
    const productName = req.body.productName;
    const image = req.body.image;
    const quantity = req.body.quantity;
    const price = req.body.price;
    const description = req.body.description;
    const color = req.body.color;
    const categoryID = req.body.categoryID;
    const brandID = req.body.brandID;
    if (!productName || !image || !quantity || !price || !description)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const findProduct = await Product.findOne({ productName: productName });
    if (!findProduct) {
      const newProduct = new Product({
        productName,
        image,
        quantity,
        price,
        description,
        color,
        categoryID,
        brandID,
      });
      const result = await newProduct.save();
      const newEvaluate = new Evaluate({ productID: result._id });
      await newEvaluate.save();
      const findCategory = await Category.findOne({ _id: categoryID });
      const categoryQuantity = findCategory.quantity;
      const categoryUpdateQuantity = categoryQuantity + 1;
      await Category.findByIdAndUpdate(categoryID, {
        quantity: categoryUpdateQuantity,
      });
      return res.json({
        success: true,
        message: "Add new Product Success!!!",
        result,
      });
    }
    if (findProduct) {
      return res.json({
        success: false,
        message: "Add new Product Fail!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
const UpdateProduct = async (req, res, next) => {
  try {
    const productID = req.params.productID;
    const newProduct = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Product.findByIdAndUpdate(productID, newProduct);
    return res.json({
      success: true,
      message: "Update Product Success!!!",
    });
  } catch (error) {
    next(error);
  }
};
const DeleteProduct = async (req, res, next) => {
  try {
    const productID = req.params.productID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Product.findOne({ _id: productID });
    const findCategory = await Category.findOne({ _id: result.categoryID });
    if (findCategory) {
      const categoryQuantity = findCategory.quantity;
      const categoryUpdateQuantity = categoryQuantity - 1;
      await Category.findByIdAndUpdate(result.categoryID, {
        quantity: categoryUpdateQuantity,
      });
      await Product.deleteOne({ _id: productID });
      await Evaluate.deleteOne({ productID: productID });
      await Cart.deleteOne({ productID: productID });
      return res.json({
        success: true,
        message: "Delete Product Success!!!",
      });
    }
  } catch (error) {
    next(error);
  }
};
const FindProductByName = async (req, res, next) => {
  try {
    const { productName } = req.body;
    const findAllProduct = await Product.find({});
    const result = findAllProduct.filter((p) => {
      return (
        p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
      );
    });
    const array = [];
    for (let i = 0; i < result.length; i++) {
      const evaluate = await Evaluate.findOne({ productID: result[i]._id });
      array.push({
        _id: result[i]._id,
        productName: result[i].productName,
        image: result[i].image,
        quantity: result[i].quantity,
        price: result[i].price,
        description: result[i].description,
        color: result[i].color,
        categoryID: result[i].categoryID,
        brandID: result[i].brandID,
        evaluate: evaluate.avgEvaluate,
        totalCount: evaluate.totalCount,
        createdAt: result[i].createdAt,
      });
    }
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result: array.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      }),
    });
  } catch (error) {
    next(error);
  }
};
const FindProductByID = async (req, res, next) => {
  try {
    const { productID } = req.body;
    const result = await Product.findOne({ _id: productID });
    const evaluate = await Evaluate.findOne({ productID: productID });
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result: {
        _id: result._id,
        productName: result.productName,
        image: result.image,
        quantity: result.quantity,
        price: result.price,
        description: result.description,
        color: result.color,
        categoryID: result.categoryID,
        brandID: result.brandID,
        evaluate: evaluate.avgEvaluate,
        totalCount: evaluate.totalCount,
        oneStar: evaluate.oneStar,
        twoStar: evaluate.twoStar,
        threeStar: evaluate.threeStar,
        fourStar: evaluate.fourStar,
        fiveStar: evaluate.fiveStar,
      },
    });
  } catch (error) {
    next(error);
  }
};
const FindProductByCategoryID = async (req, res, next) => {
  try {
    const { categoryID } = req.body;
    const result = await Product.find({ categoryID: categoryID });
    const array = [];
    if (result.length === 0)
      return res.json({
        success: false,
        message: "Can Not Find Product Success!!!",
        result: [],
      });
    for (let i = 0; i < result.length; i++) {
      const evaluate = await Evaluate.findOne({ productID: result[i]._id });
      array.push({
        _id: result[i]._id,
        productName: result[i].productName,
        image: result[i].image,
        quantity: result[i].quantity,
        price: result[i].price,
        description: result[i].description,
        color: result[i].color,
        categoryID: result[i].categoryID,
        brandID: result[i].brandID,
        evaluate: evaluate.avgEvaluate,
        totalCount: evaluate.totalCount,
      });
    }
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result: array,
    });
  } catch (error) {
    next(error);
  }
};
const FindProductByBrandID = async (req, res, next) => {
  try {
    const { brandID } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Product.find({ brandID });
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllProduct = async (req, res, next) => {
  try {
    const result = await Product.find({});
    return res.json({
      success: true,
      message: "Get All Product Success!!!",
      result: result.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      }),
    });
  } catch (error) {
    next(error);
  }
};

const AdvanceSearchProduct = async (req, res, next) => {
  try {
    const { productName, fromMoney, toMoney, categoryID, brandID } = req.body;
    if (
      productName === "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID === "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({});
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: findAllProduct,
      });
    }
    if (
      productName === "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID === "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return p.price >= fromMoney && p.price <= toMoney;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName === "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID !== "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: findAllProduct,
      });
    }
    if (
      productName === "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID === "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({
        brandID: brandID,
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: findAllProduct,
      });
    }
    if (
      productName === "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID !== "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
        brandID: brandID,
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: findAllProduct,
      });
    }
    if (
      productName === "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID !== "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
        brandID: brandID,
      });
      const result = findAllProduct.filter((p) => {
        return p.price >= fromMoney && p.price <= toMoney;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName === "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID === "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({ brandID: brandID });
      const result = findAllProduct.filter((p) => {
        return p.price >= fromMoney && p.price <= toMoney;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName === "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID === "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return p.price >= Number(fromMoney) && p.price <= Number(toMoney);
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName === "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID !== "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
      });
      const result = findAllProduct.filter((p) => {
        return p.price >= fromMoney && p.price <= toMoney;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }

    if (
      productName !== "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID === "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return (
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID === "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID !== "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
      });
      const result = findAllProduct.filter((p) => {
        return (
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID === "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({
        brandID: brandID,
      });
      const result = findAllProduct.filter((p) => {
        return (
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney === 0 &&
      toMoney === 0 &&
      categoryID !== "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
        brandID: brandID,
      });
      const result = findAllProduct.filter((p) => {
        return (
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID !== "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
        brandID: brandID,
      });
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID === "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID === "" &&
      brandID !== ""
    ) {
      const findAllProduct = await Product.find({ brandID: brandID });
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (
      productName !== "" &&
      fromMoney !== 0 &&
      toMoney !== 0 &&
      categoryID !== "" &&
      brandID === ""
    ) {
      const findAllProduct = await Product.find({
        categoryID: categoryID,
      });
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const CheckName = async (req, res, next) => {
  try {
    const { productName } = req.body;
    const result = await Product.findOne({ productName: productName });
    if (result) {
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: true,
      });
    }
    if (!result) {
      return res.json({
        success: false,
        message: "Find Product Fail!!!",
        result: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

const FindProductByNameAndCategoryID = async (req, res, next) => {
  try {
    const { productName, categoryID } = req.body;
    const findAllProduct = await Product.find({ categoryID: categoryID });
    const result = findAllProduct.filter((p) => {
      return (
        p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
      );
    });
    const array = [];
    for (let i = 0; i < result.length; i++) {
      const evaluate = await Evaluate.findOne({ productID: result[i]._id });
      array.push({
        _id: result[i]._id,
        productName: result[i].productName,
        image: result[i].image,
        quantity: result[i].quantity,
        price: result[i].price,
        description: result[i].description,
        color: result[i].color,
        categoryID: result[i].categoryID,
        brandID: result[i].brandID,
        evaluate: evaluate.avgEvaluate,
        totalCount: evaluate.totalCount,
      });
    }
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result: array,
    });
  } catch (error) {
    next(error);
  }
};

const FindProductByNameOne = async (req, res, next) => {
  try {
    const { productName } = req.body;
    const findAllProduct = await Product.find({});
    const result = findAllProduct.filter((p) => {
      return (
        p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
      );
    });
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const FindProductByNameCategory = async (req, res, next) => {
  try {
    const { productName, categoryID } = req.body;
    const findAllProduct = await Product.find({ categoryID: categoryID });
    const result = findAllProduct.filter((p) => {
      return (
        p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
      );
    });
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const FindProductByNameBrand = async (req, res, next) => {
  try {
    const { productName, brandID } = req.body;
    const findAllProduct = await Product.find({ brandID: brandID });
    const result = findAllProduct.filter((p) => {
      return (
        p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
      );
    });
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const FindProductByNameBrandCategory = async (req, res, next) => {
  try {
    const { productName, brandID, categoryID } = req.body;
    const findAllProduct = await Product.find({
      brandID: brandID,
      categoryID: categoryID,
    });
    const result = findAllProduct.filter((p) => {
      return (
        p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
      );
    });
    return res.json({
      success: true,
      message: "Find Product Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const FindProductByNameFromToMoney = async (req, res, next) => {
  try {
    const { productName, fromMoney, toMoney, categoryID, brandID } = req.body;
    if (!productName && fromMoney && toMoney && !categoryID && !brandID) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return p.price >= fromMoney && p.price <= toMoney;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (productName && fromMoney && toMoney && !categoryID && !brandID) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }

    if (productName && fromMoney && toMoney && !categoryID && !brandID) {
      const findAllProduct = await Product.find({});
      const result = findAllProduct.filter((p) => {
        return (
          p.price >= fromMoney &&
          p.price <= toMoney &&
          p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
        );
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
  } catch (error) {
    next(error);
  }
};

const GetAllProductHot = async (req, res, next) => {
  try {
    const allProduct = await Product.find({});
    const arr = [];

    for (let index = 0; index < allProduct.length; index++) {
      let quan = 0;
      const findOrderDetail = await OrderDetail.find({
        productID: allProduct[index]._id,
      });
      for (let i = 0; i < findOrderDetail.length; i++) {
        quan += findOrderDetail[i].quantity;
      }
      arr.push({
        pid: allProduct[index]._id,
        quan: quan,
      });
    }
    arr.sort(function (a, b) {
      return b.quan - a.quan;
    });
    return res.json({
      success: true,
      message: "Get All Product Success!!!",
      result: arr.slice(0, 4),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddProduct,
  UpdateProduct,
  DeleteProduct,
  FindProductByName,
  FindProductByID,
  FindProductByCategoryID,
  FindProductByBrandID,
  GetAllProduct,
  AdvanceSearchProduct,
  CheckName,
  FindProductByNameAndCategoryID,
  FindProductByNameOne,
  FindProductByNameCategory,
  FindProductByNameBrand,
  FindProductByNameBrandCategory,
  FindProductByNameFromToMoney,
  GetAllProductHot,
};
