"use client";

import {
  useLoadScript,
  GoogleMap,
  Marker,
  DataF,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { FaStar } from "react-icons/fa";

const MapComponent = ({ data }) => {
  // ใส่ Google API key ของคุณตรงนี้
  //   console.log(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);
  // console.log(data);

  const [sitterList, setSitterList] = useState(data);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  const [addresses, setAddresses] = useState([]); // เก็บที่อยู่ที่ป้อนเข้ามา
  const [center, setCenter] = useState({}); // ค่าเริ่มต้น
  const [markers, setMarkers] = useState([]);
  const [isActive, setIsActive] = useState(null);
  const sitterRefs = useRef([]);

  // โหลด script ของ Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const handleSetAddresses = () => {
    if (sitterList.length > 0) {
      let newAddress = sitterList
        .map((location) => {
          return location.address;
        })
        .filter((address) => address !== "");
      setAddresses(newAddress);
    } else {
      setAddresses([]);
    }
  };

  const handleMarkerClick = (position, index) => {
    setCenter(position); // ตั้ง center ตาม marker ที่เลือก
    setIsActive(sitterList[index].id); // อัปเดต isActive

    // เลื่อน carousel ไปที่ sitter ที่เลือก
    if (sitterRefs.current[index]) {
      sitterRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleSetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude }); // ตั้งค่า center เป็นตำแหน่งผู้ใช้
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = async () => {
    if (sitterList.length > 0) {
      try {
        const requests = addresses.map((address) =>
          // axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          axios.get(`/api/search/location`, {
            params: {
              address,
              // key: apiKey,
            },
          })
        );

        // รอผลลัพธ์ทั้งหมดจาก Promise.all
        const responses = await Promise.all(requests);

        const newMarkers = responses
          .map((response) => {
            if (response.data.results.length > 0) {
              const { lat, lng } = response.data.results[0].geometry.location;
              return { lat, lng };
            } else {
              console.warn("ไม่พบที่อยู่:", response.config.params.address);
              return null;
            }
          })
          .filter((marker) => marker !== null); // กรองที่อยู่ที่ไม่พบออก

        setMarkers(newMarkers);
        //   setCenter(newMarkers[0]);
      } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
      }
    } else {
      setMarkers([]);
    }
  };

  const dataFilter = data.filter((item) => item.address !== "");
  // console.log(dataFilter);

  useEffect(() => {
    setSitterList(dataFilter);
  }, [data]);

  useEffect(() => {
    // if (addresses.length > 0) {
    handleSearch();
    // }
  }, [addresses]);

  useEffect(() => {
    handleSetAddresses();
    handleSetCurrentLocation();
  }, [sitterList]);

  if (!isLoaded) {
    return (
      <BeatLoader
        size={15}
        color={"#FF7037"}
        margin={2}
        className="flex justify-center mt-[250px] h-screen"
      />
    );
  }

  const customIconSelected = {
    url: "/pin-selected.png", // URL ไอคอนของคุณ
    scaledSize: new window.google.maps.Size(88, 88), // ปรับขนาดไอคอน (กว้าง, สูง)
    origin: new window.google.maps.Point(0, 0), // ตำแหน่งต้นทาง (เริ่มจากมุมบนซ้าย)
    anchor: new window.google.maps.Point(25, 50), // ตำแหน่งยึดของ Marker (จุดที่ Marker จะอ้างอิง)
  };

  const customIconDefault = {
    url: "/pin-default.png", // URL ไอคอนของคุณ
    scaledSize: new window.google.maps.Size(88, 88), // ปรับขนาดไอคอน (กว้าง, สูง)
    origin: new window.google.maps.Point(0, 0), // ตำแหน่งต้นทาง (เริ่มจากมุมบนซ้าย)
    anchor: new window.google.maps.Point(25, 50), // ตำแหน่งยึดของ Marker (จุดที่ Marker จะอ้างอิง)
  };

  // console.log(sitterList);
  return (
    <div className="w-full flex items-center relative justify-center">
      <GoogleMap
        zoom={10}
        center={center}
        options={{
          zoomControl: false, // ซ่อนปุ่ม Zoom
          streetViewControl: false, // ซ่อนปุ่ม Street View
          mapTypeControl: false, // ซ่อนปุ่มเปลี่ยนชนิดแผนที่
          fullscreenControl: true, // ซ่อนปุ่ม Fullscreen
        }}
        mapContainerStyle={{
          width: "100%",
          height: "840px",
          // borderRadius: "16px",
        }}
      >
        {markers.map((position, index) => {
          // console.log(position, center);
          // console.log(addresses);
          return (
            <Marker
              icon={
                position.lat === center.lat && position.lng === center.lng
                  ? customIconSelected
                  : customIconDefault
              }
              position={position}
              key={index}
              onClick={() => handleMarkerClick(position, index)}
              // onClick={() => {
              //   setCenter(position);
              //   setIsActive(addresses[index]); // ตั้งค่า activeSitterId
              // }}
            />
          );
        })}
      </GoogleMap>
      <div className="carousel carousel-center bg-white/0 bottom-0 max-w-[375px] rounded-box p-2 lg:max-w-[849px] absolute flex gap-3">
        {sitterList.map((sitter, index) => {
          // sitter.address !== "";
          // })
          // .map((sitter, index) => {
          // if (sitter.address !== "") {
          return (
            <div
              ref={(el) => (sitterRefs.current[index] = el)} // ใช้ ref
              className={`flex flex-col lg:gap-4 lg:items-center rounded-2xl bg-white carousel-item max-lg:w-[330px] ${
                isActive === sitter.id ? "border border-orange-600" : ""
              }`}
              key={sitter.id}
            >
              <div className="rounded-2xl lg:p-4 p-2 flex gap-4 lg:gap-10 w-full ">
                <img
                  src={sitter.gallery[1] || sitter.gallery[0]}
                  className="w-[97px] h-[73px] rounded-lg lg:w-[144px] lg:h-[108px] object-cover"
                />
                <div className="flex flex-col gap-2 lg:gap-6 lg:w-full overflow-hidden">
                  <div className="flex flex-col lg:flex-row lg:gap-4 lg:justify-between w-full">
                    <div className="flex gap-4 ">
                      <div className="flex flex-col flex-1">
                        <h3 className="text-black text-head4 ">
                          {sitter.trade_name}
                        </h3>
                        <p className="text-body2 text-black">
                          By {sitter.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-[2px] p-[6px] rounded-lg ">
                      {Array.from({ length: 5 }).map((_, index) => {
                        return (
                          <FaStar
                            className="text-green-500 w-[14px] h-[14px]"
                            key={index}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap max-lg:hidden">
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
              <div className="flex gap-2 flex-wrap p-2 lg:hidden ">
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
          );
          // }
        })}
      </div>
    </div>
  );
};

export default MapComponent;
