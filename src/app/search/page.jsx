"use client";
import { Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/search/SearchBar";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import SitterCard from "@/components/search/SitterCard";
import NoResult from "@/components/search/NoResult";
import HeaderSearchDesktop from "@/components/search/HeaderSearchDesktop";
import HeaderSearchMobile from "@/components/search/HeaderSearchMobile";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/components/search/MapComponent"), {
  ssr: false, // ปิด SSR สำหรับ component นี้
});

function SearchPage() {
  const { data: session } = useSession();
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
    type: petType ?? [],
    experience: experience,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  async function getSitter(params) {
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
    setCurrentPage(1);
  };

  function handleResult(list, map) {
    setIsList(list);
    setIsMap(map);
  }

  useEffect(() => {
    setLoading(true);
    getSitter();
    // console.log(query);
  }, [
    query?.keyword,
    query?.type,
    query?.rating,
    query?.experience,
    isMap,
    isList,
  ]);

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
      <section className="w-full min-h-screen bg-gray-100 flex flex-col items-center lg:p-[40px_80px]">
        <HeaderSearchDesktop onResult={handleResult} />
        <div className="max-w-[1440px] flex flex-col items-center lg:flex-row lg:items-start lg:w-full lg:justify-between lg:px-20 lg:gap-6 ">
          <SearchBar onSearch={handleSearch} query={query} />
          <div
            className={`flex flex-col ${
              isList ? "p-[20px_16px]" : "p-[20px_0px_0px_0px]"
            } gap-6 items-center justify-center w-full lg:py-10 lg:px-0 max-w-[848px]`}
          >
            <HeaderSearchMobile onResult={handleResult} />
            {isList && (
              <div className="flex flex-col gap-4 items-center w-full">
                {loading && (
                  <BeatLoader
                    size={15}
                    color={"#FF7037"}
                    margin={2}
                    className="flex justify-center mt-[250px] h-screen"
                  />
                )}
                {!loading &&
                  paginatedSearch.length > 0 &&
                  paginatedSearch.map((sitter) => {
                    return <SitterCard data={sitter} key={sitter.id} />;
                  })}
                {!loading && paginatedSearch.length < 1 && <NoResult />}
              </div>
            )}
            {isMap && (
              <div className="flex flex-col gap-4 items-center w-full overflow-hidden">
                {loading && (
                  <BeatLoader
                    size={15}
                    color={"#FF7037"}
                    margin={2}
                    className="flex justify-center mt-[250px] h-screen"
                  />
                )}
                <MapWithNoSSR data={sitterList} />
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
