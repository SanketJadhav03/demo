import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

// language
function Language({ active, handleActive }) {
  return (
    <div className="tp-header-top-menu-item tp-header-lang">
      <span
        onClick={() => handleActive('lang')}
        className="tp-header-lang-toggle"
        id="tp-header-lang-toggle"
      >
        English
      </span>
      <ul className={active === 'lang' ? "tp-lang-list-open" : ""}>
        <li>
          <Link href="#">Spanish</Link>
        </li>
        <li>
          <Link href="#">Russian</Link>
        </li>
        <li>
          <Link href="#">Portuguese</Link>
        </li>
      </ul>
    </div>
  );
}

// currency
function Currency({ active, handleActive }) {
  return (
    <div className="tp-header-top-menu-item tp-header-currency">
      <span
        onClick={() => handleActive('currency')}
        className="tp-header-currency-toggle"
        id="tp-header-currency-toggle"
      >
        USD
      </span>
      <ul className={active === 'currency' ? "tp-currency-list-open" : ""}>
        <li>
          <Link href="#">EUR</Link>
        </li>
        <li>
          <Link href="#">CHF</Link>
        </li>
        <li>
          <Link href="#">GBP</Link>
        </li>
        <li>
          <Link href="#">KWD</Link>
        </li>
      </ul>
    </div>
  );
}

// setting
function ProfileSetting({ active, handleActive }) {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
sessionStorage.clear();
  router.push('/login'); // full reload
  }
  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <span
        onClick={() => handleActive('setting')}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        Setting
      </span>
      <ul className={active === 'setting' ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile">My Profile</Link>
        </li>
        <li>
          <Link href="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
        <li> 
          {user?.user_name ? <Link href="/login" className="cursor-pointer">Login</Link> : <button type="button" onClick={handleLogout} className="cursor-pointer">Logout</button>}

        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState('');
  // handle active
  const handleActive = (type) => {
    if (type === active) {
      setIsActive('')
    }
    else {
      setIsActive(type)
    }
  }
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      {/* <Language active={active} handleActive={handleActive} />
      <Currency active={active} handleActive={handleActive} /> */}
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
