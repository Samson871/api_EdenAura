const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/userModel.js");

dotenv.config();
//protected routes token base

const requireSignIn= (req,res,next)=>{
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Access denied, no token provided",
      });
    }
    const decoded = JWT.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
}

//Admin middleware
const isAdmin = async(req, res, next) => {
  try {
    console.log("User ID from token:", req.user); // Log the user ID from the token
    const user = await User.findById(req.user.id);
    console.log("User role from database:", user.role); // Log the user object retrieved from the database
    if(user.role !== "1") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized, admin access denied", 
      });
    }
    else {
      next();
    }
  } catch (error) {
    
    return res.status(500).send({
      success: false,
      message: "Server error in Admin middleware",
      error: error.message,
    });
  }
};

module.exports = {requireSignIn,isAdmin};