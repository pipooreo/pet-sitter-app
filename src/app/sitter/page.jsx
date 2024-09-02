"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Navbar from "@/components/common/Navbar";

function Sitterpage() {
  const { data: session } = useSession();
  console.log(session);
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login/sitter" });
  };
  return (
    <div>
      <Navbar session={session} />
      <button onClick={handleSignOut}>Log Out</button>
    </div>
  );
}

export default Sitterpage;
