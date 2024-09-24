import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LuUser2 } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { ImNotification } from "react-icons/im";

export default function BasicInformationForm() {
  const [preview, setPreview] = useState(null);

  const validationSchema = Yup.object().shape({
    profileImage: Yup.mixed()
      .required("A file is required")
      .test(
        "fileSize",
        "File too large",
        (value) => value && value.size <= 1024 * 1024
      )
      .test(
        "fileFormat",
        "Unsupported Format",
        (value) =>
          value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
      ),
    fullName: Yup.string().required("Full name is required"),
    experience: Yup.string().required("Experience is required"),
    phone: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    introduction: Yup.string().required("Introduction is required"),
  });

  const handlePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-[40px_80px] flex flex-col gap-[24px] rounded-[16px]">
      <div className="text-head4 text-gray-300">Basic Information</div>
      <Formik
        initialValues={{
          profileImage: null,
          fullName: "",
          experience: "",
          phone: "",
          email: "",
          introduction: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-[24px]">
            <div className="relative w-[240px] h-[240px]">
              <label htmlFor="image" className="text-black text-body2 ">
                Profile Image
              </label>
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-full h-full rounded-full object-cover mt-[16px]"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center mt-[16px]">
                  <LuUser2 className="w-[104px] h-[104px] text-white" />
                </div>
              )}
              <label
                htmlFor="profileImage"
                className="absolute top-[220px] right-0 bg-orange-100 rounded-full p-2 cursor-pointer w-[60px] h-[60px] flex items-center justify-center"
              >
                <GoPlus className="text-orange-500 w-[24px] h-[24px]" />
              </label>
            </div>
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                setFieldValue("profileImage", event.currentTarget.files[0]);
                handlePreview(event);
              }}
            />
            {errors.profileImage && touched.profileImage && (
              <div className="text-red text-sm pt-[50px] ">
                {errors.profileImage}
              </div>
            )}
            <div className="flex  gap-[40px] mt-[40px] w-full">
              <div className="w-full">
                <label htmlFor="fullname" className="text-black text-body2 ">
                  Your full name*
                </label>
                <Field
                  name="fullName"
                  type="text"
                  className={`w-full p-[12px_16px_12px_12px] bg-white border rounded-lg outline-none transition-colors duration-200  ${
                    errors.fullName && touched.fullName
                      ? "border-red"
                      : "border-gray-200"
                  } focus:border-orange-400`}
                />
                {errors.fullName && touched.fullName && (
                  <div className="text-red text-sm">{errors.fullName}</div>
                )}
              </div>

              <div className="w-full">
                <label htmlFor="experience" className="text-black text-body2 ">
                  Experience*
                </label>
                <Field
                  name="experience"
                  as="select"
                  className={`w-full p-[12px_16px_12px_12px] bg-white border rounded-lg outline-none transition-colors duration-200  ${
                    errors.fullName && touched.fullName
                      ? "border-red"
                      : "border-gray-200"
                  } focus:border-orange-400`}
                >
                  <option value="">Select experience</option>
                  <option value="beginner">0-2 Years</option>
                  <option value="intermediate">3-5 Years</option>
                  <option value="expert">5+ Years</option>
                </Field>
                {errors.experience && touched.experience && (
                  <div className="text-red text-sm">{errors.experience}</div>
                )}
              </div>
            </div>
            <div className="flex gap-[40px]">
              <div className="w-full">
                <label htmlFor="email" className="text-black text-body2 ">
                  Phone*
                </label>
                <Field
                  name="phone"
                  type="tel"
                  className={`w-full p-[12px_16px_12px_12px] bg-white border rounded-lg outline-none transition-colors duration-200  ${
                    errors.fullName && touched.fullName
                      ? "border-red"
                      : "border-gray-200"
                  } focus:border-orange-400`}
                />
                {errors.phone && touched.phone && (
                  <div className="text-red text-sm">{errors.phone}</div>
                )}
              </div>
              <div className="w-full relative">
                <label htmlFor="email" className="text-black text-body2 ">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className={`w-full p-[12px_16px_12px_12px] bg-white border rounded-lg outline-none transition-colors duration-200  ${
                    errors.email && touched.email
                      ? "border-red"
                      : "border-gray-200"
                  } focus:border-orange-400`}
                />
                {errors.email && touched.email && (
                  <ImNotification className="absolute right-3 top-[45px]  text-red" />
                )}
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red mb-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="introduction" className="text-black text-body2 ">
                Introduction (Describe about yourself as pet sitter)
              </label>
              <Field
                name="introduction"
                as="textarea"
                className="w-full h-[140px] p-[12px_16px_12px_12px] bg-white border rounded-lg outline-none transition-colors duration-200 border-gray-200 focus:border-orange-400"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
