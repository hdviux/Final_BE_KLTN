const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/Comment");
const verifyToken = require("../middleware/auth");
router.post(
  "/addcomment",
  verifyToken.verifyToken,
  CommentController.AddComment
);
router.put(
  "/updatecomment/:commentID",
  verifyToken.verifyToken,
  CommentController.UpdateComment
);
router.delete(
  "/deletecomment/:commentID",
  verifyToken.verifyToken,
  CommentController.DeleteComment
);
router.get(
  "/getallcomment",
  verifyToken.verifyToken,
  CommentController.GetAllComment
);
router.put(
  "/changevote/:commentID",
  verifyToken.verifyToken,
  CommentController.ChangeVote
);
router.post("/getallcommentproduct", CommentController.GetAllCommentProduct);
router.post("/findcommentbyid", CommentController.FindCommentByID);
router.post(
  "/findcommentbyusername",
  verifyToken.verifyToken,
  CommentController.FindCommentByUserName
);
module.exports = router;
