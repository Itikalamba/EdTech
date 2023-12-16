const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const mongoose = require("mongoose");
const { mailsender } = require("../utils/mailSender");
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  otp: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});
async function sendVerificationMail(email, otp) {
  try {
    const mailResponse = await mailsender(
      email,
      "Verification Email from StudyNotion",
      emailTemplate(otp)
    );
    console.log("Email sent successfully !!", mailResponse.response);
  } catch (error) {
    console.log("Error occured while sending mail: ", error);
    // throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New document saved to database");
  if (this.isNew) {
    await sendVerificationMail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("Otp", otpSchema);

module.exports = OTP;
