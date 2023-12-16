import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../../data/countrycode.json";
import { apiConnector } from "../../../services/apiconnector";
import { contactusEndpoint } from "../../../services/apis";
import toast from "react-hot-toast";
// import { apiConnector } from "../../../services/apiconnector";
// import { contactusEndpoint } from "../../../services/apis";
const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging Data", data);
    try {
      setLoading(true);
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      if (!response) console.log("yha p");
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // const response = { status: "OK" };
      toast.success("Message sent Successfully!");
      console.log("Logging response", response);
      setLoading(false);
    } catch (error) {
      console.log("Error in contact form--", error.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [isSubmitSuccessful, reset]);
  return (
    <div className="mt-10 ">
      <form
        onSubmit={handleSubmit(submitContactForm)}
        className="flex flex-col gap-y-4"
      >
        <div className="flex gap-4">
          {/* firstname */}
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="firstname"
              className="mb-1 leading-[1.375rem] text-richblack-5"
            >
              First Name <sup className="text-pink-200">*</sup>
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter first name"
              {...register("firstname", { required: true })}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            ></input>
            {errors.firstname && (
              <span className="text-pink-400 ">
                Please enter your first name
              </span>
            )}
          </div>
          {/* lastname */}
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="lastname"
              className="mb-1 leading-[1.375rem] text-richblack-5"
            >
              Last Name{" "}
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter last name"
              {...register("lastname")}
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            ></input>
          </div>
        </div>
        {/* email */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="email"
            className="mb-1  leading-[1.375rem] text-richblack-5"
          >
            Email Address <sup className="text-pink-200">*</sup>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email address"
            {...register("email", { required: true })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          ></input>
          {errors.email && (
            <span className="text-pink-300 ">Please enter your email</span>
          )}
        </div>

        {/* {phoneNo} */}
        <div className="flex flex-col">
          <label
            htmlFor="phonenumber"
            className="mb-1 leading-[1.375rem] text-richblack-5"
          >
            Phone Number
          </label>

          <div className="flex flex-row gap-1">
            {/* dropdown */}

            <select
              name="dropdown"
              id="dropdown"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className=" w-[80px] rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((element, index) => {
                return (
                  <option key={index} value={element.code}>
                    {element.code} -{element.country}
                  </option>
                );
              })}
            </select>

            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className=" rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5 w-[calc(100%-90px)]"
              {...register("phoneNo", {
                required: { value: true, message: "Please enter Phone Number" },
                maxLength: { value: 10, message: "Invalid Phone Number" },
                minLength: { value: 8, message: "Invalid Phone Number" },
              })}
            />
          </div>
          {errors.phoneNo && (
            <span className="text-pink-300 ">{errors.phoneNo.message}</span>
          )}
        </div>
        {/* message */}
        <div className="flex flex-col gap-y-2">
          <label
            htmlFor="message"
            className="mb-1  leading-[1.375rem] text-richblack-5"
          >
            Message <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            type="text"
            name="message"
            id="message"
            cols="30"
            placeholder="Enter your message"
            {...register("message", { required: true })}
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          ></textarea>
          {errors.email && (
            <span className="text-pink-300 ">Please enter your Message</span>
          )}
        </div>
        <button
          className="text-center text-[14px] px-6 py-3 rounded-md font-bold bg-yellow-50
         text-black  hover:scale-95 transition-all duration-200 mt-5 mx-auto"
          type="submit"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
