const express = require("express");
const router = express.Router();

const { auth, isInstructor } = require("../middleware/auth");
const {
  updateProfile,
  deleteAccount,
  getAlldetail,
  getEnrolledCourses,
  updateDisplayPicture,
  instructorDashboard,
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteAccount);
router.get("/getUserDetails", auth, getAlldetail);
//get enrolled Courses
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

router.get("/getEnrolledCourses", auth, getEnrolledCourses);
//update profile picture
router.put("/updateProfilePicture", auth, updateDisplayPicture);
module.exports = router;
