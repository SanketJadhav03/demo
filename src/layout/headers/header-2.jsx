import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
// internal
import Menus from './header-com/menus';
import logo from '@assets/img/header/img/logo.svg';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import HeaderTopRight from './header-com/header-top-right';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { CartTwo, Compare, Facebook, Menu, PhoneTwo, Wishlist, Search, User } from '@/svg';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import OffCanvas from '@/components/common/off-canvas';
import AuthUser from '@/auth/authuser';
import { IMG_URL } from '@/url_helper';
import socket from './header-com/socket';

const HeaderTwo = ({ style_2 = false, count = 1 }) => {
  const { user, http } = AuthUser();
  const [wishlist, setwishlist] = useState(0);
  const [quantity, setquantity] = useState(0);
  const getWishListCoutnByUser = async () => {
    try {
      await http.get(`/wishlist/count/${user.user_id}`).then((res) => {
        setwishlist(res.data.count);
      }).catch((e) => {
        console.log(e);
      })
    } catch (error) {
      console.log(error);
    }
  }
  const getCartCount = async () => {
    try {
      await http.get(`/cart/count/${user.user_id}`).then((res) => {
        setquantity(res.data.count)
      }).catch((e) => {
        console.log(e);

      })
    } catch (error) {
      console.log(error);
    }
  }
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { sticky } = useSticky();
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
    getCartCount();
    getWishListCoutnByUser();
  }, [count]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket:", socket.id);
    });

    socket.on("cart_store", (data) => {
      console.log("📡 Sync Response:", data);
      getCartCount();
      getWishListCoutnByUser();

    });

    return () => {
      socket.off("cart_store");
      socket.off("connect");
    };
  }, []);
  return (
    <>
      <header>
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`}>
          <div className="tp-header-top-2 p-relative z-index-11 tp-header-top-border d-none d-md-block">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-header-info d-flex align-items-center">
                    <div className="tp-header-info-item">
                      <Link href="#">
                        <span>
                          <Facebook />
                        </span> 7500k Followers
                      </Link>
                    </div>
                    <div className="tp-header-info-item">
                      <Link href="tel:402-763-282-46">
                        <span>
                          <PhoneTwo />
                        </span> +91 92264 39223
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-header-top-right tp-header-top-black d-flex align-items-center justify-content-end">
                    <HeaderTopRight />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="header-sticky" className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}>
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
                  <div className="col-xl-2 col-lg-5 col-md-5 col-sm-4 col-6">
                    <div className="logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" priority />
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-5 d-none d-xl-block">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content">
                        <Menus />
                      </nav>
                    </div>
                  </div>
                  <div className="col-xl-5 d-flex col-lg-7 col-md-7 col-sm-9 col-6">

                    {/* <div className="tp-header-search-2 d-none d-sm-block">
                      <form onSubmit={handleSubmit}>
                        <input
                          onChange={(e) => setSearchText(e.target.value)}
                          value={searchText}
                          type="text"
                          placeholder="Search for Products..." />
                        <button type="submit">
                          <Search />
                        </button>
                      </form>
                    </div> */}
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-between pl-30">
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
                              ) : customer?.customer_name ? (
                                <Link href="/profile">
                                  <h2 className="text-uppercase login_text">
                                    {customer.customer_name[0]}
                                  </h2>
                                </Link>
                              ) : (
                                <Link href={"/profile"}>
                                  <User />
                                </Link>
                              )}
                            </span>
                          </div>
                          <div className="tp-header-login-content d-none d-xl-block">
                            {!customer?.user_name && (
                              <Link href="/login">
                                <span>Hello,</span>
                              </Link>
                            )}
                            {customer?.user_name && <Link href={"/profile"}> <span>Hello, {customer.user_name}</span> </Link>}
                            <div className="tp-header-login-title">
                              {!customer?.user_name && <Link href="/login">Sign In</Link>}
                            </div>
                          </div>
                        </div>
                      </div>
                      {user ? (
                        <>
                          {/* <div className="tp-header-action-item d-none d-lg-block">
                            <Link href="/compare" className="tp-header-action-btn">
                              <Compare />
                            </Link>
                          </div> */}
                          <div className="tp-header-action-item d-none d-lg-block">
                            <Link href="/wishlist" className="tp-header-action-btn">
                              <Wishlist />
                              <span className="tp-header-action-badge">{wishlist}</span>
                            </Link>
                          </div>
                          <div className="tp-header-action-item">
                            <Link href={"/cart"} className="tp-header-action-btn cartmini-open-btn">
                              <CartTwo />
                              <span className="tp-header-action-badge">{quantity}</span>
                            </Link>
                          </div>
                        </>
                      ) : ""}

                      <div className="tp-header-action-item tp-header-hamburger mr-20 d-xl-none">
                        <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-offcanvas-open-btn">
                          <Menu />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* cart mini sidebar start */}
      <CartMiniSidebar />
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderTwo;