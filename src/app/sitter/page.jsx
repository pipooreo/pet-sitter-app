"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Navbar from "@/components/common/Navbar";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation"; // ใช้ useRouter จาก next/navigation

function Sitterpage() {
  const { data: session } = useSession();
  const router = useRouter(); // เรียกใช้ useRouter

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // ป้องกันการรีไดเรกต์ทันที
      toast.success("Logged out successfully!"); // แสดง toast เมื่อออกจากระบบสำเร็จ
      router.replace("/login/sitter"); // นำทางไปยังหน้า login
    } catch (error) {
      toast.error("An error occurred while logging out.");
    }
  };

  const handleHi = async () => {
    try {
      toast.info("HEHE XD");
    } catch (error) {}
  };

  return (
    <div>
      <Navbar session={session} />
      <button onClick={handleSignOut}>Log Out</button>
      <button onClick={handleHi}> meow</button>
    </div>
  );
}

export default Sitterpage;
