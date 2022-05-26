const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/Product");
const verifyToken = require("../middleware/auth");
router.post(
  "/addproduct",
  verifyToken.verifyToken,
  ProductController.AddProduct
);
router.put(
  "/updateproduct/:productID",
  verifyToken.verifyToken,
  ProductController.UpdateProduct
);
router.delete(
  "/deleteproduct/:productID",
  verifyToken.verifyToken,
  ProductController.DeleteProduct
);
router.post("/findproductbyname", ProductController.FindProductByName);
router.post("/findproductbyid", ProductController.FindProductByID);
router.post(
  "/findproductbycategoryid",
  ProductController.FindProductByCategoryID
);
router.post(
  "/findproductbybrandid",
  verifyToken.verifyToken,
  ProductController.FindProductByBrandID
);
router.get("/getallproduct", ProductController.GetAllProduct);
router.post("/advancesearchproduct", ProductController.AdvanceSearchProduct);
router.post("/checkname", ProductController.CheckName);

router.post(
  "/findproductbynameandcategoryid",
  ProductController.FindProductByNameAndCategoryID
);
router.post("/findproductbynameone", ProductController.FindProductByNameOne);
router.post(
  "/findproductbynamebrand",
  ProductController.FindProductByNameBrand
);
router.post(
  "/findproductbynamecategory",
  ProductController.FindProductByNameCategory
);
router.post(
  "/findproductbynamebrandcategory",
  ProductController.FindProductByNameBrandCategory
);
router.post(
  "/findproductbynamefromtomoney",
  ProductController.FindProductByNameFromToMoney
);
router.post(
  "/getallproducthot",
  ProductController.GetAllProductHot
);
module.exports = router;
