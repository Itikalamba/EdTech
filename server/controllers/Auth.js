const Otp = require("../model/Otp");
const User = require("../model/User");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../model/Profile");
const jwt = require("jsonwebtoken");
const { mailsender } = require("../utils/mailSender");
const passwordUpdated = require("../mail/templates/passwordUpdate");

require("dotenv").config();
//send otp function
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserExist = await User.findOne({ email });
    if (checkUserExist) {
      return res.status(401).json({
        success: false,
        message: "User already registered !",
      });
    }
    var otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    let result = await Otp.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = OtpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      result = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await Otp.create(otpPayload);
    console.log(otpBody);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signup function

exports.signup = async (req, res) => {
  try {
    //data fetch
    const {
      email,
      firstName,
      lastName,
      password,
      confirmpassword,
      otp,
      accountType,
      phoneNo,
    } = req.body;

    //validate
    if (
      !firstName ||
      !lastName ||
      !password ||
      !confirmpassword ||
      !otp ||
      !email ||
      !accountType
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //password match
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password does not matched , Try Again !",
      });
    }
    //existing user
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered!",
      });
    }
    const recentotp = await Otp.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentotp);
    if (recentotp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found .",
      });
    } else if (otp !== recentotp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP,Not matched.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry in db
    const profiledetails = await Profile.create({
      gender: null,
      dateofbirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNo,
      additionalDetails: profiledetails._id,
      accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User Created Successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "please enter all details ! ",
      });
    }
    const user = await User.findOne({ email })
      .populate("additionalDetails")
      .exec();
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User is not registered ! ",
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        password: user.password,
        id: user._id,
        accountType: user.accountType,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httponly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        user,
        token,
        message: "Logged in successfully !",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect password  ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login Failed due to internal server error.. ",
      error: error.message,
    });
  }
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user

    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
      // If new password and confirm new password do not match, return a 400 (Bad Request) error
      return res.status(400).json({
        success: false,
        message: "The password and confirm password does not match",
      });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailsender(
        updatedUserDetails.email,
        "Password Updated Successfully",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      if (!emailResponse) {
        return res.status(403).json({
          success: false,
          message: "Error occurred while sending email",
        });
      }
      // console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
