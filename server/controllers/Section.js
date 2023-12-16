const Section = require("../model/Section");
const Course = require("../model/Course");
const SubSection = require("../model/SubSection");

//add a section
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course Id missing",
      });
    }
    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section name is  missing",
      });
    }
    const newSection = await Section.create({ sectionName });
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { courseContent: newSection._id },
      },
      {
        new: true,
      }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "Section created succesfully",
      updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section",
      error: error.message,
    });
  }
};

//update section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "section Id missing",
      });
    }
    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section name is  missing",
      });
    }
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { sectionName },
      { new: true }
    );
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "Section updated succesfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};

//delete section
exports.deleteSection = async (req, res) => {
  try {
    //id will be get from params
    const { sectionId, courseId } = req.body;
    // const { SectionId } = req.params;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }
    //delete all sub-section contained in section model-subsection field
    await SubSection.deleteMany({ _id: { $in: section.subSection } });
    //finaaly section deleted
    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted successfully !",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete Section",
      error: error.message,
    });
  }
};

//tested section create,update,delete
