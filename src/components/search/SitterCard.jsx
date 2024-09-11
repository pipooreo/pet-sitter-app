"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { PiPawPrintDuotone } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";

function SitterCard({ data }) {
  //   console.log(sitter.id);
  const [sitter, setSitter] = useState(data);

  return (
    <div
      className="flex flex-col gap-4 items-center rounded-2xl bg-white w-full"
      key={sitter.id}
    >
      <div className="rounded-2xl p-4 flex flex-col gap-4 xl:flex-row lg:gap-10 lg:w-full">
        <img
          src={sitter.gallery[1] || sitter.gallery[0]}
          className="w-[311px] h-[100px] rounded-lg lg:w-[245px] lg:h-[184px]  object-cover"
          // alt="sitter"
        />
        <div className="flex flex-col gap-2 lg:gap-6 lg:w-full">
          <div className="flex gap-4 justify-between w-full">
            <div className="flex gap-4 ">
              {sitter.profile_image ? (
                <img
                  src={sitter.profile_image}
                  className="w-[36px] h-[36px] lg:w-[64px] lg:h-[64px] rounded-full"
                  //   alt="profile"
                />
              ) : (
                <div className="w-[36px] h-[36px] lg:w-[64px] lg:h-[64px] rounded-full flex justify-center items-center border ">
                  <AiOutlineUser className="w-[36px] h-[36px] text-gray-200" />
                </div>
              )}

              <div className="flex flex-col flex-1">
                <h3 className="text-black text-[18px] leading-6 font-bold lg:text-head3  ">
                  {sitter.trade_name}
                </h3>
                <p className="text-body3 lg:text-body1 text-black">
                  By {sitter.name}
                </p>
              </div>
            </div>
            <div className="flex gap-[2px] p-[6px] rounded-lg">
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <FaStar
                    className="text-green-500 w-[12px] h-[12px] lg:w-[20px] lg:h-[20px]"
                    key={index}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-between text-gray-400 items-center">
            <div className="flex gap-[6px] text-gray-400 items-center">
              <SlLocationPin className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]" />
              <p className="text-body3 lg:text-body2">Senanikom, Bangkok</p>
            </div>
            <div className="flex gap-[6px] text-gray-400 items-center mr-2">
              <PiPawPrintDuotone className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]" />
              <p className="text-body3 lg:text-body2">
                {sitter.experience} Years
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {sitter.pet_type.map((item, index) => {
              if (item) {
                return item === "Dog" ? (
                  <div
                    className="rounded-[99px] p-[4px_16px] border border-green-500 bg-green-100 text-green-500"
                    key={index}
                  >
                    {item}
                  </div>
                ) : item === "Cat" ? (
                  <div
                    className="rounded-[99px] p-[4px_16px] border border-pink-500 bg-pink-100 text-pink-500"
                    key={index}
                  >
                    {item}
                  </div>
                ) : item === "Bird" ? (
                  <div
                    className="rounded-[99px] p-[4px_16px] border border-blue-500 bg-blue-100 text-blue-500"
                    key={index}
                  >
                    {item}
                  </div>
                ) : (
                  <div
                    className="rounded-[99px] p-[4px_16px] border border-orange-500 bg-orange-100 text-orange-500"
                    key={index}
                  >
                    {item}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SitterCard;
