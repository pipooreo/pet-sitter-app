"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegComments } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { PiBell } from "react-icons/pi";

function Navbar() {
  const [isShow, setIsShow] = useState(false);
  const [isUser, setIsUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    // setIsUser("PiPo");
  }, []);

  return (
    <nav className="w-full h-[80px] p-[12px_20px] flex justify-center items-center text-center lg:p-[0px_80px]">
      <div className="flex justify-between items-center text-center max-w-[1440px] p- w-full">
        <img
          src="/logo-black.png"
          className="w-[78.97px] h-[24px] sm:w-[131.61px] sm:h-[40px] cursor-pointer"
          onClick={() => router.push("/")}
        />
        {isUser && (
          <div className="flex gap-6 items-center max-sm:hidden">
            <div className="flex gap-2">
              <div className="w-[48px] h-[48px] bg-gray-100 rounded-full flex justify-center items-center">
                <PiBell className="w-[24px] h-[24px] text-gray-400" />
              </div>
              <div className="w-[48px] h-[48px] bg-gray-100 rounded-full flex justify-center items-center">
                <FaRegComments className="w-[24px] h-[24px] text-gray-400" />
              </div>
              <div className="w-[48px] h-[48px] bg-gray-100 rounded-full flex justify-center items-center">
                <FaRegUser className="w-[24px] h-[24px] text-gray-400" />
              </div>
            </div>
            <Link
              href=""
              className="bg-orange-500 text-white rounded-full text-[16px] font-bold lg:p-[16px_24px] p-[16px_20px] hover:bg-orange-400 active:bg-orange-600"
            >
              Find A Pet Sitter
            </Link>
          </div>
        )}
        <div
          className="w-[24px] h-[24px] flex flex-col justify-around sm:hidden"
          onClick={() => setIsShow(!isShow)}
        >
          <div className="border-2 rounded border-gray-600"></div>
          <div className="border-2 rounded border-gray-600"></div>
          <div className="border-2 rounded border-gray-600"></div>
        </div>
        {!isUser && (
          <div className="flex lg:gap-4 gap-0 text-body1 text-black max-sm:hidden">
            <Link
              href="/register"
              className="lg:p-[16px_24px] p-[16px_20px] hover:text-gray-400 active:text-gray-600"
            >
              Become a Pet Sitter
            </Link>
            <Link
              href="/login"
              className="lg:p-[16px_24px] p-[16px_20px] hover:text-gray-400 active:text-gray-600"
            >
              Login
            </Link>
            <Link
              href=""
              className="bg-orange-500 text-white rounded-full text-[16px] font-bold lg:p-[16px_24px] p-[16px_20px] hover:bg-orange-400 active:bg-orange-600"
            >
              Find A Pet Sitter
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
