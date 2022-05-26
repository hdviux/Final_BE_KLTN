const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, message: "Access Token Not Found!!!" });
  try {
    const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET);
    req.userID = decoded.userID;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid Token!!!" });
  }
};
module.exports = { verifyToken };
