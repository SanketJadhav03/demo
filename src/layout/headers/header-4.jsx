import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { CartTwo, Menu, Search, Wishlist } from '@/svg';
import Menus from './header-com/menus';
import logo_white from '@assets/img/logo/logo-white.svg';
import logo_dark from '@assets/img/logo/logo.svg';
import useSticky from '@/hooks/use-sticky';
import SearchBar from './header-com/search-bar';
import OffCanvas from '@/components/common/off-canvas';
import useCartInfo from '@/hooks/use-cart-info';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { openCartMini } from '@/redux/features/cartSlice';
import AuthUser from '@/auth/authuser';
import socket from './header-com/socket';

const HeaderFour = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  // const { wishlist } = useSelector((state) => state.wishlist);
  // const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
const {http,user} = AuthUser();

  const [wishlist,setwishlist] = useState(0);
  const [quantity,setquantity] = useState(0);

    const getWishListCoutnByUser = async()=>{
    try {
      await http.get(`/wishlist/count/${user.user_id}`).then((res)=>{

        // console.log(res.data.count);
        
setwishlist(res.data.count);

      }).catch((e)=>{
        console.log(e);
        
      })
    } catch (error) {
      console.log(error );
      
    }
  }
  const getCartCountByUser = async() =>{
try {

  await http.get(`/cart/count/${user.user_id}`).then((res)=>{
// console.log(res.data.count);

// setwishlist(res.data.count);
setquantity(res.data.count);

  }).catch((e)=>{
console.log(e);

  })
  


} catch (error) {
  console.log(error);
  
}
  }

  useEffect(()=>{
getCartCountByUser();
getWishListCoutnByUser();
  },[])


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
    <>
      <header>
        <div id="header-sticky" className={`tp-header-area tp-header-style-transparent-white tp-header-sticky tp-header-transparent has-dark-logo tp-header-height ${sticky ? 'header-sticky' : ''}`}>
          <div className="tp-header-bottom-3 pl-85 pr-85">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="logo">
                    <Link href="/">
                      <Image className="logo-light" src={logo_white} alt="logo" />
                      <Image className="logo-dark" src={logo_dark} alt="logo" />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-8 col-lg-8 d-none d-lg-block">
                  <div className="main-menu menu-style-3 menu-style-4 p-relative">
                    <nav className="tp-main-menu-content">
                      <Menus />
                    </nav>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-6">
                  <div className="tp-header-action d-flex align-items-center justify-content-end ml-50">

                    <div className="tp-header-action-item d-none d-sm-block">
                      <button onClick={() => setIsSearchOpen(true)} type="button" className="tp-header-action-btn tp-search-open-btn">
                        <Search />
                      </button>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block">
                      <Link href="/wishlist" className="tp-header-action-btn">
                        <Wishlist />
                        <span className="tp-header-action-badge">{wishlist.length}</span>
                      </Link>
                    </div>
                    <div className="tp-header-action-item d-none d-sm-block">
                      <button onClick={() => dispatch(openCartMini())} type="button" className="tp-header-action-btn cartmini-open-btn">
                        <CartTwo />
                        <span className="tp-header-action-badge">{quantity}</span>
                      </button>
                    </div>
                    <div className="tp-header-action-item d-lg-none">
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
      </header>

      {/* search bar start */}
      <SearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      {/* search bar end */}

      {/* cart mini sidebar start */}
      <CartMiniSidebar />
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="jewelry" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderFour;