"use client";
import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

export default function PetSitterForm() {
  return (
    <div className="bg-white rounded-3xl px-14 py-8 flex flex-col gap-6">
      <h1 className="text-head4 text-gray-300">Pet Sitter</h1>
      <div className="flex">
        <div className="w-1/2 flex flex-col gap-1 text-black">
          <label htmlFor="tradeName">Pet sitter name (Trade Name)*</label>
          <input
            id="tradeName"
            className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            type="text"
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-1 text-black">
        <label htmlFor="petType">Pet type</label>
        <select
          id="petType"
          className=" bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          defaultValue=""
        >
          <option value="" disabled></option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
        </select>
        <div className="absolute bottom-2 left-2 flex gap-2 text-orange-500 ">
          <div className="bg-orange-100 px-3 py-1 rounded-full flex gap-1">
            <p className="text-body3">Cat</p>
            <button>
              <IoCloseSharp />
            </button>
          </div>
          <div className="bg-orange-100 px-3 py-1 rounded-full flex gap-1">
            <p className="text-body3">Dog</p>
            <button>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-1 text-black">
        <label htmlFor="services">
          Services (Describe all of your service for pet sitting)
        </label>
        <textarea
          id="services"
          className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          rows="5"
        />
      </div>
      <div className=" flex flex-col gap-1 text-black">
        <label htmlFor="places">My Place (Describe your place)</label>
        <textarea
          className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          rows="5"
        />
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-black">Image Gallery (Maximum 10 images)</p>
        <div className="flex gap-6">
          <div className="relative w-[167px] h-[167px] bg-gray-100 rounded-lg flex items-center">
            <img
              className="w-full h-[100px]"
              src="/sitter-gallery-ex1.png"
              alt="sitter-gallery-ex1"
            />
            <button className="absolute -top-0.5 -right-0.5 bg-gray-400 w-[24px] h-[24px] rounded-full text-white flex justify-center items-center">
              <IoCloseSharp />
            </button>
          </div>
          <div className="relative w-[167px] h-[167px] bg-gray-100 rounded-lg flex items-center">
            <img
              className="w-full h-[100px]"
              src="/sitter-gallery-ex2.png"
              alt="sitter-gallery-ex2"
            />
            <button className="absolute -top-0.5 -right-0.5 bg-gray-400 w-[24px] h-[24px] rounded-full text-white flex justify-center items-center">
              <IoCloseSharp />
            </button>
          </div>
          <div className="relative w-[167px] h-[167px] bg-gray-100 rounded-lg flex items-center">
            <img
              className="w-full h-[100px]"
              src="/sitter-gallery-ex3.png"
              alt="sitter-gallery-ex3"
            />
            <button className="absolute -top-0.5 -right-0.5 bg-gray-400 w-[24px] h-[24px] rounded-full text-white flex justify-center items-center">
              <IoCloseSharp />
            </button>
          </div>
          <div className=" w-[167px] h-[167px] text-orange-500  bg-orange-100 rounded-lg flex flex-col gap-3 justify-center items-center">
            <button className="w-[40px] h-[40px] rounded-full border-[5px] border-orange-500 flex justify-center items-center">
              <FaPlus className="text-[20px]" />
            </button>
            <p className="font-bold">Upload Image</p>
          </div>
        </div>
      </div>
    </div>
  );
}
