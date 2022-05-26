const Brand = require("../models/Brand");
const User = require("../models/User");

const AddBrand = async (req, res, next) => {
  try {
    const { brandName, nation, image } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    if (!brandName || !nation)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const findBrand = await Brand.findOne({ brandName: brandName });
    if (!findBrand) {
      const newBrand = new Brand({
        brandName,
        nation,
        image,
      });
      const result = await newBrand.save();
      return res.json({
        success: true,
        message: "Add New Brand Success!!!",
        result,
      });
    }
    if (findBrand) {
      return res.json({
        success: false,
        message: "Add New Brand Fail!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

const UpdateBrand = async (req, res, next) => {
  try {
    const brandID = req.params.brandID;
    const newBrand = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Brand.findByIdAndUpdate(brandID, newBrand);
    return res.json({
      success: true,
      message: "Update Brand Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const DeleteBrand = async (req, res, next) => {
  try {
    const brandID = req.params.brandID;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    await Brand.deleteOne({ _id: brandID });
    return res.json({
      success: true,
      message: "Delete Brand Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const FindBrandByName = async (req, res, next) => {
  try {
    const { brandName } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Brand.find({ brandName: brandName });
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};

const FindBrandByNameChar = async (req, res, next) => {
  try {
    const { brandName } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const findAllBrand = await Brand.find({});
    const result = findAllBrand.filter((p) => {
      return p.brandName.toLowerCase().indexOf(brandName.toLowerCase()) !== -1;
    });
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result: result.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      }),
    });
  } catch (error) {
    next(error);
  }
};

const FindBrandByNation = async (req, res, next) => {
  try {
    const { nation } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Brand.find({ nation: nation });
    return res.json({
      success: true,
      message: "Find Brand Success!!!",
      result,
    });
  } catch (error) {
    next(error);
  }
};
const FindBrandByID = async (req, res, next) => {
  try {
    const { brandID } = req.body;
    const foundUser = await User.findOne({ _id: req.userID });
    if (!foundUser)
      return res
        .status(403)
        .json({ error: { message: "Người dùng chưa đăng nhập!!!" } });
    const result = await Brand.findOne({ _id: brandID });
    if (result) {
      return res.json({
        success: true,
        message: "Find Brand Success!!!",
        result,
      });
    }
    if (!result) {
      return res.json({
        success: false,
        message: "Can Not Find Brand!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
const GetAllBrand = async (req, res, next) => {
  try {
    const result = await Brand.find({});
    return res.json({
      success: true,
      message: "Get All Brand Success!!!",
      result: result.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      }),
    });
  } catch (error) {
    next(error);
  }
};

const FindBrandByIDProduct = async (req, res, next) => {
  try {
    const { brandID } = req.body;
    const result = await Brand.findOne({ _id: brandID });
    if (result) {
      return res.json({
        success: true,
        message: "Find Brand Success!!!",
        result,
      });
    }
    if (!result) {
      return res.json({
        success: false,
        message: "Can Not Find Brand!!!",
        result: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddBrand,
  UpdateBrand,
  DeleteBrand,
  FindBrandByName,
  FindBrandByNation,
  FindBrandByID,
  GetAllBrand,
  FindBrandByIDProduct,
  FindBrandByNameChar,
};
