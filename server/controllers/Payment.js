const User = require("../model/User");
const Course = require("../model/Course");
const { instance } = require("../config/razorpay");
const { default: mongoose } = require("mongoose");

const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const { mailsender } = require("../utils/mailSender");
const CourseProgress = require("../model/CourseProgress");

exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (courses.length === 0) {
    return res.json({ success: false, message: "Please provide Course Id" });
  }
  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(400)
          .json({ success: false, message: "Could not find the course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentenrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  };
  // console.log("before creating instance");
  try {
    const paymentResponse = await instance.orders.create(options);
    console.log("paymentRespons", paymentResponse);
    return res.status(200).json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, mesage: "Could not Initiate Order" });
  }
};

//verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enroll karwao student ko
    await enrollStudents(courses, userId, res);
    //return res
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: "false", message: "Payment Failed" });
};
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for Courses or UserId",
    });
  }

  for (const courseId of courses) {
    try {
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentenrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, message: "Course not Found" });
      }

      const courseProgress = await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      });
      //find the student and add the course to their list of enrolledCOurses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      ///bachhe ko mail send kardo
      await mailsender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
      //console.log("Email Sent Successfully", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    //student ko dhundo
    const enrolledStudent = await User.findById(userId);
    await mailsender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};

// exports.paymentCapture = async (req, res) => {
//   try {
//     const { course_id } = req.body;
//     const userid = req.user.id;
//     if (!course_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Please give a valid Course Id!",
//         error: error.message,
//       });
//     }
//     let course;
//     try {
//       course = await Course.findById(course_id);
//       if (!course) {
//         return res.status(400).json({
//           success: false,
//           message: "Course details missing or invalid !",
//           error: error.message,
//         });
//       }
//       //user already payed for the course
//       const uid = new mongoose.Types.ObjectId(userid);
//       if (Course.studentenrolled.includes(uid)) {
//         return res.status(400).json({
//           success: false,
//           message: "You have already enrolled in the above Course.",
//           error: error.message,
//         });
//       }
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         error: error.message,
//       });
//     }

//     //order create
//     const amount = course.price;
//     const currency = "INR";
//     const options = {
//       amount: amount * 100,
//       currency,
//       receipt_no: Math.random(Date.now()).toString(),
//       notes: {
//         CourseId: course._id,
//         userId: userid,
//       },
//     };
//     try {
//       //initiate payment using razorpay
//       const paymentResponse = await instance.orders.create(options);
//       console.log(paymentResponse);
//       //return response
//       return res.status(200).json({
//         success: true,
//         courseName: course.courseName,
//         courseDescription: courseDescription,
//         thumbnail: course.Thumbnail,
//         price: paymentResponse.amount,
//         orderid: paymentResponse.id,
//         currency: paymentResponse.currency,
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: "Order creation failed!",
//         error: error.message,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error while capturing Payment or couldn't initiate payment",
//       error: error.message,
//     });
//   }
// };

// //verify signature server secret matching with razorpay sent secret
// exports.verifySignature = async (req, res) => {
//   try {
//     const webhookSecret = process.env.WEBHOOK_SECRET;
//     const signature = req.headers("x-razorpay-signature");
//     //important to convert webhooksecret to same as razorypay encrypted secret sent by razorpay
//     c;
//     const shasum = crypto.createHmac("sha256", webhookSecret);

//     //string me convert krdia output
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");
//     if (digest === signature) {
//       console.log("Payment is authorised ");
//       const { userId, CourseId } = req.body.payload.payment.entity.notes;
//       try {
//         const enrolledCourse = await Course.findByIdAndUpdate(
//           { _id: CourseId },
//           {
//             $push: {
//               studentenrolled: userId,
//             },
//           },
//           { new: true }
//         );
//         console.log(enrolledCourse);
//         if (!enrolledCourse) {
//           return res.status(403).json({
//             success: false,
//             message: "Course not found !",
//           });
//         }
//         //update in student model
//         const enrolledstudent = await User.findByIdAndUpdate(
//           { _id: userId },
//           {
//             $push: {
//               courses: CourseId,
//             },
//           },
//           { new: true }
//         );
//         console.log(enrolledstudent);
//         const mailresponse = await mailSender(
//           enrolledstudent.email,
//           "Congratulations from studyNotion",
//           "Confgratulations ! You are enrolled in the new course "
//         );
//         console.log(mailresponse);
//         return res.status(200).json({
//           success: true,
//           message:
//             "signature is verified and course is succesfully enrolled...",
//         });
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Error while updataing the course enrollment in student & course model ",
//           error: error.message,
//         });
//       }
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Signatures not matched ! ",
//         error: error.message,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server Error while verifying secrets! ",
//       error: error.message,
//     });
//   }
// };
