import React from "react";
import ContactForm from "../ContactPage/ContactForm";
// import ContactForm from "../ContactPage/ContactForm";

const ContactFormSection = () => {
  return (
    <div className="mx-auto flex flex-col w-11/12 max-w-maxContent place-items-center mt-9 mb-16">
      <h1 className="text-3xl font-bold text-richblack-5">Get in Touch</h1>
      <p className="text-richblack-300 font-bold mb-3 ">
        We'd love to here for you, Please fill out this form
      </p>
      {/* <ContactForm */}
      <ContactForm />
    </div>
  );
};

export default ContactFormSection;
