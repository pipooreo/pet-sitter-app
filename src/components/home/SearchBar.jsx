"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from "next/navigation";

function SearchBar() {
  const petTypeList = ["Dog", "Cat", "Bird", "Rabbit"];
  const ratingList = [5, 4, 3, 2, 1];
  const experienceList = ["", "0-2 Years", "3-5 Years", "5+ Years"];

  const [search, setSearch] = useState({
    keyword: "",
    rating: [],
    type: [],
    experience: "",
  });
  const router = useRouter();

  function handleSearch() {
    router.push(
      `/search?keyword=${search?.keyword ?? ""}&type=${
        search?.type ?? ""
      }&rating=${search?.rating ?? ""}&experience=${search.experience ?? ""}`
    );
  }

  function handleCheckboxChange(e, name) {
    const isChecked = e.target.checked;

    setSearch((prevSearch) => {
      if (isChecked) {
        // Add the selected pet type to the array
        return { ...prevSearch, type: [...prevSearch.type, name] };
      } else {
        // Remove the unselected pet type from the array
        return {
          ...prevSearch,
          type: prevSearch.type.filter((pet) => pet !== name),
        };
      }
    });
  }

  function handleToggle(num) {
    setSearch((prevSearch) => {
      const updatedRatings = prevSearch.rating.includes(num)
        ? prevSearch.rating.filter((rating) => rating !== num) // Remove selected rating
        : [...prevSearch.rating, num]; // Add selected rating

      return {
        ...prevSearch,
        rating: updatedRatings,
      };
    });
  }

  return (
    <section className="w-full flex justify-center sm:py-12">
      <div className="w-[343px] flex flex-col items-center rounded-2xl shadow-[0px_4px_20px_-15px_rgba(0,0,0,0.4)] sm:w-[80%] lg:w-[60%] xl:w-[1064px]">
        <div className="bg-[#F6F6F9] flex flex-col gap-2 p-4 w-full rounded-t-2xl lg:flex-row lg:items-center xl:p-6">
          <p className="text-4 font-bold leading-6 text-gray-600">Pet Type:</p>
          <div className="flex gap-4">
            {petTypeList.map((name, index) => {
              return (
                <div className="flex gap-2 items-center" key={index}>
                  <Checkbox
                    checked={search.type.includes(name)}
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
                  {/* }
                  /> */}
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-6 w-full lg:flex-row lg:flex-wrap xl:justify-between xl:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <p className="text-4 font-bold leading-6 text-gray-600">Rating:</p>
            <div className="flex gap-2 flex-wrap">
              {ratingList.map((num, index) => {
                return (
                  <div
                    className={`flex gap-1 items-center border rounded-md p-[4px_8px] cursor-pointer ${
                      search.rating.includes(num) ? "border-orange-500" : ""
                    }`}
                    onClick={() => handleToggle(num)}
                    key={index}
                  >
                    <p
                      className={` ${
                        search.rating.includes(num)
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
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <p className="text-4 font-bold leading-6 text-gray-600">
              Experience:
            </p>
            <select
              className="bg-white text-gray-500 rounded-md border border-gray-200 p-[12px_16px]"
              value={search.experience}
              onChange={(e) =>
                setSearch((prevInput) => ({
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
          <button
            className="bg-orange-500 text-white p-[12px_24px] rounded-[99px] hover:bg-orange-400 active:bg-orange-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {/* </div> */}
      </div>
    </section>
  );
}

export default SearchBar;
