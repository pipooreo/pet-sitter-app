"use client";

import MainLayout from "@/components/layouts/MainLayout";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { FiList } from "react-icons/fi";
import { TbMap } from "react-icons/tb";
import SearchBar from "@/components/search/SearchBar";

function SearchPage() {
  const [isList, setIsList] = useState(true);
  const [isMap, setIsMap] = useState(false);
  return (
    <MainLayout>
      <section className="w-full h-full bg-gray-100 flex flex-col items-center lg:p-[40px_80px]">
        <div className="flex justify-between items-center w-full  max-lg:hidden lg:px-20 max-w-[1440px]">
          <h4 className="text-head4 text-gray-600">Search For Pet Sitter</h4>
          <div className="flex gap-3 justify-center ">
            <button
              className={`border grow flex p-[8px_12px] justify-center rounded-lg items-center gap-2 ${
                isList
                  ? "border-orange-500 text-orange-500"
                  : "border-gray-300  text-gray-300"
              }`}
              onClick={() => {
                setIsList(true);
                setIsMap(false);
              }}
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
              onClick={() => {
                setIsList(false);
                setIsMap(true);
              }}
            >
              <TbMap className="w-[24px] h-[24px]" />
              Map
            </button>
          </div>
        </div>
        <div className="max-w-[1440px] flex flex-col items-center lg:flex-row lg:items-start lg:w-full lg:justify-between lg:px-20 lg:gap-6 border">
          <SearchBar />
          <div className="flex flex-col p-[40px_16px] gap-6 items-center justify-center w-full lg:py-10 lg:px-0 max-w-[848px] border">
            <div className="flex flex-col gap-3 items-center w-full lg:hidden">
              <div className="flex flex-col gap-3 items-center w-full ">
                <h4 className="text-head4 text-gray-600">
                  Search For Pet Sitter
                </h4>
                <div className="flex gap-3 justify-center w-full">
                  <button
                    className={`border grow flex p-[8px_12px] justify-center rounded-lg items-center gap-2 ${
                      isList
                        ? "border-orange-500 text-orange-500"
                        : "border-gray-300  text-gray-300"
                    }`}
                    onClick={() => {
                      setIsList(true);
                      setIsMap(false);
                    }}
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
                    onClick={() => {
                      setIsList(false);
                      setIsMap(true);
                    }}
                  >
                    <TbMap className="w-[24px] h-[24px]" />
                    Map
                  </button>
                </div>
              </div>
            </div>
            {isList && (
              <div className="flex flex-col gap-4 items-center w-full">
                <div className="flex flex-col gap-4 items-center rounded-2xl bg-white w-full">
                  <div className="rounded-2xl p-4 flex flex-col gap-4">
                    <img src="" className="w-[311px] h-[100px] rounded-lg" />
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-4 justify-between w-full">
                        <div className="flex gap-4">
                          <img
                            src=""
                            className="w-[36px] h-[36px] rounded-full"
                          />
                          <div className="flex flex-col">
                            <h3 className="text-black text-[18px] leading-6 font-bold">
                              Happy House!
                            </h3>
                            <p className="text-body3 text-black">
                              By Jame Maison
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-[2px] p-[6px] rounded-lg">
                          {Array.from({ length: 5 }).map((_, index) => {
                            return (
                              <FaStar
                                className="text-green-500 w-[12px] h-[12px]"
                                key={index}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-[6px] text-gray-400 items-center">
                        <SlLocationPin className="w-[16px] h-[16px]" />
                        <p className="text-body3">Senanikom, Bangkok</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="rounded-[99px] p-[4px_16px] border border-green-500 bg-green-100 text-green-500">
                          Dog
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 items-center rounded-2xl bg-white w-full">
                  <div className="rounded-2xl p-4 flex flex-col gap-4">
                    <img src="" className="w-[311px] h-[100px] rounded-lg" />
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-4 justify-between w-full">
                        <div className="flex gap-4">
                          <img
                            src=""
                            className="w-[36px] h-[36px] rounded-full"
                          />
                          <div className="flex flex-col">
                            <h3 className="text-black text-[18px] leading-6 font-bold">
                              Happy House!
                            </h3>
                            <p className="text-body3 text-black">
                              By Jame Maison
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-[2px] p-[6px] rounded-lg">
                          {Array.from({ length: 5 }).map((_, index) => {
                            return (
                              <FaStar
                                className="text-green-500 w-[12px] h-[12px]"
                                key={index}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex gap-[6px] text-gray-400 items-center">
                        <SlLocationPin className="w-[16px] h-[16px]" />
                        <p className="text-body3">Senanikom, Bangkok</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="rounded-[99px] p-[4px_16px] border border-green-500 bg-green-100 text-green-500">
                          Dog
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default SearchPage;
