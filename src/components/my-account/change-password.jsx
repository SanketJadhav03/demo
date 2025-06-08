import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import AuthUser from "@/auth/authuser";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// ✅ Validation Schema
const schema = Yup.object().shape({
  newPassword: Yup.string().required("New password is required").min(6),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const ChangePassword = () => {
  const { user, http } = AuthUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const payload = {
        email: user?.user_email,
        newPassword: data.newPassword,
      };

console.log(payload);


      const response = await http.post("/user/password/change", payload);

      notifySuccess(response.data?.message || "Password changed successfully");
      reset();
    } catch (error) {
      console.error("Error changing password:", error);
      notifyError(
        error.response?.data?.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile__password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-xxl-6 col-md-6">
            <div className="tp-profile-input-box">
              <div className="tp-profile-input">
                <input
                  {...register("newPassword")}
                  name="newPassword"
                  id="newPassword"
                  type="password"
                  disabled={isSubmitting}
                  placeholder="Enter your new password"
                />
              </div>
              <div className="tp-profile-input-title">
                <label htmlFor="newPassword">New Password</label>
              </div>
              <ErrorMsg msg={errors.newPassword?.message} />
            </div>
          </div>

          <div className="col-xxl-6 col-md-6">
            <div className="tp-profile-input-box">
              <div className="tp-profile-input">
                <input
                  {...register("confirmPassword")}
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  disabled={isSubmitting}
                  placeholder="Confirm your new password"
                />
              </div>
              <div className="tp-profile-input-title">
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <ErrorMsg msg={errors.confirmPassword?.message} />
            </div>
          </div>

          <div className="col-xxl-6 col-md-6">
            <div className="profile__btn">
              <button
                type="submit"
                className="tp-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <style jsx>{`
        .tp-profile-input input:disabled {
          background-color: #f7fafc;
          cursor: not-allowed;
        }

        .tp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;
