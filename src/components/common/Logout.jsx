import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../services/operations/authAPI";
import { VscSignOut } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        dispatch(logout(navigate));
      }}
      className="flex w-full rounded items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
    >
      <VscSignOut className="text-lg" />
      Logout
    </div>
  );
};

export default Logout;
