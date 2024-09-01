import React from "react";
import Link from "next/link";

function RegisterPage() {
  return (
    <div>
      <h1>Register Page</h1>
      <Link
        href="/login/sitter"
        className="lg:p-[16px_24px] p-[16px_20px] hover:text-gray-400 active:text-gray-600"
      >
        Become a Pet Sitter
      </Link>
    </div>
  );
}

export default RegisterPage;
