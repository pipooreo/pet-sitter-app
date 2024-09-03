// components/Modal.js

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const LogoutModal = ({ isOpen, onClose, setDropdownOpen }) => {
  if (!isOpen) return null;

  const router = useRouter();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("rememberMe");
      await signOut({ redirect: false });
      toast.success("Sign out successfully XD");
      onClose();
      setDropdownOpen(false);
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white p-6 rounded shadow-lg ">
        <h2 className="text-xl mb-4">Confirm Logout?</h2>
        <p className="mb-4"></p>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
