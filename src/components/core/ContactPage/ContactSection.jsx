import React from "react";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  return (
    <div className="flex flex-col p-7 border  rounded-md border-richblack-500">
      <h1 className="text-3xl font-bold text-richblack-5">
        Got an idea? We've got the skills.
        <br></br>
        Let's team up{" "}
      </h1>
      <p className="text-richblack-300 font-bold mb-3 ">
        Tell us more about yourself and what you're got in mind.
      </p>
      <ContactForm></ContactForm>
    </div>
  );
};

export default ContactSection;
