"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  // useEffect(() => {
  //   console.log("hi", session);
  // }, []);

  // useEffect(() => {
  //   const rememberMeStored = localStorage.getItem("rememberMe");
  //   toast.info("hi admin lol");
  //   if (rememberMeStored !== null) {
  //     setRememberMe(rememberMeStored === "true");
  //   } else {
  //     console.log("rememberMeStored is null");
  //   }

  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, router]);

  const handleLogout = async () => {
    try {
      toast.info("HEHE XD");
      await signOut({ redirect: false });
      localStorage.removeItem("rememberMe");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout session={session}>
      <div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h1>Admin Page</h1>
        {session && <div>{session.user.email}</div>}
        {/* <div>session {session.user.email}</div> */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-black p-2 rounded"
        >
          Logout
        </button>
        <div>Is remember me checked? {rememberMe ? "Yes" : "No"}</div>
      </div>
    </MainLayout>
  );
}

export default AdminPage;
