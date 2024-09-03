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
  const handleHi = async () => {
    try {
      toast.info("HEHE XD");
    } catch (error) {}
  };
  useEffect(() => {
    const rememberMeStored = localStorage.getItem("rememberMe");
    setRememberMe(rememberMeStored === "true");
  }, []);

  useEffect(() => {
    // Redirect to login if the session is not valid or expired
    if (status === "authenticated" && session) {
      const tokenExpiration = session?.expires; // Adjust based on your actual session expiration handling
      const now = Date.now() / 1000; // Current time in seconds
      if (tokenExpiration && tokenExpiration < now) {
        signOut({ redirect: false });
        router.push("/login");
      }
    }
  }, [status, session]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("rememberMe");
      await signOut({ redirect: false });
      toast.info("Sign out successfully XD");

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
        <h1>Admin Page</h1>
        {session && <div>{session.user.email}</div>}
        {/* <div>session {session.user.email}</div> */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-black p-2 rounded"
        >
          Logout
        </button>
        <button onClick={handleHi}> meow</button>
        <div>Is remember me checked? {rememberMe ? "Yes" : "No"}</div>
      </div>
    </MainLayout>
  );
}

export default AdminPage;
