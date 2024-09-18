"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { FaStar } from "react-icons/fa";

const MapComponent = ({ data }) => {
  const [sitterList, setSitterList] = useState(data);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  const [addresses, setAddresses] = useState([]);
  const [center, setCenter] = useState({});
  const [markers, setMarkers] = useState([]);
  const [isActive, setIsActive] = useState(null);
  const sitterRefs = useRef([]);

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
    setCenter(position);
    setIsActive(sitterList[index].id);

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
          axios.get(`/api/search/location`, {
            params: {
              address,
            },
          })
        );

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
          .filter((marker) => marker !== null);

        setMarkers(newMarkers);
      } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
      }
    } else {
      setMarkers([]);
    }
  };

  const dataFilter = data.filter((item) => item.address !== "");

  useEffect(() => {
    setSitterList(dataFilter);
  }, [data]);

  useEffect(() => {
    handleSearch();
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
    url: "/pin-selected.png",
    scaledSize: new window.google.maps.Size(88, 88),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(25, 50),
  };

  const customIconDefault = {
    url: "/pin-default.png",
    scaledSize: new window.google.maps.Size(88, 88),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(25, 50),
  };

  return (
    <div className="w-full flex items-center relative justify-center">
      <GoogleMap
        zoom={10}
        center={center}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
        mapContainerStyle={{
          width: "100%",
          height: "840px",
        }}
      >
        {markers.map((position, index) => {
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
            />
          );
        })}
      </GoogleMap>
      <div className="carousel carousel-center bg-white/0 bottom-0 max-w-[375px] rounded-box p-2 lg:max-w-[849px] absolute flex gap-3">
        {sitterList.map((sitter, index) => {
          return (
            <div
              ref={(el) => (sitterRefs.current[index] = el)}
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
                        return (
                          <div
                            className={`rounded-[99px] p-[4px_16px] border ${
                              item === "Dog"
                                ? "border-green-500 bg-green-100 text-green-500"
                                : item === "Cat"
                                ? "border-pink-500 bg-pink-100 text-pink-500"
                                : item === "Bird"
                                ? "border-blue-500 bg-blue-100 text-blue-500"
                                : "border-orange-500 bg-orange-100 text-orange-500"
                            } `}
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
                    return (
                      <div
                        className={`rounded-[99px] p-[4px_16px] border ${
                          item === "Dog"
                            ? "border-green-500 bg-green-100 text-green-500"
                            : item === "Cat"
                            ? "border-pink-500 bg-pink-100 text-pink-500"
                            : item === "Bird"
                            ? "border-blue-500 bg-blue-100 text-blue-500"
                            : "border-orange-500 bg-orange-100 text-orange-500"
                        } `}
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
        })}
      </div>
    </div>
  );
};

export default MapComponent;
