const Section = require("../model/Section");
const SubSection = require("../model/SubSection");
const { ImageUploader } = require("../utils/ImageUploader");
require("dotenv").config();
//create subsection
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files.video;
    if (!title) {
      return res.status(500).json({
        success: false,
        message: "Title of subsection is missing",
      });
    }
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description of subsection is missing",
      });
    }
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "SectionID of subsection is missing",
      });
    }
    if (!video) {
      return res.status(400).json({
        success: false,
        message: "Video is missing",
      });
    }

    //upload file to cloudinary

    const uploadDetails = await ImageUploader(video, process.env.FOLDER_NAME);
    const SubSectiondetail = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    const updatedsectionDetail = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectiondetail._id,
        },
      },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Subsection created Successfully",
      data: updatedsectionDetail,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Issue While creating subSection",
      error: error.message,
    });
  }
};
//update subsection
exports.updateSubsection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await ImageUploader(video, process.env.FOLDER_NAME);
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      data: updatedSection,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

//delete Subsection
exports.deleteSubsection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    );
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    return res.json({
      success: true,
      data: updatedSection,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};

//tested create subsection ,update ,delete
