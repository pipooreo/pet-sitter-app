"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import validator from "validator";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  const validateOtp = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("OTP must be 6 digits.");
      return false;
    }
    setOtpError("");
    return true;
  };

  const validateNewPassword = () => {
    const passwordComplexityPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (
      newPassword &&
      (newPassword.length < 12 ||
        !validator.matches(password, passwordComplexityPattern))
    ) {
      setNewPasswordError(
        <p>
          Password must meet the following criteria:
          <br />• At least <strong>12 characters long</strong>
          <br />• Contain at least <strong>one uppercase letter (A-Z)</strong>
          <br />• Contain at least <strong>one lowercase letter (a-z)</strong>
          <br />• Contain at least <strong>one digit (0-9)</strong>
          <br />• Contain at least{" "}
          <strong>one special character (@$!%*?&)</strong>
        </p>
      );
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const validateConfirmPassword = () => {
    if (newPassword !== confirmPassword && confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    // Move focus to the next input if current input is filled
    if (e.target.value.length === 1 && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // ตรวจสอบการกรอกข้อมูลก่อนส่ง
    if (
      !email.trim() ||
      !otp.join("") ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill the information before submitting.");
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    if (
      !validateOtp() ||
      !validateNewPassword() ||
      !validateConfirmPassword()
    ) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    try {
      const otpString = otp.join("");
      const response = await axios.post("/api/auth/password-reset", {
        email,
        otp: otpString,
        newPassword,
      });
      toast.success(response.data.message);
      router.push("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ?? "Failed to reset password";
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-screen min-h-screen flex justify-center items-center bg-white">
      <section className="w-full max-w-md p-6 rounded-lg">
        <h1 className="text-head2 md:text-head1 text-black">Reset Password</h1>
        <form
          onSubmit={handleResetPassword}
          className="mt-6 flex flex-col gap-6"
        >
          {errorMessage && (
            <div className="relative border border-red p-3 rounded-lg">
              <p className="text-red">{errorMessage}</p>
              <img
                className="absolute bottom-3 right-4"
                src="/exclamation-circle.png"
              />
            </div>
          )}
          <div>
            <label className="block text-black">OTP</label>
            <div className="flex gap-2">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength="1"
                  className={`flex-1 min-w-0 h-12 md:h-14 bg-white text-center text-black text-body1 border ${
                    otpError ? "border-red" : "border-gray-300"
                  } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                />
              ))}
            </div>
            {otpError && <p className="text-red mt-1 text-body3">{otpError}</p>}
          </div>
          <div className="relative">
            <label htmlFor="newPassword" className="block text-black">
              New Password
            </label>
            <input
              id="newPassword"
              className={`w-full p-3 bg-white border text-black rounded-lg ${
                newPasswordError ? "border-red" : "border-gray-300"
              } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
              type="password"
              placeholder="Create your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={validateNewPassword}
            />
            {newPasswordError && (
              <>
                <img
                  className="absolute top-10 right-4"
                  src="/exclamation-circle.png"
                />
                <div className="text-red mt-1 text-body3">
                  {newPasswordError}
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-black">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              className={`w-full p-3 bg-white border text-black rounded-lg ${
                confirmPasswordError ? "border-red" : "border-gray-300"
              } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500`}
            />
            {confirmPasswordError && (
              <>
                <img
                  className="absolute top-10 right-4"
                  src="/exclamation-circle.png"
                />
                <div className="text-red mt-1 text-body3">
                  {confirmPasswordError}
                </div>
              </>
            )}
          </div>
          {loading ? (
            <button
              type="submit"
              className="p-4 bg-gray-200 rounded-full"
              disabled
            >
              <BeatLoader size={15} color={"#FF7037"} margin={2} />
            </button>
          ) : (
            <button
              type="submit"
              className="bg-orange-500 text-white p-4 rounded-full hover:bg-orange-400"
            >
              Reset Password
            </button>
          )}
        </form>
      </section>
    </main>
  );
}
