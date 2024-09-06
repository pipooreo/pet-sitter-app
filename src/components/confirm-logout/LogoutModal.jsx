// components/Modal.js
"use client";

import React from "react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
const LogoutModal = ({ isOpen, onClose, setDropdownOpen }) => {
  const [buttonLoading, setButtonLoading] = useState(false);

  const router = useRouter();
  const handleLogout = async () => {
    setButtonLoading(true);
    try {
      localStorage.removeItem("rememberMe");
      await signOut({ redirect: false });
      toast.success("Logged out successfully!");
      onClose();
      setDropdownOpen(false);
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
      setButtonLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white  rounded shadow-lg w-[400px]">
        <div className="flex justify-between items-center border-b border-[#E4E6ED] p-6 text-black text-[20px] font-bold">
          <h2 className="text-xl">Logout Confirmation</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.41189 8L15.7119 1.71C15.9002 1.5217 16.006 1.2663 16.006 1C16.006 0.733701 15.9002 0.478306 15.7119 0.290002C15.5236 0.101699 15.2682 -0.00408936 15.0019 -0.00408936C14.7356 -0.00408936 14.4802 0.101699 14.2919 0.290002L8.00189 6.59L1.71189 0.290002C1.52359 0.101699 1.26819 -0.00408912 1.00189 -0.00408912C0.73559 -0.00408912 0.480196 0.101699 0.291892 0.290002C0.103588 0.478306 -0.00219941 0.733701 -0.00219941 1C-0.00219941 1.2663 0.103588 1.5217 0.291892 1.71L6.59189 8L0.291892 14.29C0.198164 14.383 0.12377 14.4936 0.0730009 14.6154C0.0222322 14.7373 -0.00390625 14.868 -0.00390625 15C-0.00390625 15.132 0.0222322 15.2627 0.0730009 15.3846C0.12377 15.5064 0.198164 15.617 0.291892 15.71C0.384855 15.8037 0.495456 15.8781 0.617315 15.9289C0.739175 15.9797 0.86988 16.0058 1.00189 16.0058C1.1339 16.0058 1.26461 15.9797 1.38647 15.9289C1.50833 15.8781 1.61893 15.8037 1.71189 15.71L8.00189 9.41L14.2919 15.71C14.3849 15.8037 14.4955 15.8781 14.6173 15.9289C14.7392 15.9797 14.8699 16.0058 15.0019 16.0058C15.1339 16.0058 15.2646 15.9797 15.3865 15.9289C15.5083 15.8781 15.6189 15.8037 15.7119 15.71C15.8056 15.617 15.88 15.5064 15.9308 15.3846C15.9816 15.2627 16.0077 15.132 16.0077 15C16.0077 14.868 15.9816 14.7373 15.9308 14.6154C15.88 14.4936 15.8056 14.383 15.7119 14.29L9.41189 8Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-start  gap-[24px] p-[24px]">
          <p className="text-gray-400 text-[16px] font-bold">
            You will be logged out, proceed?
          </p>
          <div className="flex justify-between w-full text-[16px] font-bold">
            <button
              className="bg-orange-100 rounded-full text-orange-500 hover:text-orange-400  active:text-orange-600 p-[12px_24px]  "
              onClick={onClose}
            >
              Close
            </button>

            <button
              className={`text-white rounded-full p-[12px_24px] ${
                buttonLoading
                  ? "cursor-not-allowed bg-gray-200"
                  : "hover:bg-orange-400 active:bg-orange-600 bg-orange-500"
              }`}
              onClick={handleLogout}
            >
              {buttonLoading ? (
                <BeatLoader size={10} color="#ff7037" />
              ) : (
                "Yes, I'm sure"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
