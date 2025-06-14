import React from "react";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
// internal
import Link from "next/link";
import google_icon from "@assets/img/icon/login/google.svg";
import { useSignUpProviderMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import jwtDecode from "jwt-decode"; // added for decoding token
import axios from "axios";
import { API_URL } from "@/url_helper";

const GoogleSignUp = () => {
  const [signUpProvider, { }] = useSignUpProviderMutation();
  const router = useRouter();
  const { redirect } = router.query;

  // handleGoogleSignIn
  const handleGoogleSignIn = async (user) => {

    if (user) {
      signUpProvider(user?.credential).then(async (res) => {
        if (res?.data) {

          // 🔽 Decode Google token to get user details

          const payload = {
            name: res?.data.data.user.name,
            email: res?.data.data.user.email,
            isGoogle: true,
            user_type: 1,
          };
          console.log(payload);


          // 🔽 Call your API to register the user
          const response = await axios.post(
            `${API_URL}/register/user`,
            payload,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );

          console.log(response.data);

          sessionStorage.setItem("token", JSON.stringify(response.data.token));
          sessionStorage.setItem("customer", JSON.stringify(response.data.user));

          // notifySuccess(response.data.message || "Registered successfully");
          if (response.data.user.user_type == 2) {
            router.push(redirect || "/registration/2");

          } else if (response.data.user.user_type == 3) {

            router.push(redirect || "/registration/3")

          }
          notifySuccess("Login success!");
          router.push(redirect || "/");

        } else {
          notifyError(res.error?.message);
        }
      });
    }
  };

  return (
    <GoogleLogin
      render={(renderProps) => (
        <Link href={"#"}
          className="cursor-pointer"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <Image src={google_icon} alt="google_icon" />
          Sign In with google
        </Link>
      )}
      onSuccess={handleGoogleSignIn}
      onFailure={(err) =>
        notifyError(err?.message || "Something wrong on your auth setup!")
      }
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleSignUp;
