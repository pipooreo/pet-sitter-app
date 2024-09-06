"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Navbar from "@/components/common/Navbar";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useRouter } from "next/navigation"; // ใช้ useRouter จาก next/navigation

function Sitterpage() {
  const { data: session, status } = useSession();
  const router = useRouter(); // เรียกใช้ useRouter

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // ป้องกันการรีไดเรกต์ทันที
      toast.success("Logged out successfully!"); // แสดง toast เมื่อออกจากระบบสำเร็จ
      router.replace("/login/pet-sitter"); // นำทางไปยังหน้า login
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };

  const handleHi = async () => {
    try {
      toast.info("HEHE XD");
    } catch (error) {}
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen justify-center items-center">
        <BeatLoader size={15} color={"#FF7037"} margin={2} />
      </div>
    );
  }

  return (
    <div>
      <Navbar session={session} />
      <button onClick={handleSignOut}>Log Out</button>
      <button onClick={handleHi}> meow</button>
    </div>
  );
}

export default Sitterpage;
