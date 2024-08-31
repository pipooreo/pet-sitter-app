"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";

function Sitterpage() {
  const { data: session } = useSession();
  console.log(session);
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/loginsitter" });
  };
  return (
    <div>
      <button onClick={handleSignOut}>Log Out</button>
    </div>
  );
}

export default Sitterpage;
