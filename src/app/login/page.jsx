"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "@/components/layouts/MainLayout";
const LoginPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") {
        router.push("/admin");
      } else if (session.user.role === "owner") {
        router.push("/");
      }
      // else if (session.user.role === "sitter") {
      //   router.push("/sitter");
      // }
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const initialValues = {
    email: "",
    password: "",
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
    try {
      const result = await signIn("owner-admin-login", {
        redirect: false,
        email: values.email,
        password: values.password,
        rememberMe: rememberMe, // Pass rememberMe flag
        callbackUrl: "/admin", // Optionally add callback URL here
      });

      if (result.error) {
        toast.error("Email or Password is wrong");
      } else if (result.ok) {
        // Update cookie logic if needed
        document.cookie = `rememberMe=${rememberMe}; path=/`;
        router.push(result.url || "/admin");
      }
    } catch (error) {
      toast.error("Email or Password is wrong");
      // setFieldError("password", "Email or Password is wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="w-[239px] h-[350px] hidden md:block md:absolute md:top-[75px] md:right-0 bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
        <div className="w-[144px] h-[144px] absolute top-[-57px] right-[-10px] md:hidden bg-[url('/paw-yellow.png')] bg-contain bg-center bg-no-repeat"></div>
        <div className="w-[318px] h-[310px] hidden md:block md:absolute md:bottom-[-105px] md:left-[-80px] bg-[url('/star-green.png')] bg-contain bg-center bg-no-repeat rotate-[-15deg]"></div>
        <div className="w-[166px] h-[88px] hidden md:block md:absolute md:bottom-[210px] md:left-0 bg-[url('/ellipse-blue.png')] bg-contain bg-center bg-no-repeat"></div>
        <div className="w-[440px] flex flex-col justify-between gap-[56px]">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-head1">Welcome Back!</h1>
            <h3 className="text-head3 text-gray-400">
              Find your perfect Pet Sitter with us
            </h3>
          </div>
          <div className="flex flex-col justify-center w-full gap-[32px]">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="flex flex-col">
                  <label htmlFor="email" className="font-black text-body2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="email@company.com"
                    className={`mb-2 p-2 border w-full rounded outline-none transition-colors duration-200 
                     
                     focus:border-orange-400`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red mb-2"
                  />

                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className={`mb-2 p-2 border w-full rounded outline-none transition-colors duration-200 
                  
                     focus:border-orange-400`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red mb-2"
                  />

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        className="mr-2"
                      />
                      <label htmlFor="rememberMe" className="text-gray-700">
                        Remember me?
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-orange-500 text-sm"
                      onClick={() => router.push("/forgot-password")}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 text-white p-2 rounded"
                  >
                    Login
                  </button>
                  <p className="mt-2 ">
                    Don’t have an account?
                    <button
                      className="text-orange-500 ml-2"
                      onClick={() => router.push("/register")}
                    >
                      Register
                    </button>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
