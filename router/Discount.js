const express = require("express");
const router = express.Router();
const DiscountController = require("../controllers/Discount");
const verifyToken = require("../middleware/auth");
router.post(
  "/creatediscount",
  verifyToken.verifyToken,
  DiscountController.CreateDiscount
);
router.post("/checkdiscount", DiscountController.CheckDiscount);
router.put("/updatediscount", DiscountController.UpdateDiscount);
router.post("/deletediscount", DiscountController.DeleteDiscount);
router.post("/finddiscount", DiscountController.FindDiscount);
router.post("/findproductdiscount", DiscountController.FindProductDiscount);
module.exports = router;
