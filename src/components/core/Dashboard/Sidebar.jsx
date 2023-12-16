import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../common/Spinner";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import CnfrmModal from "../../common/CnfrmModal";

const Sidebar = () => {
  const [confirmationmodal, setconfirmationmodal] = useState(null);
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: authLoading } = useSelector((state) => state.auth);
  if (profileLoading || authLoading) {
    return (
      <div className="w-[100vw] h-[100vh] flex place-items-center">
        <Spinner></Spinner>
      </div>
    );
  }
  return (
    <div>
      <div
        // h-[calc(100vh-3.5rem)]
        className="flex min-w-[222px]
       flex-col border-r-[1px]
        border-r-richblue-700 
        h-[100%]
         bg-richblack-800 py-10"
      >
        <div className="flex flex-col">
          {sidebarLinks.map((link, id) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink
                link={link}
                iconName={link.icon}
                key={link.id}
              ></SidebarLink>
            );
          })}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600"></div>
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "dashboard/settings" }}
            iconName="VscSettingsGear"
          ></SidebarLink>
          <button
            onClick={() =>
              setconfirmationmodal({
                text1: "Are You Sure ?",
                text2: "You will be logged out of your Account",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1handler: () => dispatch(logout(navigate)),
                btn2handler: () => setconfirmationmodal(null),
              })
            }
            className="text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2 px-8 py-2">
              <VscSignOut className="text-lg"></VscSignOut>
              <span>Logout</span>
            </div>
          </button>
        </div>
        {confirmationmodal && (
          <CnfrmModal modalData={confirmationmodal}></CnfrmModal>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
