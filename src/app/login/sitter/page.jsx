"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginSitterPage() {
  const router = useRouter();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a format email (email@company.com)")
      .required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const result = await signIn("sitter-login", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Invalid email or password");
        } else {
          toast.error(result.error);
          setFieldError("password", result.error);
        }
      } else {
        router.replace("/sitter");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setFieldError(
        "password",
        "An unexpected error occurred. Please try again."
      );
    }

    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-[440px] flex flex-col justify-between gap-[56px]">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-head1">Welcome Back!</h1>
          <h3 className="text-head3 text-gray-400">
            Become the best Pet Sitter with us
          </h3>
        </div>
        <div className="flex flex-col justify-center w-full">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col gap-[32px]">
                <div>
                  <label htmlFor="email" className="text-black text-body2 ">
                    Email
                  </label>
                  <div className="relative">
                    <Field
                      type="email"
                      name="email"
                      placeholder="email@company.com"
                      className={`mb-2 p-2 pr-10 w-full border rounded outline-none transition-colors duration-200
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
                  <label htmlFor="password" className="text-black text-body2">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type="password"
                      name="password"
                      className={`mb-2 p-2 border w-full rounded outline-none transition-colors duration-200
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

                <button className="text-orange-500 hover:text-orange-400 active:text-orange-600 text-[16px] text-center font-bold ">
                  Forget Password?
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white rounded-[99px] p-[12px_24px]"
                >
                  Login
                </button>
                <p className="flex gap-[8px] justify-center items-center text-[#060D18] text-body1">
                  Don’t have Pet Sitter account?
                  <button
                    className="text-orange-500 hover:text-orange-400 active:text-orange-600 text-[16px]"
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
  );
}

export default LoginSitterPage;
