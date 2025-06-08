import { API_URL1, IMG_URL1 } from "@/url_helper";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AuthUser() {

const API_URL = "https://demoapi.bizup.in/api";
const IMG_URL = "https://demoapi.bizup.in";


  // const getToken = () => {
  //   const tokenString = sessionStorage.getItem("token");
  //   const userToken = JSON.parse(tokenString);
  //   return userToken;
  // };

  const getUser = () => {
  if (typeof window !== "undefined") {
      const userString = sessionStorage.getItem("customer");
      const parsedUser = userString ? JSON.parse(userString) : null;
      return parsedUser
    }
  };

  // const [token, setToken] = useState(getToken());

  const [user, setUser] = useState(getUser());

  // const saveToken = (user, token) => {
  //   sessionStorage.setItem("token", JSON.stringify(token));
  //   sessionStorage.setItem("user", JSON.stringify(user));
 
  // };
  const http = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });

  const https = axios.create({
    baseURL: `${API_URL}`,
    headers: {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer ${token}`,
    },
  });

  const checkPermission = (permissionName) => {
    if (JSON.parse(sessionStorage.getItem("authUser")).user.email == "admin") {
      return true;
    }

    return true;
  };

  const logout = async () => {

    sessionStorage.clear();
    setToken(null);
    setUser(null);

    window.location.href = '/login';
  };
  // useEffect(() => {
  //   user &&
  //     http.get(`role/show/${user.user.user_role_id}`).then((res) => {
  //       setPermission(res.data.rolesAndPermissionsData)
  //     }).catch((e) => {
  //       console.log(e);
  //     })

  // }, [user && user])
  return {
    // setToken: saveToken,
    // token,
    // user,
    http,
    https,
    logout,
    IMG_URL,
    API_URL,
    user
    // checkPermission,
    // permission/
  };
}
