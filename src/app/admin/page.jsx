"use client";
import { signOut } from "next-auth/react";
import React from "react";

function AdminPage() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };
  return (
    <div>
      <button onClick={handleSignOut}>Log Out</button>;
    </div>
  );
}

export default AdminPage;
