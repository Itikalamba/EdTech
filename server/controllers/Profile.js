const User = require("../model/User");
const Profile = require("../model/Profile");
const CourseProgress = require("../model/CourseProgress");
const Course = require("../model/Course");

const { ImageUploader } = require("../utils/ImageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

//update profile
exports.updateProfile = async (req, res) => {
  try {
    const { dateofbirth = "", about = "", gender, contactNumber } = req.body;
    const id = req.user.id;
    // if (!dateofbirth || !about || !gender || !contactNumber || !id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields are Mandatory!",
    //     error: error.message,
    //   });
    // }
    const UserDetail = await User.findById(id);
    if (!UserDetail) {
      return res.status(404).json({
        success: false,
        message: "User  Details not found !",
      });
    }
    const profiledetails = await Profile.findById({
      _id: UserDetail.additionalDetails,
    });
    console.log("profileDetails--", profiledetails);
    profiledetails.about = about;
    profiledetails.contactNumber = contactNumber;
    profiledetails.dateofbirth = dateofbirth;
    profiledetails.gender = gender;
    await profiledetails.save();
    UserDetail.additionalDetails = profiledetails;
    return res.status(200).json({
      success: true,
      message: "Profile Updated Succesfully!",
      UserDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Profile Updation failed!",
      error: error.message,
    });
  }
};

//delete profile
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.user;

    const userDetail = await User.findById({ _id: id });

    if (!userDetail) {
      return res.status(404).json({
        success: false,
        message: "User not found  ,May be it is deleted already !",
      });
    }
    console.log("additionaldeatil", userDetail.additionalDetails);
    console.log(id);
    await Profile.findByIdAndDelete({ _id: userDetail.additionalDetails });
    await User.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Account Deleted Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile Deletion failed!",
      error: error.message,
    });
  }
};

//get all detail of user
exports.getAlldetail = async (req, res) => {
  try {
    const { id } = req.user;
    const userDetail = await User.findById(id)
      .populate("additionalDetail")
      .exec();
    console.log("Complete detail of User", userDetail);
    return res.status(200).json({
      success: true,
      message: "Profile fetched Successfully!",
      userDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile Detail is not available ",
      error: error.message,
    });
  }
};
//update profile photo

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await ImageUploader(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    var SubsectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentenrolled.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res.status(200).json({ courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
