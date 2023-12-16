const express = require("express");
const router = express.Router();

//course controller import
const {
  createNewCourse,
  getAllCourses,

  deleteCourse,
  editCourse,
  getInstructorCourses,
  getFullCourseDetails,
  getCourseDetails,
} = require("../controllers/Course");
//subsection import
const {
  updateSubsection,
  deleteSubsection,
  createSubSection,
} = require("../controllers/SubSection");
//categories import
const {
  createCategory,
  getAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");
//sections import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
//rating and review import
// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingANdReview");

//middlewares import
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middleware/auth");
const { updateCourseProgress } = require("../controllers/courseProgress");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

//courses created by instructors only
router.post("/createCourse", auth, isInstructor, createNewCourse);
//delete a course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// edit a course
router.post("/editCourse", auth, isInstructor, editCourse);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
//get all the courses of an instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
// ********************************************************************************************************
//                                      Section routes
// ********************************************************************************************************

//add a section to course
router.post("/addSection", auth, isInstructor, createSection);
// update a section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// ********************************************************************************************************
//                                      SubSection routes
// ********************************************************************************************************

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubsection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubsection);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", getAllCategory);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
