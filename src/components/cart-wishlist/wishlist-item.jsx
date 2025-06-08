import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import noImage from '@assets/extra/img/no.jpg';
// internal
import { Cart, CartTwo, Close, CloseEye, CloseTwo, Delivery, Minus, Plus } from "@/svg";
import { remove_wishlist_product } from "@/redux/features/wishlist-slice";
import AuthUser from "@/auth/authuser";

const WishlistItem = ({ product }) => {
  const { _id, img, title, price_sales, wishlist_quantity } = product || {};
  const { IMG_URL } = AuthUser();
  console.log(product);
  const [quantity, setQuantity] = useState(0);

  // ✅ Increment quantity
  const handleAddProduct = () => {
    setQuantity(prev => prev + 1);
  };

  // ✅ Decrement quantity
  const handleDecrement = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  // ✅ Remove from wishlist
  const handleRemovePrd = () => {
    // only removing from wishlist
    dispatch(remove_wishlist_product({ title, id: _id }));
  };

  return (
    <tr>
      <td className="tp-cart-img">
        <Link href={`/product-details/${_id}`}>
          <Image
            src={img && img !== 'undefined' ? `${IMG_URL}/products/${img}` : noImage}
            alt="product img"
            width={150}
            height={100}
          />
        </Link>
      </td>
      <td className="tp-cart-title">
        <Link href={`/product-details/${_id}`}>{title}</Link>
      </td>
      <td className="tp-cart-price_sales">
        <span>{product.product_english_name} / {product.product_marathi_name} </span>
      </td>
            <td className="tp-cart-price_sales">
        <span>{wishlist_quantity} </span>
      </td>

       <td className="tp-cart-price_sales">
        <span>{wishlist_quantity } </span>
      </td>
      
      <td className="tp-cart-price_sales ">
        <button
          onClick={handleAddProduct}
          type="button"
          className="btn  btn-2 btn-primary"
        >
          <Cart /> 
        </button> 
        <button
          onClick={handleRemovePrd}
          className="ms-2 btn  btn-2 btn-danger   "
        >
          <Close />
        </button>
      </td>
    </tr>
  );
};

export default WishlistItem;
