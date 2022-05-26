const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/Contact");
router.post("/addnewcontact", ContactController.sendMailFeedback);
router.get("/getallcontact", ContactController.getAllContact);
router.post("/adminsendmail", ContactController.AdminSendMail);
module.exports = router;
