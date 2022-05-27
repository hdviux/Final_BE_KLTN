const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const serviceId = process.env.TWILIO_SERVICE_SID;
const sidkey = process.env.TWILIO_API_KEY;
const secret = process.env.TWILIO_API_SECRET;
const twilioClient = require("twilio")(sidkey, secret, { accountSid });
const nodemailer = require("nodemailer");
let rfToken = [];

const signUpByEmail = async (req, res, next) => {
  try {
    const { fullName, userName, email, password } = req.body;
    if (!fullName || !userName || !email || !password)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const foundEmail = await User.findOne({ email });
    if (foundEmail)
      return res
        .status(400)
        .json({ error: { message: "Email đã được sử dụng!" } });
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.json({
      success: true,
      message: "Create User By Email Success!!!",
    });
  } catch (error) {
    next(error);
  }
};
const signUpByPhone = async (req, res, next) => {
  try {
    const { fullName, userName, phone, password } = req.body;
    if (!fullName || !userName || !phone || !password)
      return res
        .status(400)
        .json({ error: { message: "Chưa điền đầy đủ thông tin!" } });
    const foundPhone = await User.findOne({ phone });
    if (foundPhone)
      return res
        .status(400)
        .json({ error: { message: "Số điện thoại đã được sử dụng!" } });
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = new User({
      fullName,
      userName,
      phone,
      password: hashedPassword,
      avatar:
        "https://toyskid.s3.ap-southeast-1.amazonaws.com/18ca2611-992a-4bd4-87f6-ff6a078b7f01.png",
    });
    await newUser.save();
    return res.json({
      success: true,
      message: "Create User By Phone Success!!!",
    });
  } catch (error) {
    next(error);
  }
};

const signInByPhone = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.json({ error: { message: "Chưa nhập đầy đủ thông tin!!!" } });
    const foundPhone = await User.findOne({ phone });
    if (!foundPhone)
      return res.json({
        error: { message: "Số điện thoại không chính xác!!!" },
      });
    const validPassword = await bcrypt.compareSync(
      password,
      foundPhone.password
    );
    if (!validPassword)
      return res.json({
        status: 400,
        error: { message: "Password không chính xác!!!" },
      });
    const accessToken = jwt.sign(
      { userID: foundPhone._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { userID: foundPhone._id },
      process.env.REFRESH_TOKEN_SECRET
    );
    rfToken.push(refreshToken);
    const user = await User.findOne({ phone });
    return res.json({
      accessToken,
      refreshToken,
      user,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
const signInByEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ error: { message: "Chưa nhập đầy đủ thông tin!!!" } });
    const foundEmail = await User.findOne({ email });
    if (!foundEmail)
      return res.json({ error: { message: "Email không chính xác!!!" } });
    const validPassword = await bcrypt.compareSync(
      password,
      foundEmail.password
    );
    if (!validPassword)
      return res.json({
        status: 400,
        error: { message: "Password không chính xác!!!" },
      });
    const accessToken = jwt.sign(
      { userID: foundEmail._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { userID: foundEmail._id },
      process.env.REFRESH_TOKEN_SECRET
    );
    rfToken.push(refreshToken);
    const user = await User.findOne({ email });
    return res.json({
      accessToken,
      refreshToken,
      user,
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

const sendOTPPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const sendOTP = await twilioClient.verify
      .services(serviceId)
      .verifications.create({
        to: `+84${phone}`,
        channel: "sms",
      });
    if (sendOTP) {
      return res.status(200).json({
        status: 200,
        message: "Gửi mã OTP thành công!!!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: 400,
      message: "Gửi mã OTP không thành công!!!",
      code: "OTP",
    });
  }
};

const verifyOTPPhone = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    const verifyOTP = await twilioClient.verify
      .services(serviceId)
      .verificationChecks.create({
        to: `+84${phone}`,
        code: code,
      });
    if (verifyOTP.valid) {
      return res.status(200).json({
        status: 200,
        message: "Mã OTP chính xác!!!",
      });
    }
    if (!verifyOTP.valid) {
      return res.json({
        status: 400,
        message: "Mã OTP chưa chính xác!!!",
      });
    }
  } catch (error) {
    return res.json({
      status: 401,
      message: "Mã OTP chưa được lấy!!!",
    });
  }
};

const sendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const code = JSON.stringify(Math.floor(1000 + Math.random() * 9000));
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        type: "OAuth2",
        user: "user@example.com",
        accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x",
      },
    });
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: `${email}`,
      subject: "Web Toyskid gửi mã xác nhận",
      html: "Xin chào,<br> Mã xác nhận của bạn là:<br>" + code,
    });
    return res.json({
      status: 200,
      message: "Gửi mã xác nhận thành công!!!",
      code: code,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);
    if (!rfToken.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { userID: data.userID },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3600s" }
      );
      return res.status(200).json(accessToken);
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    rfToken = rfToken.filter((refTK) => refTK !== refreshToken);
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const checkPhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const foundPhone = await User.findOne({ phone });
    if (foundPhone) {
      return res.status(200).json(200);
    }
    if (!foundPhone) {
      return res.json(403);
    }
  } catch (error) {
    next(error);
  }
};
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      return res.status(200).json(200);
    }
    if (!foundEmail) {
      return res.json(403);
    }
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { emailPhone, newPassword } = req.body;
    const foundUserPhone = await User.findOne({ phone: emailPhone });
    const foundUserEmail = await User.findOne({ email: emailPhone });
    if (!foundUserPhone && !foundUserEmail)
      return res
        .status(403)
        .json({ error: { message: "Không tìm thấy Tài khoản!!!" } });

    if (foundUserPhone) {
      const hashedNewPassword = await bcrypt.hashSync(newPassword, 10);
      foundUserPhone.password = hashedNewPassword;
      await foundUserPhone.save();
    }
    if (foundUserEmail) {
      const hashedNewPassword = await bcrypt.hashSync(newPassword, 10);
      foundUserEmail.password = hashedNewPassword;
      await foundUserEmail.save();
    }

    return res.status(200).json({
      Status: "success",
      message: "Đổi mật khẩu thành công!!!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUpByEmail,
  signUpByPhone,
  signInByPhone,
  signInByEmail,
  sendOTPPhone,
  verifyOTPPhone,
  sendVerifyEmail,
  refreshToken,
  logout,
  checkPhone,
  checkEmail,
  forgetPassword,
};
