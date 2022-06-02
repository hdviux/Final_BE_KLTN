const Product = require("../models/Product");
const User = require("../models/User");
const Evaluate = require("../models/Evaluate");
const Category = require("../models/Category");
const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Discount = require("../models/Discount");
const AddProduct = async (req, res, next) => {
  console.log(12345);
  try {
    const {
      productName,
      image,
      quantity,
      price,
      description,
      color,
      categoryID,
      brandID,
      age,
    } = req.body;

    if (!productName || !image || !quantity || !price || !description || !age)
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
        age,
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
      await Discount.deleteOne({ productID: productID });
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
    const { categoryID } = req.body;
    const findAllProduct = await Product.find({ categoryID: categoryID });
    if (findAllProduct) {
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: findAllProduct,
      });
    }
    if (!findAllProduct) {
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const FindProductByNameBrand = async (req, res, next) => {
  try {
    const { brandID } = req.body;
    const findAllProduct = await Product.find({ brandID: brandID });
    if (findAllProduct) {
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: findAllProduct,
      });
    }
    if (!findAllProduct) {
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

// const FindProductByNameBrandCategory = async (req, res, next) => {
//   try {
//     const { productName, brandID, categoryID } = req.body;
//     const findAllProduct = await Product.find({
//       brandID: brandID,
//       categoryID: categoryID,
//     });
//     if (findAllProduct) {
//       const result = findAllProduct.filter((p) => {
//         return (
//           p.productName.toLowerCase().indexOf(productName.toLowerCase()) !== -1
//         );
//       });
//       return res.json({
//         success: true,
//         message: "Find Product Success!!!",
//         result,
//       });
//     }
//     if (!findAllProduct) {
//       return res.json({
//         success: true,
//         message: "Find Product Success!!!",
//         result: [],
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const FindProductByNameFromToMoney = async (req, res, next) => {
//   try {
//     const { productName, fromMoney, toMoney, categoryID, brandID } = req.body;
//     if (
//       productName.length === 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID === "" &&
//       brandID === ""
//     ) {
//       const findAllProduct = await Product.find({});
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return p.price >= fromMoney && p.price <= toMoney;
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }
//     if (
//       productName.length === 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID !== "" &&
//       brandID === ""
//     ) {
//       const findAllProduct = await Product.find({ categoryID: categoryID });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return (
//             p.price >= fromMoney &&
//             p.price <= toMoney &&
//             p.productName.toLowerCase().indexOf(productName.toLowerCase()) !==
//               -1
//           );
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }

//     if (
//       productName.length === 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID === "" &&
//       brandID !== ""
//     ) {
//       const findAllProduct = await Product.find({ brandID: brandID });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return (
//             p.price >= fromMoney &&
//             p.price <= toMoney &&
//             p.productName.toLowerCase().indexOf(productName.toLowerCase()) !==
//               -1
//           );
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }
//     if (
//       productName.length === 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID !== "" &&
//       brandID !== ""
//     ) {
//       const findAllProduct = await Product.find({
//         categoryID: categoryID,
//         brandID: brandID,
//       });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return (
//             p.price >= fromMoney &&
//             p.price <= toMoney &&
//             p.productName.toLowerCase().indexOf(productName.toLowerCase()) !==
//               -1
//           );
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }
//     if (
//       productName.length !== 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID === "" &&
//       brandID === ""
//     ) {
//       const findAllProduct = await Product.find({ productName: productName });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return p.price >= fromMoney && p.price <= toMoney;
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }
//     if (
//       productName.length !== 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID !== "" &&
//       brandID === ""
//     ) {
//       const findAllProduct = await Product.find({
//         productName: productName,
//         categoryID: categoryID,
//       });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return (
//             p.price >= fromMoney &&
//             p.price <= toMoney &&
//             p.productName.toLowerCase().indexOf(productName.toLowerCase()) !==
//               -1
//           );
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }
//     if (
//       productName.length !== 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID === "" &&
//       brandID !== ""
//     ) {
//       const findAllProduct = await Product.find({
//         productName: productName,
//         brandID: brandID,
//       });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return (
//             p.price >= fromMoney &&
//             p.price <= toMoney &&
//             p.productName.toLowerCase().indexOf(productName.toLowerCase()) !==
//               -1
//           );
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }

//     if (
//       productName.length !== 0 &&
//       fromMoney &&
//       toMoney &&
//       categoryID !== "" &&
//       brandID !== ""
//     ) {
//       const findAllProduct = await Product.find({
//         productName: productName,
//         categoryID: categoryID,
//         brandID: brandID,
//       });
//       if (findAllProduct) {
//         const result = findAllProduct.filter((p) => {
//           return (
//             p.price >= fromMoney &&
//             p.price <= toMoney &&
//             p.productName.toLowerCase().indexOf(productName.toLowerCase()) !==
//               -1
//           );
//         });
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result,
//         });
//       }

//       if (!findAllProduct) {
//         return res.json({
//           success: true,
//           message: "Find Product Success!!!",
//           result: [],
//         });
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const GetAllProductHot = async (req, res, next) => {
//   try {
//     const allProduct = await Product.find({});
//     const arr = [];

//     for (let index = 0; index < allProduct.length; index++) {
//       let quan = 0;
//       const findOrderDetail = await OrderDetail.find({
//         productID: allProduct[index]._id,
//       });
//       for (let i = 0; i < findOrderDetail.length; i++) {
//         quan += findOrderDetail[i].quantity;
//       }
//       arr.push({
//         pid: allProduct[index]._id,
//         quan: quan,
//       });
//     }
//     arr.sort(function (a, b) {
//       return b.quan - a.quan;
//     });
//     let arr2 = [];
//     for (let index = 0; index < 4; index++) {
//       const findProduct = await Product.findOne({
//         _id: arr[index].pid,
//       });
//       arr2.push(findProduct);
//     }
//     return res.json({
//       success: true,
//       message: "Get All Product Success!!!",
//       result: arr2,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const FindProduct = async (req, res, next) => {
  try {
    const { preData, type, age, brandID, categoryID, fMoney, tMoney, productName } =
      req.body;
    if (type === "money") {
      const result = preData.filter((p) => {
        return p.price >= fMoney && p.price <= tMoney;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (type === "age") {
      const result = preData.filter((p) => {
        return p.age === age;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (type === "category") {
      const result = preData.filter((p) => {
        return p.categoryID === categoryID;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (type === "brand") {
      const result = preData.filter((p) => {
        return p.brandID === brandID;
      });
      return res.json({
        success: true,
        message: "Find Product Success!!!",
        result,
      });
    }
    if (type === "name") {
      const result = preData.filter((p) => {
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
  CheckName,
  FindProductByNameAndCategoryID,
  FindProductByNameOne,
  FindProductByNameCategory,
  FindProductByNameBrand,
  FindProduct,
};
