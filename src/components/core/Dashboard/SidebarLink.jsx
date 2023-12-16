import React from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { NavLink, matchPath, useLocation } from "react-router-dom";
const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName];
  const dispatch = useDispatch();
  const location = useLocation();
  function handleClick() {
    return true;
  }
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={`relative px-8 py-2 text-sm  font-medium ${
        matchRoute(link.path)
          ? "bg-yellow-400 bg-opacity-40 text-yellow-50 font-bold"
          : "bg-opacity-0"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-300 
          ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}
      ></span>
      <div className="flex items-center gap-x-2">
        <Icon
          className={` text-lg ${
            matchRoute(link.path)
              ? " text-yellow-50 font-bold"
              : "text-richblack-200 "
          }`}
        ></Icon>
        <span
          className={` font-medium ${
            matchRoute(link.path)
              ? " text-yellow-50 font-bold"
              : "text-richblack-200 "
          }`}
        >
          {link.name}
        </span>
      </div>
    </NavLink>
  );
};

export default SidebarLink;
