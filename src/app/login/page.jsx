"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { signIn, useSession ,getSession} from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginMainPage() {
  const router = useRouter();
  const { status } = useSession();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("กรุณากรอกอีเมลให้ถูกต้อง (email@company.com)")
      .required("กรุณากรอกอีเมลของคุณ"),
    password: Yup.string().required("กรุณากรอกรหัสผ่านของคุณ"),
  });

  // const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
  //   try {
  //     // Attempt to sign in with different roles
  //     const result = await signIn("admin-owner-login", {
  //       redirect: false,
  //       email: values.email,
  //       password: values.password,
  //     });

  //     if (result.error) {
  //       if (result.error === "CredentialsSignin") {
  //         toast.error("Invalid email or password");
  //       } else {
  //         toast.error(result.error);
  //         setFieldError("password", result.error);
  //       }
  //     } else {
  //       // Redirect based on the role of the user
  //       const { role } = result.user;
  //       if (role === "admin") {
  //         router.replace("/admin");
  //       } else if (role === "owner") {
  //         router.replace("/owner");
  //       } else {
  //         toast.error("Unknown role. Please contact support.");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error("An unexpected error occurred. Please try again.");
  //     setFieldError(
  //       "password",
  //       "An unexpected error occurred. Please try again."
  //     );
  //   }

  //   setSubmitting(false);
  // };

  // if (status === "loading") {
  //   return <div>กำลังโหลด...</div>;
  // }
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // ดำเนินการเข้าสู่ระบบ
      const result = await signIn("owner-login", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else {
          toast.error(result.error);
          setFieldError("password", result.error);
        }
      } else if (result.ok) {
        // หลังจากเข้าสู่ระบบสำเร็จ รับเซสชัน
        const session = await getSession();
        if (session) {
          const role = session.user.role; // ตรวจสอบบทบาทของผู้ใช้
          if (role === "admin") {
            router.push("/admin"); // นำทางไปที่หน้า /admin สำหรับผู้ใช้ที่มีบทบาทเป็น admin
          } else if (role === "owner") {
            router.push("/"); // นำทางไปที่หน้า / สำหรับผู้ใช้ที่มีบทบาทเป็น owner
          } else {
            console.log("บทบาทที่ไม่คาดคิด:", role);
            router.push("/login"); // นำทางไปที่หน้าเข้าสู่ระบบหากบทบาทไม่ตรง
          }
        }
      }
    } catch (error) {
      console.error("ข้อผิดพลาดในการเข้าสู่ระบบ:", error);
      toast.error("เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง");
      setFieldError("password", "เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
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
      <div className="w-[440px] p-6 bg-white rounded shadow-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold mb-2">ยินดีต้อนรับกลับ!</h1>
          <h3 className="text-lg text-gray-600">
            ค้นหาผู้ดูแลสัตว์เลี้ยงที่เหมาะสมกับคุณ
          </h3>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="font-semibold text-gray-700">
                  อีเมล
                </label>
                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    placeholder="email@company.com"
                    className={`mb-2 p-2 pr-10 w-full border rounded outline-none transition-colors duration-200
                      ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                      focus:border-orange-500`}
                  />
                  {errors.email && touched.email && (
                    <svg
                      width="14"
                      height="14"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
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
                  name="email"
                  component="div"
                  className="text-red-500 mb-2"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="font-semibold text-gray-700"
                >
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <Field
                    type="password"
                    name="password"
                    className={`mb-2 p-2 border w-full rounded outline-none transition-colors duration-200
                      ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                      focus:border-orange-500`}
                  />
                  {errors.password && touched.password && (
                    <svg
                      width="14"
                      height="14"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
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
                  className="text-red-500 mb-2"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 disabled:bg-gray-400"
              >
                เข้าสู่ระบบ
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default LoginMainPage;
