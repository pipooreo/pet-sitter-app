"use client";
import { useRouter } from "next/navigation";
import React from "react";

function HomeFooter() {
  const router = useRouter();
  return (
    <footer className="flex flex-col items-center justify-center md:p-[80px]">
      <div className="bg-yellow-100 flex flex-col items-center justify-center h-[469px] xl:w-[1280px] md:rounded-2xl w-full relative overflow-hidden">
        <div className="flex flex-col gap-10 w-[344px] md:w-[457px] items-center z-9">
          <h1 className="text-black text-head2 text-center md:text-head1">
            Perfect Pet Sitter For Your Pet
          </h1>
          <div className="flex flex-col gap-4 md:flex-row">
            <button
              className="text-orange-500 text-[16px] font-bold leading-6 text-center bg-orange-100 rounded-[99px] p-[12px_24px] hover:text-orange-400 active:text-orange-600"
              onClick={() => router.push("/login/sitter")}
            >
              Become A Pet Sitter
            </button>
            <button
              className="text-white text-[16px] font-bold leading-6 text-center bg-orange-500 rounded-[99px] p-[12px_24px] hover:bg-orange-400 active:bg-orange-600"
              onClick={() => router.push("/search?")}
            >
              Find A Pet Sitter
            </button>
          </div>
        </div>
        <div className="absolute flex justify-between w-full">
          <img
            src="/half-circle-blue.png"
            className="w-[248px] h-[124px] relative z-9 left-[-28px] top-[190px] md:w-[337px] md:h-[168px] md:left-[-2px] md:top-[150px]"
          />
          <div className="relative z-9 w-[188px] h-[161px] left-[-20px] top-[-158px]">
            <img
              src="/circle-yellow.png"
              className="w-[133.76px] h-[133.81px] absolute left-[34.38px] top-[-75.98px] md:w-[229px] md:h-[219px]"
            />
            <img
              src="/star-green.png"
              className="w-[111.57px] h-[108.68px] absolute left-[-30px] top-[25px] md:w-[191px] md:h-[186px] md:left-[-70px] md:top-[90px]"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
