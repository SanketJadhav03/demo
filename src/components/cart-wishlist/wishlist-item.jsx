import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import noImage from '@assets/extra/img/no.jpg';
// internal
import { Cart, CartTwo, Close, CloseEye, CloseTwo, Delivery, Minus, Plus } from "@/svg";
import { remove_wishlist_product } from "@/redux/features/wishlist-slice";
import AuthUser from "@/auth/authuser";
import { IMG_URL } from "@/url_helper";
import { useDispatch } from "react-redux";
import { notifyError, notifySuccess } from "@/utils/toast";
const WishlistItem = ({ product,handleRemovePrd }) => {
  const dispatch = useDispatch();
  const { _id, img, title, price_sales, wishlist_quantity, product_english_name, product_marathi_name } = product || {};

  const { http, user } = AuthUser();
  // ✅ Increment quantity
  const handleAddProduct = async (prd) => {
    if (user) {
      await http.post("/cart/store", { cart_name: "", cart_quantity: 1, cart_product_id: prd.product_id, user_id: user.user_id })
        .then((res) => {
          notifySuccess(res.data.message);
        }).catch((res) => {
          notifyError(res);
        });
    } else {
      notifyError("Please Login to add Cart");
    }
  };

  
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3">
        <Link href={`/product-details/${product.product_id}`} className="flex items-center">
          <Image
            src={product.img && product.img !== 'undefined' ? `${IMG_URL}/products/${product.img}` : noImage}
            alt="product img"
            width={80}
            height={80}
            className="object-cover rounded"
          />
        </Link>
      </td>
      <td className="px-4 py-3">
        <Link href={`/product-details/${product.product_id}`} className="font-medium text-gray-800 hover:text-primary">
          {title}
        </Link>
      </td>
      <td className="px-4 py-3">
        <span className="text-gray-600">{product_english_name} / {product_marathi_name}</span>
      </td>

      <td className="px-4 py-3 font-medium text-gray-900">
        ₹{product.price_sales}
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              handleAddProduct(product);
            }}
            className="px-3 py-2 text-white bg-primary rounded hover:bg-primary-dark transition-colors"
            title="Add to cart"
          >
            <Cart className="w-5 h-5" />
          </button>
          <button
            onClick={()=>handleRemovePrd(product.wishlist_id)}
            className="ms-2 px-3 py-2 text-white  bg-danger rounded hover:bg-dark transition-colors"
            title="Remove"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WishlistItem;