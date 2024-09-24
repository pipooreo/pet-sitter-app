import { red } from "@mui/material/colors";
import React from "react";

export default function Header() {
  const status = "Approved";
  return (
    <div className=" p-[16px_60px] flex justify-between items-center">
      <div className="flex items-center gap-6">
        <div className="text-head3 text-[#2A2E3F]">Pet Sitter Profile</div>
        <div
          className={`animate-pulse text-[16px] font-medium ${
            status === "Approved"
              ? "text-green-500"
              : status === "Waiting for approve"
              ? "text-pink-500"
              : "text-red"
          }`}
        >
          • {status}
        </div>
      </div>
      <button className="text-white font-bold rounded-full p-[12px_24px] hover:bg-orange-400 active:bg-orange-600 bg-orange-500">
        {status === "Approved" ? "Update" : "Request for approval"}
      </button>
    </div>
  );
}
