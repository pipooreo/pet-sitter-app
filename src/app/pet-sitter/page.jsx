"use client";

import React from "react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import NavbarSitter from "@/components/pet-sitter-profile/NavbarSitter";
import Header from "@/components/pet-sitter-profile/Header";
import BasicInformationForm from "@/components/pet-sitter-profile/BasicInformationForm";
import PetSitterForm from "@/components/pet-sitter-profile/PetSitterForm";
import AddressForm from "@/components/pet-sitter-profile/AddressForm";
import { PetSitterProfileProvider } from "@/context/PetSitterProfileContext";
import { LuUser2 } from "react-icons/lu";
import { CiCalendar } from "react-icons/ci";
import { FaListUl } from "react-icons/fa6";
import { BsCreditCard } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";
import { useProfile } from "@/context/PetSitterProfileContext";

function Sitterpage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const formikRef = useRef(null);
  const { createProfileData, updateProfileData } = useProfile();
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // ป้องกันการรีไดเรกต์ทันที
      toast.success("Logged out successfully!"); // แสดง toast เมื่อออกจากระบบสำเร็จ
      router.replace("/login/pet-sitter"); // นำทางไปยังหน้า login
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("handleFormSubmit called with values:", values);

    try {
      await updateProfileData(values); // Call the updateProfileData from context
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("An error occurred while updating the profile.");
    } finally {
      setSubmitting(false); // Ensure to set submitting state back to false
    }
  };

  const handleRequest = async (values, { setSubmitting }) => {
    console.log("handleFormSubmit called with values:", values);

    try {
      await createProfileData(values); // Call the updateProfileData from context
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("An error occurred while updating the profile.");
    } finally {
      setSubmitting(false); // Ensure to set submitting state back to false
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen justify-center items-center">
        <BeatLoader size={15} color={"#FF7037"} margin={2} />
      </div>
    );
  }

  // หากผู้ใช้ไม่ได้เข้าสู่ระบบ จะนำทางไปยังหน้าเข้าสู่ระบบ
  if (status === "unauthenticated") {
    router.replace("/login/pet-sitter");
    return null; // ไม่ต้อง render อะไรในขณะนี้
  }

  return (
    <PetSitterProfileProvider>
      <div className="flex">
        <div className="drawer lg:drawer-open bg-white">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content bg-gray-100 h-full">
            <NavbarSitter
              session={session}
              className="sticky top-0 z-10 bg-white"
            />
            {selectedMenu === "profile" && (
              <section className="flex flex-col gap-6 p-[40px]">
                {/* <Header onSubmit={handleFormSubmit} onRequest={handleRequest} /> */}
                <Header
                  onSubmit={() => formikRef.current.submitForm()}
                  onRequest={() => formikRef.current.submitForm()}
                />
                <BasicInformationForm
                  formikRef={formikRef}
                  handleSubmit={handleSubmit}
                  handleRequest={handleRequest}
                />
                <PetSitterForm />
                <AddressForm />
              </section>
            )}
            {selectedMenu === "booking" && <div>Booking List Content</div>}
            {selectedMenu === "calendar" && <div>Calendar Content</div>}
            {selectedMenu === "payout" && <div>Payout Option Content</div>}
          </div>
          <div className="drawer-side h-screen">
            <ul className="bg-gray-[#FAFAFB] min-h-full  flex flex-col justify-between text-[16px] font-medium border-r border-gray-200">
              <div>
                <div className="p-[24px_24px_40px_24px]">
                  <img
                    src="/logo-black.png"
                    alt=""
                    className="w-[131.61px] h-[40px] "
                  />
                </div>

                <li
                  onClick={() => handleMenuSelect("profile")}
                  className={`cursor-pointer text-gray-500 hover:text-orange-500 p-[16px_24px_16px_24px] flex justify-start items-center gap-[16px] ${
                    selectedMenu === "profile" &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <LuUser2 className="w-[20px] h-[20px]" />
                  <a>Pet Sitter Profile</a>
                </li>
                <li
                  onClick={() => handleMenuSelect("booking")}
                  className={`cursor-pointer text-gray-500 hover:text-orange-500 p-[16px_24px_16px_24px] flex justify-start items-center gap-[16px] ${
                    selectedMenu === "booking" &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <FaListUl className="w-[20px] h-[20px]" />
                  <a>Booking List</a>
                </li>
                <li
                  onClick={() => handleMenuSelect("calendar")}
                  className={`cursor-pointer text-gray-500 hover:text-orange-500 p-[16px_24px_16px_24px] flex justify-start items-center gap-[16px] ${
                    selectedMenu === "calendar" &&
                    "bg-orange-100 text-orange-500"
                  }`}
                >
                  <CiCalendar className="w-[25px] h-[25px]" />
                  <a>Calendar</a>
                </li>
                <li
                  onClick={() => handleMenuSelect("payout")}
                  className={`cursor-pointer text-gray-500 hover:text-orange-500 p-[16px_24px_16px_24px] flex justify-start items-center gap-[16px] ${
                    selectedMenu === "payout" && "bg-orange-100 text-orange-500"
                  }`}
                >
                  <BsCreditCard className="w-[20px] h-[20px]" />
                  <a>Payout Option</a>
                </li>
              </div>

              <li className="active:bg-orange-100 active:text-orange-500 text-gray-500 hover:text-orange-500 p-[16px_24px_16px_24px] flex justify-start items-center gap-[16px] border-t border-gray-200">
                <svg
                  width="20"
                  height="16.67"
                  viewBox="0 0 14 18"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.332031 8.99996C0.332031 9.22097 0.419829 9.43293 0.576109 9.58922C0.732389 9.7455 0.944351 9.83329 1.16536 9.83329H7.49036L5.5737 11.7416C5.49559 11.8191 5.4336 11.9113 5.39129 12.0128C5.34898 12.1144 5.3272 12.2233 5.3272 12.3333C5.3272 12.4433 5.34898 12.5522 5.39129 12.6538C5.4336 12.7553 5.49559 12.8475 5.5737 12.925C5.65117 13.0031 5.74333 13.0651 5.84488 13.1074C5.94643 13.1497 6.05535 13.1715 6.16536 13.1715C6.27537 13.1715 6.3843 13.1497 6.48585 13.1074C6.58739 13.0651 6.67956 13.0031 6.75703 12.925L10.0904 9.59163C10.1662 9.51237 10.2257 9.41892 10.2654 9.31663C10.3487 9.11374 10.3487 8.88618 10.2654 8.68329C10.2257 8.581 10.1662 8.48755 10.0904 8.40829L6.75703 5.07496C6.67933 4.99726 6.58709 4.93563 6.48557 4.89358C6.38405 4.85153 6.27525 4.82988 6.16536 4.82988C6.05548 4.82988 5.94667 4.85153 5.84516 4.89358C5.74364 4.93563 5.6514 4.99726 5.5737 5.07496C5.496 5.15266 5.43436 5.2449 5.39231 5.34642C5.35026 5.44794 5.32862 5.55674 5.32862 5.66663C5.32862 5.77651 5.35026 5.88532 5.39231 5.98683C5.43436 6.08835 5.496 6.18059 5.5737 6.25829L7.49036 8.16663H1.16536C0.944351 8.16663 0.732389 8.25442 0.576109 8.4107C0.419829 8.56698 0.332031 8.77895 0.332031 8.99996ZM11.1654 0.666626H2.83203C2.16899 0.666626 1.53311 0.930018 1.06426 1.39886C0.595423 1.8677 0.332031 2.50358 0.332031 3.16663V5.66663C0.332031 5.88764 0.419829 6.0996 0.576109 6.25588C0.732389 6.41216 0.944351 6.49996 1.16536 6.49996C1.38638 6.49996 1.59834 6.41216 1.75462 6.25588C1.9109 6.0996 1.9987 5.88764 1.9987 5.66663V3.16663C1.9987 2.94561 2.0865 2.73365 2.24278 2.57737C2.39906 2.42109 2.61102 2.33329 2.83203 2.33329H11.1654C11.3864 2.33329 11.5983 2.42109 11.7546 2.57737C11.9109 2.73365 11.9987 2.94561 11.9987 3.16663V14.8333C11.9987 15.0543 11.9109 15.2663 11.7546 15.4225C11.5983 15.5788 11.3864 15.6666 11.1654 15.6666H2.83203C2.61102 15.6666 2.39906 15.5788 2.24278 15.4225C2.0865 15.2663 1.9987 15.0543 1.9987 14.8333V12.3333C1.9987 12.1123 1.9109 11.9003 1.75462 11.744C1.59834 11.5878 1.38638 11.5 1.16536 11.5C0.944351 11.5 0.732389 11.5878 0.576109 11.744C0.419829 11.9003 0.332031 12.1123 0.332031 12.3333V14.8333C0.332031 15.4963 0.595423 16.1322 1.06426 16.6011C1.53311 17.0699 2.16899 17.3333 2.83203 17.3333H11.1654C11.8284 17.3333 12.4643 17.0699 12.9331 16.6011C13.402 16.1322 13.6654 15.4963 13.6654 14.8333V3.16663C13.6654 2.50358 13.402 1.8677 12.9331 1.39886C12.4643 0.930018 11.8284 0.666626 11.1654 0.666626Z"
                    fill="currentColor"
                  />
                </svg>
                <button onClick={handleSignOut}>Log Out</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PetSitterProfileProvider>
  );
}

export default Sitterpage;
