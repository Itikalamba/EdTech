const { passwordReset } = require("../mail/templates/PasswordReset");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const User = require("../model/User");
const { mailsender } = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//reset password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    //fetch from req body
    const email = req.body.email;
    //validation from email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered!!",
      });
    }

    //generate token
    const token = crypto.randomUUID();
    //token expiration update in url
    const updateddetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );
    console.log(updateddetails);
    // create url

    const url = `http://localhost:3000/update-password/${token}`;
    //send mail
    await mailsender(
      email,
      "Password Reset Link",
      passwordReset(email, user.firstName, url)
    );
    return res.status(200).json({
      success: true,
      message: "Password Reset Mail sent Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while sending Mail.",
      error: error.message,
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both passwords are not same!",
      });
    }
    const userDetails = await User.findOne({ token: token });
    console.log("User Details", userDetails);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token, No user exists with this token!",
      });
    }
    if (Date.now() > userDetails.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Token is expired,Please regenerate token",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    await mailsender(
      userDetails.email,
      "Password Changed successfully ",
      passwordUpdated(userDetails.email, userDetails.firstName)
    );
    return res.status(200).json({
      success: true,
      message: "Hurrah !,Password Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went Wrong while updating Password",
      error: error.message,
    });
  }
};
