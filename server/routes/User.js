const express = require("express");
const {
  signup,
  login,
  sendOtp,
  changePassword,
} = require("../controllers/Auth");

const router = express.Router();

const { auth } = require("../middleware/auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");
// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

//user login signup
router.post("/signup", signup);
router.post("/login", login);

//route for sending otp to user's mail
router.post("/sendotp", sendOtp);

//route for changing password
router.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password
// *************************************************************
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for restting user's password verification
router.post("/reset-password", resetPassword);
module.exports = router;
