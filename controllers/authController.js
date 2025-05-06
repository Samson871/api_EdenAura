const {
  createHashPassword,
  comparePassword,
} = require("../helpers/authHelper");
const User = require("../models/userModel");

const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    if (!phone) {
      return res.status(400).send({ message: "Phone number is required" });
    }
    if (!address) {
      return res.status(400).send({ message: "Address is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "answer is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    const hashedPassword = await createHashPassword(password);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    });

    await newUser.save();
    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      User: newUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error in registerController,
      error: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email) {
      return res.status(400).send({
        success: false,
        message: "email or phone is required",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required",
      });
    }


    const user = await User.findOne({ $or: [{ email }, { phone: email }] });
    if (!user) {
      return res.status(400).send({
      success: false,
      message: "No user found with this email or phone number",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller",
      error: error.message,
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: " email is required",
      });
    }
    if (!answer) {
      return res.status(400).send({
        success: false,
        message: "Answer is required",
      });
    }
    if (!newPassword) {
      return res.status(400).send({
        success: false,
        message: "New password is required",
      });
    }

    const user = await User.findOne({ $or: [{ email }, { phone: email }] });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "No user found with this email",
      });
    }
    
    const hashedPassword = await createHashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password controller",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
};
