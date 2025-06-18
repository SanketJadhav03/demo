import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import { CartTwo, Compare, Menu, User, Wishlist } from "@/svg";
import { openCartMini } from "@/redux/features/cartSlice";
import AuthUser from "@/auth/authuser";
import { IMG_URL } from "@/url_helper";

import socket from '../header-com/socket'

const HeaderMainRight = ({ setIsCanvasOpen }) => {




  const { http, user } = AuthUser();
  const [wishlist, setwishlist] = useState(0);
  const [quantity, setquantity] = useState(0);

  const getWishListCoutnByUser = async () => {
    try {
      await http.get(`/wishlist/count/${user.user_id}`).then((res) => {

        // console.log(res.data.count);

        setwishlist(res.data.count);

      }).catch((e) => {
        console.log(e);

      })
    } catch (error) {
      console.log(error);

    }
  }
  const getCartCountByUser = async () => {
    try {

      await http.get(`/cart/count/${user.user_id}`).then((res) => {
        // console.log(res.data.count);

        // setwishlist(res.data.count);
        setquantity(res.data.count);

      }).catch((e) => {
        console.log(e);

      })



    } catch (error) {
      console.log(error);

    }
  }

  // const { wishlist } = useSelector((state) => state.wishlist);
  // const { quantity } = useCartInfo();
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const customerString = sessionStorage.getItem("customer");
      if (customerString) {
        try {
          const customerObj = JSON.parse(customerString);
          setCustomer(customerObj);
        } catch (err) {
          console.error("Invalid customer JSON in sessionStorage");
        }
      }
    }
  }, []);

  useEffect(() => {
    getCartCountByUser();
    getWishListCoutnByUser();

  }, [])



  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket:", socket.id);
    });

    socket.on("cart_store", (data) => {
      console.log("📡 Sync Response:", data);
      getCartCountByUser();
    getWishListCoutnByUser();

    });

    return () => {
      socket.off("cart_store");
      socket.off("connect");
    };
  }, []);

  return (
    <div className="tp-header-main-right d-flex align-items-center justify-content-end">
      <div className="tp-header-login d-none d-lg-block">
        <div className="d-flex align-items-center">
          <div className="tp-header-login-icon">
            <span>
              {customer?.user_profile_url ? (
                <Link href="/profile">
                  <img
                    src={customer.user_profile_url}
                    alt="user img"
                    width={35}
                    height={35}
                  />
                </Link>
              ) : customer?.user_name ? (
                <Link href="/profile">
                  <h2 className="text-uppercase login_text">
                    {customer.user_name[0]}
                  </h2>
                </Link>
              ) : (
                <User />
              )}
            </span>
          </div>
          <div className="tp-header-login-content d-none d-xl-block">
            {!customer?.user_name && (
              <Link href="/login">
                <span>Hello,</span>
              </Link>
            )}
            {customer?.user_name && <Link href={"/profile"}>Hello, {customer.user_name}</Link>}
            {!customer?.user_name &&
              <div className="tp-header-login-title">
                <Link href="/login">Sign In</Link>
              </div>
            }

          </div>
        </div>
      </div>

      <div className="tp-header-action d-flex align-items-center ml-50">

        {user ? <><div className="tp-header-action-item d-none d-lg-block">
          {/* <Link href="/compare" className="tp-header-action-btn"> 
            <Compare />
          </Link> */}
        </div>
          <div className="tp-header-action-item d-none d-lg-block">
            <Link href="/wishlist" className="tp-header-action-btn">
              <Wishlist />
              <span className="tp-header-action-badge">{wishlist}</span>
            </Link>
          </div>
          <div className="tp-header-action-item">
            <Link href={"/cart"}
              className="tp-header-action-btn cartmini-open-btn"
            >
              <CartTwo />
              <span className="tp-header-action-badge">{quantity}</span>
            </Link>
          </div></> : ""}
        <div className="tp-header-action-item d-lg-none">
          <button
            onClick={() => setIsCanvasOpen(true)}
            type="button"
            className="tp-header-action-btn tp-offcanvas-open-btn"
          >
            <Menu />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderMainRight;