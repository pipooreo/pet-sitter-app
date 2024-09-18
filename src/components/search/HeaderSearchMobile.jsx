"use client";
import React, { useState } from "react";
import { FiList } from "react-icons/fi";
import { TbMap } from "react-icons/tb";

function HeaderSearchMobile({ onResult }) {
  const [isList, setIsList] = useState(true);
  const [isMap, setIsMap] = useState(false);

  function handleList() {
    onResult(true, false);
    setIsList(true);
    setIsMap(false);
  }

  function handleMap() {
    onResult(false, true);
    setIsList(false);
    setIsMap(true);
  }

  return (
    <div className="flex flex-col gap-3 items-center w-full p-[20px_16px_10px_16px] lg:hidden">
      <div className="flex flex-col gap-3 items-center w-full ">
        <h4 className="text-head4 text-gray-600">Search For Pet Sitter</h4>
        <div className="flex gap-3 justify-center w-full">
          <button
            className={`border grow flex p-[8px_12px] justify-center rounded-lg items-center gap-2 ${
              isList
                ? "border-orange-500 text-orange-500"
                : "border-gray-300  text-gray-300"
            }`}
            onClick={handleList}
          >
            <FiList className="w-[24px] h-[24px]" />
            List
          </button>
          <button
            className={`border grow flex rounded-lg p-[8px_12px] justify-center items-center gap-2 ${
              isMap
                ? "border-orange-500 text-orange-500"
                : "border-gray-300  text-gray-300 "
            }`}
            onClick={handleMap}
          >
            <TbMap className="w-[24px] h-[24px]" />
            Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeaderSearchMobile;
