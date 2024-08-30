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
        toast.success("Login successful!");
        router.push("/");
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
              <Form className="flex flex-col">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="email@company.com"
                  className={`mb-2 p-2 border rounded outline-none transition-colors duration-200
                    ${
                      errors.email && touched.email
                        ? "border-red"
                        : "border-gray-200"
                    }
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
                  className={`mb-2 p-2 border rounded outline-none transition-colors duration-200
                    ${
                      errors.email && touched.email
                        ? "border-red"
                        : "border-gray-200"
                    }
                     focus:border-orange-400`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red mb-2"
                />

                <button className="text-orange-500 text-[16px] text-center font-bold mb-2">
                  Forget Password?
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 text-white p-2 rounded"
                >
                  Login
                </button>
                <p className="mt-2">
                  Don’t have Pet Sitter account?
                  <button
                    className="text-orange-500"
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
