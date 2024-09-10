"use client";
import { Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { FiList } from "react-icons/fi";
import { TbMap } from "react-icons/tb";
import SearchBar from "@/components/search/SearchBar";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function SearchPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const petType = searchParams.get("type");
  const keyword = searchParams.get("keyword");
  const rating = searchParams.get("rating");
  const experience = searchParams.get("experience");
  // console.log(keyword, petType, rating, experience);

  const [isList, setIsList] = useState(true);
  const [isMap, setIsMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sitterList, setSitterList] = useState([]);
  const [query, setQuery] = useState({
    keyword: keyword,
    rating: rating,
    type: petType,
    experience: experience,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  async function getSitter(params) {
    setLoading(true);
    try {
      let result = await axios.get(
        `/api/search?keyword=${query?.keyword ?? ""}&type=${
          query?.type ?? ""
        }&rating=${query?.rating ?? ""}&experience=${query.experience ?? ""}`
      );
      // console.log(result);
      setSitterList(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (searchTerm) => {
    // console.log("Search term:", searchTerm);
    setQuery(searchTerm); // อัปเดต state ใน SearchPage
  };

  useEffect(() => {
    getSitter();
    // console.log(query);
  }, [query?.keyword, query?.type, query?.rating, query?.experience]);

  const totalPages = Math.ceil(sitterList.length / itemsPerPage);

  const paginatedSearch = sitterList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <MainLayout session={session}>
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
        <div className="max-w-[1440px] flex flex-col items-center lg:flex-row lg:items-start lg:w-full lg:justify-between lg:px-20 lg:gap-6 ">
          <SearchBar onSearch={handleSearch} query={query} />
          <div className="flex flex-col p-[40px_16px] gap-6 items-center justify-center w-full lg:py-10 lg:px-0 max-w-[848px] ">
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
                {loading && (
                  <BeatLoader
                    size={15}
                    color={"#FF7037"}
                    margin={2}
                    className="flex justify-center items-center h-screen"
                  />
                )}
                {!loading &&
                  paginatedSearch.map((sitter) => {
                    return (
                      <div
                        className="flex flex-col gap-4 items-center rounded-2xl bg-white w-full"
                        key={sitter.id}
                      >
                        <div className="rounded-2xl p-4 flex flex-col gap-4 xl:flex-row lg:gap-10 lg:w-full ">
                          <img
                            src=""
                            className="w-[311px] h-[100px] rounded-lg lg:w-[245px] lg:h-[184px]"
                          />
                          <div className="flex flex-col gap-2 lg:gap-6 lg:w-full">
                            <div className="flex gap-4 justify-between w-full">
                              <div className="flex gap-4 ">
                                <img
                                  src=""
                                  className="w-[36px] h-[36px] lg:w-[64px] lg:h-[64px] rounded-full"
                                />
                                <div className="flex flex-col ">
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
                            <div className="flex gap-[6px] text-gray-400 items-center">
                              <SlLocationPin className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]" />
                              <p className="text-body3 lg:text-body2">
                                Senanikom, Bangkok
                              </p>
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
                  })}
              </div>
            )}
          </div>
        </div>
        {!loading && isList && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            size="large"
            shape="rounded-full"
            sx={{
              display: "flex",
              justifyContent: "center",
              borderRadius: "99px",
              marginBottom: "20px",
              "& .MuiPaginationItem-root": {
                color: "#AEB1C3", // สีของตัวเลขหน้า
                "&.Mui-selected": {
                  backgroundColor: "#FFF1EC", // สีพื้นหลังของหน้าที่เลือก
                  color: "#FF7037", // สีตัวเลขของหน้าที่เลือก
                },
                "&:hover": {
                  backgroundColor: "#FFF1EC",
                  color: "#FF986F", // สีเมื่อ hover
                },
              },
              "& .MuiPaginationItem-previousNext": {
                color: "#AEB1C3", // สีของปุ่มก่อนหน้าและถัดไป
                "&:hover": {
                  backgroundColor: "#FFF1EC",
                  color: "#FF986F", // สีเมื่อ hover
                },
              },
            }}
          />
        )}
      </section>
    </MainLayout>
  );
}

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
