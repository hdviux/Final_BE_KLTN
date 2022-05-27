const Contact = require("../models/Contact");
const User = require("../models/User");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendMailFeedback = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    if (!content || !name || !email)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    await sgMail.send({
      to: process.env.EMAIL_TOYSKID,
      from: process.env.NODEMAILER_EMAIL,
      subject: "Phản hồi từ ToysKid",
      text:
        "Phản hồi từ email: " +
        `${email}` +
        "(Có tên: " +
        `${name}` +
        ")" +
        " đến Toyskid",
      html: `${content}`,
    });
    await sgMail.send({
      to: `${email}`,
      from: process.env.NODEMAILER_EMAIL,
      subject: "Phản hồi từ ToysKid",
      html: `Xin chào,<br> Web Toyskid đã nhận phản hồi từ bạn, chúng tôi sẽ sớm liên hệ với bạn.`,
    });
    const newContact = new Contact({
      name,
      email,
      content,
    });
    newContact.save();

    return res.status(200).json({
      Status: "success",
      message: "Gửi phản hồi thành công!!!",
      newContact,
    });
  } catch (error) {
    next(error);
  }
};

const getAllContact = async (req, res, next) => {
  try {
    const result = await Contact.find({});
    return res.json({
      success: true,
      message: "Get All Contact Success!!!",
      result: result.sort(function (a, b) {
        return b.timeSend - a.timeSend;
      }),
    });
  } catch (error) {
    next(error);
  }
};

const AdminSendMail = async (req, res, next) => {
  try {
    const { email, content } = req.body;
    if (!content || !email)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } }); 
    await sgMail.send({
      to: `${email}`,
      from: process.env.NODEMAILER_EMAIL,
      subject: "Phản hồi từ ToysKid",
      html: `${content}`,
    });
    return res.status(200).json({
      Status: "success",
      message: "Gửi phản hồi thành công!!!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMailFeedback,
  getAllContact,
  AdminSendMail,
};
