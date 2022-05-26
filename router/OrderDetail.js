const express = require("express");
const router = express.Router();
const OrderDetailController = require("../controllers/OrderDetail");
const verifyToken = require("../middleware/auth");
router.post(
  "/addorderdetail",
  verifyToken.verifyToken,
  OrderDetailController.AddOrderDetail
);
router.put(
  "/updateorderdetail/:orderDetailID",
  verifyToken.verifyToken,
  OrderDetailController.UpdateOrderDetail
);
router.post(
  "/getallorderdetailbyorderid",
  verifyToken.verifyToken,
  OrderDetailController.GetAllOrderDetailByOrderID
);
router.post(
  "/getcountproductpurchsed",
  OrderDetailController.GetCountProductPurchsed
);
router.post(
  "/getcountorderproduct",
  OrderDetailController.GetCountOrderProduct
);
router.delete(
  "/deleteorderdetail/:orderDetailID",
  verifyToken.verifyToken,
  OrderDetailController.DeleteOrderDetail
);
module.exports = router;
