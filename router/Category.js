const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category");
const verifyToken = require("../middleware/auth");
router.post(
  "/addcategory",
  verifyToken.verifyToken,
  CategoryController.AddCategory
);
router.put(
  "/updatecategory/:categoryID",
  verifyToken.verifyToken,
  CategoryController.UpdateCategory
);
router.delete(
  "/deletecategory/:categoryID",
  verifyToken.verifyToken,
  CategoryController.DeleteCategory
);
router.post("/findcategorybyname", CategoryController.FindCategoryByName);
router.post("/findcategorybyid", CategoryController.FindCategoryByID);
router.get("/getallcategory", CategoryController.GetAllCategory);
router.post(
  "/findcategorybynamechar",
  verifyToken.verifyToken,
  CategoryController.FindCategoryByNameChar
);

router.post(
  "/chartcategory",
  verifyToken.verifyToken,
  CategoryController.ChartCategory
);

router.post("/topcategory", CategoryController.TopCategory);

module.exports = router;
