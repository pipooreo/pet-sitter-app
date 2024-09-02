"use client";

import axios from "axios";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import validator from "validator";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    if (!validator.isEmail(email.trim()) && email) {
      setEmailError(
        <p>
          Please enter a valid email address.
          <br />
          (e.g. email@company.com)
        </p>
      );
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    // ตรวจสอบการกรอกข้อมูลก่อนส่ง
    if (!email.trim()) {
      toast.error("Please fill the information before submitting.");
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    const isEmailValid = validateEmail();

    if (!isEmailValid) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    // เริ่มส่งคำร้อง
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", {
        email
      });
      toast.success(response.data.message);
      setSuccessMessage(
        <span>
          ✅ We have sent an email to <strong>{email}</strong> with a link.
          Click on the link and follow on-screen instructions.
        </span>
      );
      setEmail("");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to send email";
      toast.error(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-screen min-h-screen md:h-screen bg-white flex justify-center items-center">
      <section className="w-full max-w-[440px] p-3 my-6">
        <div className="text-start">
          <h1 className="text-head2 md:text-head1 text-black">
            Forgot Password
          </h1>
          <p className="text-body1 md:text-head3 text-gray-400">
            Enter your email to receive a password reset link
          </p>
        </div>
        <div className="mt-6 md:mt-12">
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
            {successMessage && (
              <div className="bg-green-100 border border-green-500 text-body1 text-gray-600 p-3 rounded-lg mb-4">
                <p>{successMessage}</p>
              </div>
            )}
            <div className="relative">
              <label htmlFor="email" className="block text-black">
                Email
              </label>
              <input
                id="email"
                className={`bg-white w-full p-3 text-black border ${
                  emailError
                    ? "border-red placeholder-black"
                    : "border-gray-200 placeholder-gray-400"
                } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                type="email"
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
              />
              {emailError && (
                <>
                  <img
                    className="absolute top-10 right-4"
                    src="/exclamation-circle.png"
                  />
                  <div className="text-red mt-1 text-body3">{emailError}</div>
                </>
              )}
            </div>
            {loading ? (
              <button className="p-4 bg-gray-200 rounded-full" disabled>
                <BeatLoader size={15} color={"#FF7037"} margin={2} />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 w-full rounded-full text-white p-4"
              >
                Submit
              </button>
            )}
          </form>
          <div className="mt-6 text-center text-black">
            <p>
              <a
                href="/login"
                className="text-orange-500 hover:text-orange-400 active:text-orange-600 pl-3 font-bold cursor-pointer"
              >
                Go back to login
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
