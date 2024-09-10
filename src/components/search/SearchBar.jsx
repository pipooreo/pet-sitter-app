"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Checkbox, FormControlLabel } from "@mui/material";

function SearchBar() {
  const petTypeList = ["Dog", "Cat", "Bird", "Rabbit"];
  const ratingList = [5, 4, 3, 2, 1];
  const experienceList = [
    "1 Years",
    "2 Years",
    "3 Years",
    "4 Years",
    "5 Years",
  ];

  const [activeIndices, setActiveIndices] = useState([]);

  const handleToggle = (index) => {
    if (activeIndices.includes(index)) {
      setActiveIndices(activeIndices.filter((i) => i !== index));
    } else {
      setActiveIndices([...activeIndices, index]);
    }
  };
  return (
    <section className="w-full flex justify-center lg:py-10  max-w-[349px]">
      <div className="w-full flex flex-col items-center rounded-2xl shadow-[0px_4px_20px_-15px_rgba(0,0,0,0.4)]  ">
        <div className="bg-[#F6F6F9] flex flex-col gap-2 px-4 pt-4 w-full rounded-t-2xl  lg:bg-white ">
          <p className="text-4 font-bold leading-6 text-gray-600">Pet Type:</p>
          <div className="flex gap-4">
            {petTypeList.map((name, index) => {
              return (
                <div className="flex gap-2 items-center" key={index}>
                  <Checkbox
                    // checked={wheelchairAccess}
                    // onChange={(event) =>
                    //   handleCheckboxChange(event, "wheelchair")
                    // }
                    sx={{
                      color: "#DCDFED",
                      "&.Mui-checked": {
                        color: "#FF7037",
                      },
                      borderRadius: "6px",
                      backgroundColor: "#FFFFFF",
                      width: "6px",
                      height: "6px",
                      "&:hover": {
                        color: "#FFB899",
                      },
                    }}
                  />
                  <label
                    htmlFor=""
                    className="text-gray-600 text-[16px] font-medium leading-6"
                  >
                    {name}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-6 w-full lg:rounded-b-2xl lg:flex-wrap xl:justify-between bg-white">
          <div className="flex flex-col gap-3 ">
            <p className="text-4 font-bold leading-6 text-gray-600">Rating:</p>
            <div className="flex gap-2 flex-wrap">
              {ratingList.map((num, index) => {
                const isActive = activeIndices.includes(index);
                return (
                  <div
                    className={`flex gap-1 items-center border rounded-md p-[4px_8px] cursor-pointer ${
                      isActive ? "border-orange-500" : ""
                    }`}
                    onClick={() => handleToggle(index)}
                    key={index}
                  >
                    <p
                      className={` ${
                        isActive ? "text-orange-500" : "text-gray-400"
                      }`}
                    >
                      {num}
                    </p>
                    {Array.from({ length: num }).map((_, index) => {
                      return (
                        <FaStar
                          className="text-green-500 w-[20px] h-[20px]"
                          key={index}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {/* <div className="flex flex-col gap-3 lg:flex-row lg:gap-10"> */}
          <div className="flex flex-col gap-3 ">
            <p className="text-4 font-bold leading-6 text-gray-600">
              Experience:
            </p>
            <select className="bg-white text-gray-500 rounded-md border border-gray-200 p-[12px_16px] ">
              {experienceList.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className=" flex justify-between gap-2">
            <button className="bg-orange-100 text-orange-500 font-bold p-[12px_24px] rounded-[99px] hover:text-orange-400 active:text-orange-600 grow">
              Clear
            </button>
            <button className="bg-orange-500 text-white font-bold p-[12px_24px] rounded-[99px] hover:bg-orange-400 active:bg-orange-600 grow">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
