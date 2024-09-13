"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BeatLoader } from "react-spinners";
const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else if (session?.user?.role === "owner") {
        router.push("/");
      } else {
        setIsLoading(false);
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <BeatLoader size={15} color={"#FF7037"} margin={2} />
      </div>
    );
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email (email@company.com)")
      .required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
    // remember: yup.boolean(),
  });

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      console.log("Remember me checked");
    } else {
      console.log("Remember me unchecked");
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setButtonLoading(true);
    try {
      const result = await signIn("owner-admin-login", {
        redirect: false,
        email: values.email,
        password: values.password,
        rememberMe: rememberMe, // Pass rememberMe flag
        // callbackUrl: "/admin", // Optionally add callback URL here
      });
      if (result.error) {
        toast.error("Email or Password is wrong");
        setButtonLoading(false);
      } else if (result.ok) {
        // Update cookie logic if needed
        document.cookie = `rememberMe=${rememberMe}; path=/`;
        setIsLoading(true);
        toast.success("Login successful!");
        router.replace(result.url || "/admin");
        // router.replace("/admin");
      }
    } catch (error) {
      // setIsLoading(false);
      toast.error("Email or Password is wrong");
      setButtonLoading(false);
      // setFieldError("password", "Email or Password is wrong");
    }
  };

  return (
    <main>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <BeatLoader size={15} color={"#FF7037"} margin={2} />
        </div>
      ) : (
        <div className="w-full  h-screen md:relative flex justify-center items-center overflow-hidden">
          <div className="sm:w-[440px] w-full sm:p-0 p-[60px_16px] flex flex-col justify-between sm:gap-[56px] gap-[40px]">
            <div className="flex flex-col justify-center items-center">
              <div className="w-[239px] h-[350px] hidden md:block md:absolute md:top-[75px] md:right-0 bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
              <div className="w-[144px] h-[144px] absolute top-[-57px] right-[-10px] md:hidden bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
              <div className="w-[318px] h-[310px] hidden md:block md:absolute md:bottom-[-105px] md:left-[-80px] bg-[url('/star-green.png')] bg-contain bg-center bg-no-repeat rotate-[-15deg]"></div>
              <div className="w-[166px] h-[88px] hidden md:block md:absolute md:bottom-[210px] md:left-0 bg-[url('/ellipse-blue.png')] bg-contain bg-center bg-no-repeat"></div>
              <h1 className="sm:text-head1 text-[36px] font-bold text-black">
                Welcome Back!
              </h1>
              <h3 className="sm:text-head3 text-[18px] font-medium text-gray-400">
                Find the best Pet Sitter with us
              </h3>
            </div>
            <div className="flex flex-col justify-center w-full bg-white">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="flex flex-col gap-[32px] ">
                    <div>
                      <label htmlFor="email" className="text-black text-body2 ">
                        Email
                      </label>
                      <div className="relative">
                        <Field
                          type="email"
                          name="email"
                          placeholder="email@company.com"
                          className={`mb-2 p-2 pr-10 w-full bg-white border rounded-lg outline-none transition-colors duration-200
                      ${
                        errors.email && touched.email
                          ? "border-red"
                          : "border-gray-200"
                      }
                       focus:border-orange-400`}
                        />
                        {errors.email && touched.email && (
                          <svg
                            width="14"
                            height="14"
                            className="absolute right-3 top-[22px] transform -translate-y-1/2 text-red"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.4016 6.99961C13.4016 10.5342 10.5362 13.3996 7.00156 13.3996C3.46694 13.3996 0.601562 10.5342 0.601562 6.99961C0.601562 3.46499 3.46694 0.599609 7.00156 0.599609C10.5362 0.599609 13.4016 3.46499 13.4016 6.99961ZM7.80156 10.1996C7.80156 10.6414 7.44339 10.9996 7.00156 10.9996C6.55974 10.9996 6.20156 10.6414 6.20156 10.1996C6.20156 9.75778 6.55974 9.39961 7.00156 9.39961C7.44339 9.39961 7.80156 9.75778 7.80156 10.1996ZM7.00156 2.99961C6.55974 2.99961 6.20156 3.35778 6.20156 3.79961V6.99961C6.20156 7.44144 6.55974 7.79961 7.00156 7.79961C7.44339 7.79961 7.80156 7.44144 7.80156 6.99961V3.79961C7.80156 3.35778 7.44339 2.99961 7.00156 2.99961Z"
                              fill="#EA1010"
                            />
                          </svg>
                        )}
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red mb-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="text-black text-body2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          name="password"
                          className={`mb-2 p-2 border w-full bg-white rounded-lg outline-none transition-colors duration-200
                      ${
                        errors.password && touched.password
                          ? "border-red"
                          : "border-gray-200"
                      }
                       focus:border-orange-400`}
                        />
                        {errors.password && touched.password && (
                          <svg
                            width="14"
                            height="14"
                            className="absolute right-3 top-[22px] transform -translate-y-1/2 text-red"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.4016 6.99961C13.4016 10.5342 10.5362 13.3996 7.00156 13.3996C3.46694 13.3996 0.601562 10.5342 0.601562 6.99961C0.601562 3.46499 3.46694 0.599609 7.00156 0.599609C10.5362 0.599609 13.4016 3.46499 13.4016 6.99961ZM7.80156 10.1996C7.80156 10.6414 7.44339 10.9996 7.00156 10.9996C6.55974 10.9996 6.20156 10.6414 6.20156 10.1996C6.20156 9.75778 6.55974 9.39961 7.00156 9.39961C7.44339 9.39961 7.80156 9.75778 7.80156 10.1996ZM7.00156 2.99961C6.55974 2.99961 6.20156 3.35778 6.20156 3.79961V6.99961C6.20156 7.44144 6.55974 7.79961 7.00156 7.79961C7.44339 7.79961 7.80156 7.44144 7.80156 6.99961V3.79961C7.80156 3.35778 7.44339 2.99961 7.00156 2.99961Z"
                              fill="#EA1010"
                            />
                          </svg>
                        )}
                      </div>

                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red mb-2"
                      />
                    </div>
                    <div className="flex justify-between">
                      <label htmlFor="rememberMe" className="text-gray-700">
                        <Field
                          type="checkbox"
                          name="rememberMe"
                          checked={rememberMe}
                          onChange={handleRememberMeChange}
                          className="mr-2"
                        />
                        Remember me?
                      </label>
                      <button
                        type="button"
                        className="text-orange-500 hover:text-orange-400 active:text-orange-600 text-[16px] text-center font-bold "
                        onClick={() => router.push("/auth/forgot-password")}
                      >
                        Forget Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className={`text-white rounded-full p-[12px_24px] ${
                        buttonLoading
                          ? "cursor-not-allowed bg-gray-200"
                          : "hover:bg-orange-400 active:bg-orange-600 bg-orange-500"
                      }`}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <BeatLoader size={10} color="#ff7037" />
                      ) : (
                        "Login"
                      )}
                    </button>
                    <p className="flex gap-[8px] justify-center items-center text-[#060D18] text-body1">
                      Don’t have Pet Sitter account?
                      <button
                        type="button"
                        className="text-orange-500 hover:text-orange-400 active:text-orange-600 text-[16px]"
                        onClick={() => router.push("/register")}
                      >
                        Register
                      </button>
                    </p>
                  </Form>
                )}
              </Formik>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-orange-500 hover:text-orange-400 w-[120px] active:text-orange-600 text-[16px]"
                  onClick={() => router.push("/")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;
