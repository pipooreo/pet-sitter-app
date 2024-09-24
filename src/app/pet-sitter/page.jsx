"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Navbar from "@/components/common/Navbar";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation"; // ใช้ useRouter จาก next/navigation
import NavbarSitter from "@/components/pet-sitter-profile/NavbarSitter";
import Header from "@/components/pet-sitter-profile/Header";
import BasicInformationForm from "@/components/pet-sitter-profile/BasicInformationForm";
import PetSitterForm from "@/components/pet-sitter-profile/PetSitterForm";
import AddressForm from "@/components/pet-sitter-profile/AddressForm";
import { PetSitterProfileProvider } from "@/context/PetSitterProfileContext";

function Sitterpage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // const handleSignOut = async () => {
  //   try {
  //     await signOut({ redirect: false }); // ป้องกันการรีไดเรกต์ทันที
  //     toast.success("Logged out successfully!"); // แสดง toast เมื่อออกจากระบบสำเร็จ
  //     router.replace("/login/pet-sitter"); // นำทางไปยังหน้า login
  //   } catch (error) {
  //     toast.error("An error occurred while logging out.");
  //   }
  // };

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

  {
    /* <button onClick={handleSignOut}>Log Out</button>
     */
  }
  return (
    <PetSitterProfileProvider>
      <div className="flex">
        <aside className="bg-gray-200 w-1/6 "></aside>
        <main className="w-5/6 ">
          <NavbarSitter />
          <section className="bg-gray-100 px-10 pt-5 pb-20 flex flex-col gap-6">
            <Header />
            <BasicInformationForm />
            <PetSitterForm />
            <AddressForm />
          </section>
        </main>
      </div>
    </PetSitterProfileProvider>
  );
}

export default Sitterpage;
