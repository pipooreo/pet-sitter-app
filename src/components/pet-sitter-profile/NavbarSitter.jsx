import React from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { LuUser2 } from "react-icons/lu";
import Avatar from "@mui/material/Avatar";
export default function NavbarSitter() {
  const userAvatar = "";
  return (
    <div className=" bg-white p-[16px_60px] flex justify-between items-center sticky top-0 z-20">
      <div className="flex justify-center items-center gap-2">
        {userAvatar ? (
          <Avatar
            alt={userName}
            src={userAvatar}
            sx={{ width: 40, height: 40 }}
          />
        ) : (
          <div className="bg-gray-100 w-[40px] h-[40px] rounded-full flex justify-center items-center">
            <LuUser2 className="w-[20px] h-[20px] text-gray-400" />
          </div>
        )}
        <span className="text-body2 text-gray-600">{userAvatar}</span>
        <span className="text-body2 text-gray-600">Jane Maison</span>
      </div>
      <div className="rounded-full w-[40px] h-[40px] text-gray-400 bg-gray-100 flex justify-center items-center">
        <HiOutlineChatBubbleLeftRight className=" w-[20px] h-[20px]" />
      </div>
    </div>
  );
}
