"use client";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Checkbox } from "@mui/material";
import { useRouter } from "next/navigation";

function SearchBar({ onSearch, query }) {
  const petTypeList = ["Dog", "Cat", "Bird", "Rabbit"];
  const ratingList = [5, 4, 3, 2, 1];
  const experienceList = ["", "0-2 Years", "3-5 Years", "5+ Years"];
  // console.log(query);
  if (query?.type.includes(",")) {
    query.type = query.type.split(",");
    console.log(query.type);
  }

  const [input, setInput] = useState({
    keyword: query?.keyword ?? "",
    rating: query?.rating ?? [],
    type: Array.isArray(query?.type) ? query?.type : [query?.type],
    experience: query?.experience ?? "",
  });

  const router = useRouter();

  function handleSearch() {
    if (typeof onSearch === "function") {
      onSearch(input); // ตรวจสอบว่า onSearch เป็นฟังก์ชันก่อนเรียก
    } else {
      console.error("onSearch is not a function");
    }
  }

  function handleClear() {
    const clearedInput = {
      keyword: "",
      rating: [],
      type: [],
      experience: "",
    };
    setInput(clearedInput); // Reset input state to cleared values
    onSearch(clearedInput); // Immediately send cleared values to parent or search/page.jsx
    router.push("/search");
  }

  function handleCheckboxChange(e, name) {
    const isChecked = e.target.checked;

    setInput((prevInput) => {
      if (isChecked) {
        // Add the selected pet type to the array
        return { ...prevInput, type: [...prevInput.type, name] };
      } else {
        // Remove the unselected pet type from the array
        return {
          ...prevInput,
          type: prevInput.type.filter((pet) => pet !== name),
        };
      }
    });
  }

  function handleToggle(num) {
    setInput((prevInput) => {
      const updatedRatings = prevInput.rating.includes(num)
        ? prevInput.rating.filter((rating) => rating !== num) // Remove selected rating
        : [...prevInput.rating, num]; // Add selected rating

      return {
        ...prevInput,
        rating: updatedRatings,
      };
    });
  }

  useEffect(() => {
    // console.log(input);
    // onSearch(input);
  }, [input, handleClear]);

  return (
    <section className="w-full flex justify-center lg:py-10 max-w-[375px]">
      <div className="w-full flex flex-col items-center rounded-2xl shadow-[0px_4px_20px_-15px_rgba(0,0,0,0.4)] ">
        <div className="bg-white w-full flex flex-col gap-1 p-4 max-lg:hidden rounded-t-2xl">
          <label className="text-4 font-bold leading-6 text-gray-600">
            Search
          </label>
          <input
            className="w-full p-[12px_16px] text-black rounded-lg bg-white border border-gray-200 focus:border-orange-400 outline-0"
            type="text"
            value={input.keyword}
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                keyword: e.target.value,
              }))
            }
          />
        </div>
        <div className="bg-[#F6F6F9] flex flex-col gap-2 px-4 max-lg:py-4 w-full lg:bg-white">
          <p className="text-4 font-bold leading-6 text-gray-600">Pet Type:</p>
          <div className="flex gap-4">
            {petTypeList.map((name, index) => {
              return (
                <div className="flex gap-2 items-center" key={index}>
                  <Checkbox
                    checked={input.type.includes(name)}
                    onChange={(event) => handleCheckboxChange(event, name)}
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
                return (
                  <div
                    className={`flex gap-1 items-center border rounded-md p-[4px_8px] cursor-pointer ${
                      input.rating.includes(num) ? "border-orange-500" : ""
                    }`}
                    onClick={() => handleToggle(num)}
                    key={index}
                  >
                    <p
                      className={` ${
                        input.rating.includes(num)
                          ? "text-orange-500"
                          : "text-gray-400"
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
            <select
              // className="bg-white text-gray-500 rounded-md border border-gray-200 p-[12px_16px] active:border-orange-400"
              className={`bg-white text-gray-500 rounded-md border focus:outline-none focus:border-orange-400 p-[12px_16px] `}
              value={input.experience}
              onChange={(e) =>
                setInput((prevInput) => ({
                  ...prevInput,
                  experience: e.target.value,
                }))
              }
            >
              {experienceList.map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item === "" ? "Select Experience" : item}
                  </option>
                );
              })}
            </select>
          </div>
          <div className=" flex justify-between gap-2">
            <button
              className="bg-orange-100 text-orange-500 font-bold p-[12px_24px] rounded-[99px] hover:text-orange-400 active:text-orange-600 grow"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              className="bg-orange-500 text-white font-bold p-[12px_24px] rounded-[99px] hover:bg-orange-400 active:bg-orange-600 grow"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
