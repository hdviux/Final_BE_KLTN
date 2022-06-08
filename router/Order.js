const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Order");
const verifyToken = require("../middleware/auth");
router.post("/addorder", verifyToken.verifyToken, OrderController.AddOrder);
router.put(
  "/updateordershipdate/:orderID",
  verifyToken.verifyToken,
  OrderController.UpdateOrderShipDate
);
router.put(
  "/updateordertotalmoney/:orderID",
  verifyToken.verifyToken,
  OrderController.UpdateOrderTotalMoney
);
router.put(
  "/updateorderstatus/:orderID",
  verifyToken.verifyToken,
  OrderController.UpdateOrderStatus
);
router.delete(
  "/deleteorder/:orderID",
  verifyToken.verifyToken,
  OrderController.DeleteOrder
);
router.get(
  "/getallorder",
  verifyToken.verifyToken,
  OrderController.GetAllOrder
);
router.post(
  "/sendemailorder",
  verifyToken.verifyToken,
  OrderController.SendOrderEmail
);
router.post(
  "/getallorderbyuserid",
  verifyToken.verifyToken,
  OrderController.GetAllOrderByUserID
);
router.post(
  "/getallorderbystatus",
  verifyToken.verifyToken,
  OrderController.GetAllOrderByStatus
);
router.post(
  "/getcosteachuser",
  verifyToken.verifyToken,
  OrderController.GetCostEachUser
);
router.post("/getorderbystatus", OrderController.GetOrderByStatus);
router.post("/getchart", OrderController.GetChart);
router.post("/createorderbill", OrderController.CreateOrderBill);
module.exports = router;
