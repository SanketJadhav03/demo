import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import WishlistItem from './wishlist-item';
import AuthUser from '@/auth/authuser';
import { toast } from 'react-toastify';

const WishlistArea = () => {
  const { http, user } = AuthUser();
  const [wishlist, setWishlist] = useState([]);

  const GetAllWishLists = async () => {
    try {
      const res = await http.get(`/wishlist/list/${user.user_id}`);
      setWishlist(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleRemovePrd = async (wishlist_id) => {
    http.delete(`/wishlist/delete/${wishlist_id}`)
      .then(() => {
        toast.success('Item removed from wishlist successfully');
        GetAllWishLists();
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };
  useEffect(() => {
    GetAllWishLists();
  }, []);

  return (
    <section className="tp-cart-area pb-120">
      <div className="container">
        {wishlist.length === 0 ? (
          <div className="text-center pt-50">
            <h3>No Wishlist Items Found</h3>
            <Link href="/shop" className="tp-cart-checkout-btn mt-20">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-cart-list mb-45 mr-30">
                <table className="table">
                  <thead>
                    <tr>
                      <th colSpan="2" className="tp-cart-header-product">Product</th>
                      <th className="tp-cart-header-price">Name</th>
                      <th>Total Price</th>
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.flatMap((item, i) =>
                      <WishlistItem handleRemovePrd={handleRemovePrd} key={`${i}`} product={item} />
                    )}
                  </tbody>
                </table>
              </div>
              <div className="tp-cart-bottom">
                <div className="row align-items-end">
                  <div className="col-xl-6 col-md-4">
                    <div className="tp-cart-update">
                      <Link href="/cart" className="tp-cart-update-btn">Go To Cart</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishlistArea;
