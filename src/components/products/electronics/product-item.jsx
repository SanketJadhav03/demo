import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Rating } from "react-simple-star-rating";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import noImage from '@assets/extra/img/no.jpg';

// internal
import { Cart, QuickView, Wishlist } from "@/svg";
import Timer from "@/components/common/timer";
import { handleProductModal } from "@/redux/features/productModalSlice";
import AuthUser from "@/auth/authuser";
import { notifyError, notifySuccess } from "@/utils/toast";
import Link from "next/link";
import { IMG_URL } from "@/url_helper";

const ProductItem = ({ product, offer_style = false }) => {
  const router = useRouter();  // <-- Add router here

  // ✅ Destructure and map your custom keys
  const { http, user } = AuthUser();

  const {
    product_id,
    product_image,
    category_name,
    product_english_name,
    product_unit_price,
    price_sales,
    tax_percentage,
    product_status,
    price_mrp,
    createdAt,
    reviews = [],
  } = product || {};

  // Mapped variables
  const _id = product_id;
  const img = product_image || "/default-product.png";
  const category = { name: category_name };
  const title = product_english_name;
  const mrp = price_mrp;
  const price = price_sales;
  const discount = price_mrp - price_sales;
  const status = product_status === 1 ? "available" : "out-of-stock";
  const offerDate = { endDate: createdAt };

  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  
  const dispatch = useDispatch();

  const [ratingVal, setRatingVal] = useState(0);
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

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

  const handleWishlistProduct = async (prd) => {
    if (user) {
      await http.post("/wishlist/store", { wishlist_name: "", wishlist_quantity: 1, wishlist_product_id: prd.product_id, user_id: user.user_id })
        .then((res) => {
          notifySuccess(res.data.message);
        }).catch((res) => {
          notifyError(res);
        });
    } else {
      notifyError("Please login to add product to wishlist");
    }
  };

  // New function to handle card click and navigate to product-show page
  const handleCardClick = () => {
    router.push({
      pathname: '/product-show',
      query: { id: _id }
    });
  };




  return (
    <div
      onClick={handleCardClick}  // <-- Add click here
      className={`${offer_style ? "tp-product-offer-item" : "mb-25"} tp-product-item transition-3`}
      style={{ cursor: "pointer" }}  // <-- Show pointer cursor on hover
    >
      <div className="tp-product-thumb p-relative fix">
        <div>
          <Image
            src={product_image && product_image !== 'undefined'
              ? `${IMG_URL}/products/${product_image}`
              : noImage}
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="product"
          />

          <div className="tp-product-badge">
            {discount > 0 && <span className="bg-primary">{discount} OFF</span>}
          </div>
        </div>

        <div className="tp-product-action" onClick={(e) => e.stopPropagation()}>
          {/* Prevent clicks inside buttons from triggering card click */}
          <div className="tp-product-action-item d-flex flex-column">
            
              <button
                onClick={() => handleAddProduct(product)}
                type="button"
                className={`tp-product-action-btn tp-product-add-cart-btn`}
                disabled={status === "out-of-stock"}
              >
                <Cart />
                <span className="tp-product-tooltip">Add to Cart</span>
              </button> 
            <button
              onClick={() => dispatch(handleProductModal(product))}
              type="button"
              className="tp-product-action-btn tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip">Quick View</span>
            </button>
            <button
              type="button"
              className={`tp-product-action-btn tp-product-add-to-wishlist-btn`}
              onClick={() => handleWishlistProduct(product)}
              disabled={status === "out-of-stock"}
            >
              <Wishlist />
              <span className="tp-product-tooltip">Add To Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      <div className="tp-product-content">
        <div className="tp-product-category">
          <Link href="#">{category?.name}</Link>
        </div>
        <h3 className="tp-product-title">
          <div>{title}</div>
        </h3>
        {/* Uncomment if you want ratings
        <div className="tp-product-rating d-flex align-items-center">
          <div className="tp-product-rating-icon">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-rating-text">
            <span>({reviews.length} Review)</span>
          </div>
        </div> */}
        <div className="tp-product-price-wrapper">
          {discount > 0 ? (
            <>
              <span className="tp-product-price old-price"> Rs {mrp}</span>
              <span className="tp-product-price new-price">
               {" "}Rs {price}
              </span>
            </>
          ) : (
            <span className="tp-product-price new-price"> Rs {price}</span>
          )}
        </div>
        {offer_style && (
          <div className="tp-product-countdown">
            <div className="tp-product-countdown-inner">
              {dayjs().isAfter(offerDate?.endDate) ? (
                <ul>
                  <li><span>0</span> Day</li>
                  <li><span>0</span> Hrs</li>
                  <li><span>0</span> Min</li>
                  <li><span>0</span> Sec</li>
                </ul>
              ) : (
                <Timer expiryTimestamp={new Date(offerDate?.endDate)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
