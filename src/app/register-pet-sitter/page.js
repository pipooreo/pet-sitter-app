'use client';

import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import validator from 'validator';

export default function RegisterPetSitterPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

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
    setEmailError('');
    return true;
  };

  const validatePhone = () => {
    // ลบ ตัวอักษรที่ไม่ใช่ตัวเลข (เช่น ช่องว่าง, ขีดคั่น, วงเล็บ, และสัญลักษณ์อื่น ๆ) ออกจากสตริง phone และคืนค่าหมายเลขโทรศัพท์ที่มีเฉพาะตัวเลขเท่านั้น.
    const normalizedPhone = phone.trim().replace(/\D/g, '');

    if (!validator.isMobilePhone(normalizedPhone, 'th-TH') && phone) {
      setPhoneError(
        <p>
          Please enter a valid Thai phone number.
          <br />
          (e.g. 091-234-5678)
        </p>
      );
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = () => {
    if (password.length < 12 && password) {
      setPasswordError('Password must be at least 12 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ตรวจสอบการกรอกข้อมูลก่อนส่ง
    if (!email.trim() || !phone.trim() || !password.trim()) {
      toast.error('Please fill the information before submitting.');
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPhoneValid || !isPasswordValid) {
      toast.error('Please correct the errors before submitting.');
      return;
    }

    // เริ่มส่งคำร้อง
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register-pet-sitter', {
        email,
        phone,
        password
      });

      toast.success(response.data.message);

      router.push('/login/sitter');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="w-screen min-h-screen md:h-screen bg-white flex justify-center items-center">
      {loading ? (
        <div className="flex justify-center items-center">
          <BeatLoader size={15} color={'#FF7037'} margin={2} />
        </div>
      ) : (
        <div className="w-full max-w-[1440px] h-full max-h-[1024px] md:relative flex justify-center items-center overflow-hidden">
          <section className="w-full max-w-[440px] p-3 my-6">
            <div className="text-center">
              <h1 className="text-head2 md:text-head1 text-black">Join Us!</h1>
              <p className="text-body1 md:text-head3 text-gray-400">
                Become the best Pet Sitter with us
              </p>
            </div>
            <div className="mt-6 md:mt-20">
              <form onSubmit={handleRegister} className="flex flex-col gap-6">
                <div className="relative">
                  <label htmlFor="email" className="block text-black">
                    Email
                  </label>
                  <input
                    id="email"
                    className={`bg-white w-full p-3 text-black border ${
                      emailError
                        ? 'border-red placeholder-black'
                        : 'border-gray-200 placeholder-gray-400'
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
                      <div className="text-red mt-1 text-body3">
                        {emailError}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="phone" className="block text-black">
                    Phone
                  </label>
                  <input
                    id="phone"
                    className={`bg-white w-full p-3 text-black border ${
                      phoneError
                        ? 'border-red placeholder-black'
                        : 'border-gray-200 placeholder-gray-400'
                    } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                    type="tel"
                    placeholder="Your phone number e.g. 091-234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={validatePhone}
                  />
                  {phoneError && (
                    <>
                      <img
                        className="absolute top-10 right-4"
                        src="/exclamation-circle.png"
                      />
                      <div className="text-red mt-1 text-body3">
                        {phoneError}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-black">
                    Password
                  </label>
                  <input
                    id="password"
                    className={`bg-white w-full p-3 text-black border ${
                      passwordError
                        ? 'border-red placeholder-black'
                        : 'border-gray-200 placeholder-gray-400'
                    } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                    type="password"
                    placeholder="Create your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                  />
                  {passwordError && (
                    <>
                      <img
                        className="absolute top-10 right-4"
                        src="/exclamation-circle.png"
                      />
                      <div className="text-red mt-1 text-body3">
                        {passwordError}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 w-full rounded-full text-white p-4"
                >
                  Register
                </button>
              </form>
              <div className="mt-6 flex flex-col gap-6">
                <div className="text-center text-black">
                  <p>
                    Already have Pet Sitter account?
                    <a
                      href="/login/sitter"
                      className="text-orange-500 hover:text-orange-400 active:text-orange-600 pl-3 font-bold cursor-pointer"
                    >
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
