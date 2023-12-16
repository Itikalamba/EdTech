const nodemailer = require("nodemailer");
require("dotenv").config();
exports.mailsender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service:'gmail',
      host: process.env.MAIL_HOST,
      port: 587,
      secure:false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = transporter.sendMail({
      from: '"StudyNotion ⚡⚡" <isha40470@gmail.com>',
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};
