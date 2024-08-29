'use client';

import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import validator from 'validator';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateEmail = () => {
    if (!validator.isEmail(email)) {
      setEmailError(
        'Please enter a valid email address. <br />(e.g. email@company.com)'
      );
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = () => {
    const normalizedPhone = phone.replace(/\D/g, ''); // Remove non-numeric characters
    if (!validator.isMobilePhone(normalizedPhone, 'th-TH')) {
      setPhoneError(
        'Please enter a valid Thai phone number. <br />(e.g. 0912345678).'
      );
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = () => {
    if (password.length < 12) {
      setPasswordError('Password must be at least 12 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPhoneValid || !isPasswordValid) {
      toast.error('Please correct the errors before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        phone,
        password
      });
      router.push('/search');
      toast.success(response.data.message);
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
        <div>
          <div className="w-[239px] h-[350px] hidden md:block md:absolute md:top-[75px] md:right-0 bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
          <div className="w-[144px] h-[144px] absolute top-[-57px] right-[-10px] md:hidden bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
          <div className="w-[318px] h-[310px] hidden md:block md:absolute md:bottom-[-105px] md:left-[-80px] bg-[url('/star-green.png')] bg-contain bg-center bg-no-repeat rotate-[-15deg]"></div>
          <div className="w-[166px] h-[88px] hidden md:block md:absolute md:bottom-[210px] md:left-0 bg-[url('/ellipse-blue.png')] bg-contain bg-center bg-no-repeat"></div>
          <section className="w-full max-w-[440px] p-3 my-6">
            <div className="text-center">
              <h1 className="text-head2 md:text-head1 text-black">Join Us!</h1>
              <p className="text-body1 md:text-head3 text-gray-400">
                Find your perfect pet sitter with us
              </p>
            </div>
            <div className="mt-6 md:mt-20">
              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="email" className="block text-black">
                    Email
                  </label>
                  <input
                    id="email"
                    className={`bg-white w-full p-3 placeholder-gray-400 text-black border ${
                      emailError ? 'border-red' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                    type="email"
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                  />
                  {emailError && (
                    <p
                      className="text-red mt-1 text-body3"
                      dangerouslySetInnerHTML={{ __html: emailError }}
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-black">
                    Phone
                  </label>
                  <input
                    id="phone"
                    className={`bg-white w-full p-3 placeholder-gray-400 text-black border ${
                      phoneError ? 'border-red' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                    type="tel"
                    placeholder="Your phone number e.g. 0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={validatePhone}
                    // required
                  />
                  {phoneError && (
                    // <p className="text-red-500 mt-1 text-sm">{phoneError}</p>
                    <p
                      className="text-red mt-1 text-body3"
                      dangerouslySetInnerHTML={{ __html: phoneError }}
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-black">
                    Password
                  </label>
                  <input
                    id="password"
                    className={`bg-white w-full p-3 placeholder-gray-400 text-black border ${
                      passwordError ? 'border-red' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg`}
                    type="password"
                    placeholder="Create your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                    // required
                  />
                  {passwordError && (
                    <p className="text-red mt-1 text-body3">{passwordError}</p>
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
                <div className="flex items-center">
                  <div className="flex-grow">
                    <hr className="border-t-2 border-gray-200" />
                  </div>
                  <div className="px-4 text-body1 text-gray-400 whitespace-nowrap">
                    Or Continue With
                  </div>
                  <div className="flex-grow">
                    <hr className="border-t-2 border-gray-200" />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className="flex items-center justify-center flex-grow w-full bg-gray-200 hover:bg-gray-100 active:bg-gray-300 text-gray-400 hover:text-black font-bold py-4 rounded-full">
                    <img
                      src="/facebook-logo.png"
                      alt="facebook logo"
                      className="w-5 h-5 mr-2"
                    />
                    Facebook
                  </button>
                  <button className="flex items-center justify-center flex-grow w-full bg-gray-200 hover:bg-gray-100 active:bg-gray-300 text-gray-400 hover:text-black font-bold py-4 rounded-full">
                    <img
                      src="/google-logo.png"
                      alt="google logo"
                      className="w-5 h-5 mr-2"
                    />
                    Gmail
                  </button>
                </div>
                <div className="text-center text-black">
                  <p>
                    Already have an account?
                    <a className="text-orange-500 hover:text-orange-400 active:text-orange-600 pl-3 font-bold cursor-pointer">
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

// export default function RegisterPage() {
//   return (
//     <main className="w-screen h-screen bg-white flex justify-center items-center">
//       <div className="w-[239px] h-[350px] hidden md:block md:absolute md:top-[75px] md:right-0 bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
//       <div className="w-[144px] h-[144px] absolute top-[-57px] right-[-10px] md:hidden bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
//       <div className="w-[318px] h-[310px] hidden md:block md:absolute md:bottom-[-105px] md:left-[-80px] bg-[url('/star-green.png')] bg-contain bg-center bg-no-repeat rotate-[-15deg]"></div>
//       <div className="w-[166px] h-[88px] hidden md:block md:absolute md:bottom-[210px] md:left-0 bg-[url('/ellipse-blue.png')] bg-contain bg-center bg-no-repeat"></div>
//       <section className="w-full max-w-[440px] p-3">
//         <div className="text-center">
//           <h1 className="text-head2 md:text-head1 text-black">Join Us!</h1>
//           <p className="text-body1 md:text-head3 text-gray-400">
//             Find your perfect pet sitter with us
//           </p>
//         </div>
//         <div className="mt-6 md:mt-20">
//           <form action="" className="flex flex-col gap-5">
//             <div>
//               <label htmlFor="email" className="block text-black">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 className="bg-white w-full p-3 placeholder-gray-400 text-black border  border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg"
//                 type="email"
//                 placeholder="email@company.com"
//               />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-black">
//                 Phone
//               </label>
//               <input
//                 id="phone"
//                 className="bg-white w-full p-3 placeholder-gray-400 text-black border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg"
//                 type="tel"
//                 placeholder="Your phone number"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-black">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 className="bg-white w-full p-3 placeholder-gray-400 text-black border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg"
//                 type="password"
//                 placeholder="Create your password"
//               />
//             </div>
//             <button className="bg-orange-500 w-full rounded-full text-white p-3">
//               Register
//             </button>
//           </form>

//           <div className="mt-6 flex flex-col gap-6">
//             <div className="flex items-center">
//               <div className="flex-grow">
//                 <hr className="border-t-2 border-gray-200" />
//               </div>
//               <div className="px-4 text-body1 text-gray-400 whitespace-nowrap">
//                 Or Continue With
//               </div>
//               <div className="flex-grow">
//                 <hr className="border-t-2 border-gray-200" />
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <button className="flex items-center justify-center flex-grow w-full bg-gray-200 text-gray-400 py-3 rounded-full">
//                 <img
//                   src="/facebook-logo.png"
//                   alt="facebook logo"
//                   className="w-5 h-5 mr-2"
//                 />
//                 Facebook
//               </button>
//               <button className="flex items-center justify-center flex-grow w-full bg-gray-200 text-gray-400 py-3 rounded-full">
//                 <img
//                   src="/google-logo.png"
//                   alt="google logo"
//                   className="w-5 h-5 mr-2"
//                 />
//                 Gmail
//               </button>
//             </div>
//             <div className="text-center text-black">
//               <p>
//                 Already have an account?
//                 <a className="text-orange-500 pl-3 font-bold cursor-pointer">
//                   Login
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
