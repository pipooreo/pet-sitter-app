"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const PetSitterProfileContext = createContext();

export const useProfile = () => useContext(PetSitterProfileContext);

export const PetSitterProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    status: "",
    profileImage: "",
    fullName: "",
    experience: "",
    phone: "",
    email: "",
    introduction: "",
    tradeName: "",
    petType: [],
    services: "",
    place: "",
    gallery: [],
    addressDetail: "",
    district: "",
    subDistrict: "",
    province: "",
    postCode: "",
  });

  const [errorMessages, setErrorMessages] = useState([]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get("/api/pet-sitter/profile");
      const data = response.data;
      // console.log(data);
      setProfileData({
        status: data.status || "",
        profileImage: data.profile_image || "",
        fullName: data.name || "",
        experience: data.experience || "",
        phone: data.phone || "",
        email: data.email || "",
        introduction: data.introduction || "",
        tradeName: data.trade_name || "",
        petType: data.pet_type || [],
        services: data.services || "",
        place: data.place || "",
        gallery: data.galleries || [],
        addressDetail: data.address_detail || "",
        district: data.district || "",
        subDistrict: data.sub_district || "",
        province: data.province || "",
        postCode: data.post_code || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const validateProfileData = () => {
    const errors = [];

    if (!profileData.fullName) {
      errors.push("Full Name is required.");
    }
    if (!profileData.tradeName) {
      errors.push("Trade Name is required.");
    }
    if (!profileData.experience) {
      errors.push("Experience is required.");
    }
    if (!profileData.services) {
      errors.push("Services are required.");
    }
    // Add more validation checks as needed

    return errors;
  };

  const createProfileData = async (profileData) => {
    const errors = validateProfileData();

    try {
      // สร้าง FormData
      const formData = new FormData();

      // เพิ่มข้อมูลลงใน FormData
      formData.append("profile_image", profileData.profileImage); // profileImage ต้องเป็นไฟล์ เช่น Blob หรือ File
      formData.append("name", profileData.fullName);
      formData.append("experience", profileData.experience);
      formData.append("introduction", profileData.introduction);
      // formData.append("trade_name", profileData.tradeName);

      // เพิ่ม pet_type เป็น array ของ ENUM
      // profileData.petType.forEach((type) => formData.append("pet_type", type));

      // formData.append("services", profileData.services);
      // formData.append("place", profileData.place);

      // เพิ่ม gallery ไม่เกิน 10 รูป
      // profileData.gallery.slice(0, 10).forEach((image) => {
      //   formData.append("galleries", image); // แต่ละรายการใน gallery ควรเป็นไฟล์ (Blob หรือ File)
      // });

      // formData.append("address_detail", profileData.addressDetail);
      // formData.append("district", profileData.district);
      // formData.append("sub_district", profileData.subDistrict);
      // formData.append("province", profileData.province);
      // formData.append("post_code", profileData.postCode);

      // เพิ่ม created_at และ updated_at
      formData.append("created_at", new Date().toISOString());
      formData.append("updated_at", new Date().toISOString());

      // ส่งคำขอด้วย axios และกำหนด headers ว่าเป็น multipart/form-data
      const response = await axios.post("/api/pet-sitter/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating profile data:", error);
      throw error;
    }
  };

  const updateProfileData = async (profileData) => {
    console.log(profileData.fullName);

    try {
      // สร้าง FormData สำหรับอัพเดตข้อมูล
      const formData = new FormData();

      // ถ้ามีการอัพโหลดรูปภาพใหม่ ก็เพิ่ม profile_image
      if (profileData.profileImage) {
        formData.append("profile_image", profileData.profileImage); // profileImage ต้องเป็นไฟล์ เช่น Blob หรือ File
      }

      // เพิ่มข้อมูลลงใน FormData
      formData.append("name", profileData.fullName);
      formData.append("experience", profileData.experience);
      formData.append("introduction", profileData.introduction);
      formData.append("trade_name", profileData.tradeName);

      // เพิ่ม pet_type เป็น array ของ ENUM
      // profileData.petType.forEach((type) => formData.append("pet_type", type));

      // formData.append("services", profileData.services);
      // formData.append("place", profileData.place);

      // // เพิ่ม gallery ไม่เกิน 10 รูป
      // profileData.gallery.slice(0, 10).forEach((image) => {
      //   formData.append("galleries", image); // แต่ละรายการใน gallery ควรเป็นไฟล์ (Blob หรือ File)
      // });

      formData.append("address_detail", profileData.addressDetail);
      formData.append("district", profileData.district);
      formData.append("sub_district", profileData.subDistrict);
      formData.append("province", profileData.province);
      formData.append("post_code", profileData.postCode);

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      // ส่งคำขอด้วย axios และกำหนด headers ว่าเป็น multipart/form-data
      const response = await axios.put("/api/pet-sitter/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Profile updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile data:", error);
      throw error;
    }
  };

  return (
    <PetSitterProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        createProfileData,
        updateProfileData,
        errorMessages,
      }}
    >
      {children}
    </PetSitterProfileContext.Provider>
  );
};
