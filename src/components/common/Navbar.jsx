"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";


// import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegComments } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { PiBell } from "react-icons/pi";
import LogoutModal from "../confirm-logout/LogoutModal";
function Navbar({ session }) {
  const [isShow, setIsShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const router = useRouter();
  function handleDropDown() {
    console.log("first");
    setIsOpen(!isOpen); // Toggle dropdown visibility
  }
  const handleOpenModal = () => {
    setConfirmLogout(true);
  };
  const handleCloseModal = () => {
    setConfirmLogout(false);
  };
  

  return (
    <nav className="w-full h-[80px] p-[12px_20px] flex justify-center items-center text-center lg:p-[0px_80px]">
      <div className="flex justify-between items-center text-center max-w-[1440px] p- w-full">
        <img
          src="/logo-black.png"
          className="w-[78.97px] h-[24px] sm:w-[131.61px] sm:h-[40px] cursor-pointer"
          onClick={() => router.push("/")}
        />
        {!session && (
          <div className="flex lg:gap-4 gap-0 text-body1 text-black max-sm:hidden">
            <Link
              href="/login/sitter"
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
        {session && (
          <div className="flex gap-6 items-center max-sm:hidden">
            <div className="flex gap-2 relative">
              <div className="w-[48px] h-[48px] bg-gray-100 rounded-full flex justify-center items-center">
                <PiBell className="w-[24px] h-[24px] text-gray-400" />
              </div>
              <div className="w-[48px] h-[48px] bg-gray-100 rounded-full flex justify-center items-center">
                <FaRegComments className="w-[24px] h-[24px] text-gray-400" />
              </div>
              <button
                className="w-[48px] h-[48px] bg-gray-100 rounded-full flex justify-center items-center"
                onClick={handleDropDown}
              >
                <FaRegUser className="w-[24px] h-[24px] text-gray-400" />
              </button>
              {/* drop down */}
              {isOpen && (
                <div className="absolute top-full right-0 z-10 mt-2">
                  <nav className="flex flex-col justify-center rounded-[4px] w-[182px] h-[192px] items-center bg-gray-100 text-body1R text-gray-400 shadow-lg shadow-black/50">
                    <ul className="w-full flex flex-col gap-4 p-[20px]">
                      <li className="flex justify-start items-center gap-4 active:text-gray-300">
                        <a>cat</a>
                      </li>
                      <li className="flex justify-start items-center gap-4 active:text-gray-300">
                        <a href="#">Profile</a>
                      </li>
                      <li className="flex justify-start items-center gap-4 active:text-gray-300">
                        <a href="#">Reset password</a>
                      </li>
                      <hr className="text-gray-200" />
                      <li className="flex justify-start items-center gap-4 active:text-gray-300">
                        <button onClick={handleOpenModal}>Logout</button>
                      </li>
                      <LogoutModal
                        isOpen={confirmLogout}
                        onClose={handleCloseModal}
                      />
                    </ul>
                  </nav>
                </div>
              )}
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
      </div>
    </nav>
  );
}

export default Navbar;
