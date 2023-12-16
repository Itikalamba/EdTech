import React from "react";
import HighLightText from "../HomePage/HighLightText";

const Quote = () => {
  return (
    <div
      className="text-richblack-200  text-3xl font-bold w-11/12 mx-auto mt-32 mb-24    leading-9 text-center  max-w-maxContent
     "
    >
      <span className="text-richblack-600 ">"</span> We are passionate about
      revolutionizing the way we learn. Our innovative platform
      <HighLightText text={" combines technology"} />
      <span className="text-brown-500"> expertise</span>, and community to
      create an
      <span className="text-yellow-400 ">
        {" "}
        unparalleled educational experience.
      </span>{" "}
      <span className="text-richblack-600 ">"</span>
    </div>
  );
};

export default Quote;
