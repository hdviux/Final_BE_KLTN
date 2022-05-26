const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User");
const verifyToken = require("../middleware/auth");
router.put("/updateuser", verifyToken.verifyToken, UserController.UpdateUser);
router.post(
  "/changepassword",
  verifyToken.verifyToken,
  UserController.changePassword
);
router.post(
  "/finduserbyid",
  verifyToken.verifyToken,
  UserController.FindUserByID
);
router.get("/getalluser", UserController.GetAllUser);
router.put(
  "/updateuserrole",
  verifyToken.verifyToken,
  UserController.UpdateUserRole
);
router.post("/finduserbyidincomment", UserController.FindUserByIDInComment);
router.post(
  "/adminupdateuserpassword",
  verifyToken.verifyToken,
  UserController.AdminUpdateUserPassword
);
router.post(
  "/finduserbynamechar",
  verifyToken.verifyToken,
  UserController.FindUserByNameChar
);
module.exports = router;
