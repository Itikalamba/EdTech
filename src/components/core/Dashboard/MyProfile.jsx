import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-richblack-5 font-bold text-3xl mb-4">My Profile</h1>
      <div className="flex flex-col gap-y-6">
        {/* section1 */}
        <div className="bg-richblack-800 p-4 px-6 rounded-md flex justify-between">
          <div className=" flex gap-x-3  items-center">
            <img
              className="aspect-square w-[78px] rounded-full object-cover"
              src={user.image}
              alt=""
            ></img>
            <div className="text-richblack-5">
              <p className="font-bold">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate("/dashboard/settings");
              }}
              className="flex gap-x-2 items-center text-richblack-800 bg-yellow-25 rounded-sm font-medium py-2 px-4 "
            >
              <p>Edit</p>
              <BiEdit></BiEdit>
            </button>
          </div>
        </div>
        {/* section2 */}
        <div className="bg-richblack-800 p-4 px-6 rounded-md flex justify-between">
          <div className="text-richblack-5 flex flex-col gap-y-3">
            <p className="font-bold">About </p>
            <p className="text-richblack-400 ">
              {user?.additionalDetails?.about ?? "Add something about Yourself"}
            </p>
          </div>
          <div className="">
            <button
              onClick={() => {
                navigate("/dashboard/settings");
              }}
              className="flex gap-x-2 items-center text-richblack-800 bg-yellow-25 rounded-sm font-medium py-2 px-4 "
            >
              <p>Edit</p>
              <BiEdit></BiEdit>
            </button>
          </div>
        </div>
        {/* section3 */}
        <div className="bg-richblack-800 p-4 px-6 rounded-md flex justify-between">
          <div className="flex flex-col gap-y-3 w-2/4 ">
            <p className="font-bold text-richblack-5  ">Personal Details</p>
            <div className="flex flex-col gap-y-3">
              <div className="flex items-center gap-x-4">
                <div className="flex flex-col gap-y-1 w-1/2">
                  <p className="text-richblack-400 ">First Name</p>
                  <p className="text-richblack-5 font-medium ">
                    {user?.firstName}
                  </p>
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-richblack-400 ">Last Name</p>
                  <p className="text-richblack-5 font-medium ">
                    {user?.lastName}
                  </p>
                </div>
              </div>
              {/* email and number */}
              <div className="flex  items-center gap-x-4">
                <div className="flex flex-col gap-y-1 w-1/2">
                  <p className="text-richblack-400 ">Email</p>
                  <p className="text-richblack-5 font-medium ">{user?.email}</p>
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-richblack-400 ">Phone Number</p>
                  <p className="text-richblack-5 font-medium ">
                    {user?.additionalDetails?.contactNumber ??
                      "Add Contact Number"}
                  </p>
                </div>
              </div>
              {/* gender and birth */}
              <div className="flex  items-center gap-x-4">
                <div className="flex flex-col gap-y-1 w-1/2">
                  <p className="text-richblack-400 ">Gender</p>
                  <p className="text-richblack-5 font-medium ">
                    {user?.additionalDetails?.gender ?? "Add Your Gender"}
                  </p>
                </div>
                <div className="flex flex-col gap-y-1">
                  <p className="text-richblack-400 ">Date Of Birth</p>
                  <p className="text-richblack-5 font-medium ">
                    {user?.additionalDetails?.dateofbirth ??
                      "Add Date of Birth"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* button */}
          <div className="">
            <button
              onClick={() => {
                navigate("/dashboard/settings");
              }}
              className="flex gap-x-2 items-center text-richblack-800 bg-yellow-25 rounded-sm font-medium py-2 px-4 "
            >
              <p>Edit</p>
              <BiEdit></BiEdit>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
