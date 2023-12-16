import React from "react";

const Error = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-richblack-900  ">
      <div className="bg-richblack-800  p-8 rounded shadow-md">
        <h1 className="text-4xl text-pink-500 font-semibold mb-4">
          Oops! Error 404
        </h1>
        <p className="text-richblack-5  text-lg">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
};

export default Error;
