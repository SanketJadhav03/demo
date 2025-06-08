import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import AuthUser from "@/auth/authuser";
import Link from "next/link";
import axios from "axios";

// validation schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  mobile: Yup.string()
    .required()
    .matches(/^\+?[1-9]\d{1,14}$/, "Must be a valid international mobile number")
    .label("Mobile"),
  title: Yup.string().required("Please select a title").label("Title"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState(null);
  const router = useRouter();
  const { redirect } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setFormData(data);
    console.log("Form Data:", data); // ✅ Corrected log statement

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        user_type: data.title,
      };

      // Uncomment the following lines to enable API submission:
      const response = await axios.post("http://localhost:8888/api/register/user", payload);
  if (response.data.user.user_type == 2) {
  router.push("/registration?step=2");
} else if (response.data.user.user_type == 3) {
  router.push("/registration?step=3");
}

      notifySuccess(response.data.message || "Registered successfully");
      // router.push(redirect || "/login");
    } catch (error) {
      console.error("Registration error:", error);
      notifyError(error.response?.data?.message || "Register Failed");
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        {/* Name */}
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input {...register("name")} id="name" type="text" placeholder="Your Name" />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="name">Your Name</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>

        {/* Email */}
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input {...register("email")} id="email" type="email" placeholder="ajspire@gmail.com" />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">Your Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>

        {/* Mobile */}
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input {...register("mobile")} id="mobile" type="tel" placeholder="+1234567890" />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="mobile">Mobile Number</label>
          </div>
          <ErrorMsg msg={errors.mobile?.message} />
        </div>

        {/* Password */}
        <div className="tp-login-input-box">
          <div className="p-relative">
            <div className="tp-login-input">
              <input
                {...register("password")}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 character"
              />
            </div>
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message} />
        </div>

        {/* Title Select */}
<div className="tp-login-input-box w-full" style={{ width: '100%' }}>
  <div className="tp-login-input w-full" style={{ width: '100%' }}>
    <select
      {...register("title")}
      id="title"
      className="w-full block px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ width: '100%' }}
    >
      <option value="">Select Title</option>
      <option value="1">Customer</option>
      <option value="2">Vendor</option>
      <option value="3">Bank</option>
    </select>
  </div>
  <div className="tp-login-input-title">
    <label htmlFor="title">User Type</label>
  </div>
  <ErrorMsg msg={errors.title?.message} />
</div>


      </div>

      {/* Terms & Conditions */}
      <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
        <div className="tp-login-remeber">
          <input {...register("remember")} id="remember" type="checkbox" />
          <label htmlFor="remember">
            I accept the terms of the Service & <Link href="#">Privacy Policy</Link>.
          </label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>

      <div className="tp-login-bottom">
        <button type="submit" className="tp-login-btn w-100">
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
