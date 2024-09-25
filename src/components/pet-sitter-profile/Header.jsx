import React from "react";
import { ImNotification } from "react-icons/im";
import { useProfile } from "@/context/PetSitterProfileContext";

export default function Header({ onSubmit, onRequest }) {
  const { profileData } = useProfile();
  const status = profileData.status || "";
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-6">
          <div className="text-head3 text-[#2A2E3F]">Pet Sitter Profile</div>
          <div
            className={`animate-pulse text-[16px] font-medium ${
              status === "Approved"
                ? "text-green-500"
                : status === "Waiting for approve"
                ? "text-pink-500"
                : status === "Rejected"
                ? "text-red"
                : "text-gray-100"
            }`}
          >
            • {status}
          </div>
        </div>
        {!status ? (
          <button
            type="submit"
            className="text-white font-bold rounded-full p-[12px_24px] hover:bg-orange-400 active:bg-orange-600 bg-orange-500"
            // onClick={onRequestApproval}
            onClick={onRequest}
          >
            Request for approval
          </button>
        ) : (
          <button
            type="submit"
            className="text-white font-bold rounded-full p-[12px_24px] hover:bg-orange-400 active:bg-orange-600 bg-orange-500"
            onClick={onSubmit}
          >
            Update
          </button>
        )}
      </div>
      {status === "Rejected" && (
        <div className="text-red bg-gray-200 flex justify-start items-center p-[12px] gap-[10px] rounded-[8px]">
          <ImNotification className="w-[20px] h-[20px]" />
          Your request has not been approved: ‘Admin’s suggestion here’
        </div>
      )}
    </div>
  );
}
