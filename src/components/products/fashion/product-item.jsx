import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import noImage from '@assets/extra/img/no.jpg';

// internal
import { Cart, QuickView, Wishlist } from "@/svg";
import Timer from "@/components/common/timer";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import AuthUser from "@/auth/authuser";
import { useRouter } from "next/router";
import { IMG_URL } from "@/url_helper";

const ProductItem = ({ product, offer_style = false }) => {
  const router = useRouter(); // Use Next.js router for navigation
  // ✅ Destructure and map your custom keys  

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
    // Optional fallback if you later add reviews
    reviews = [],
  } = product || {};

  // Mapped to expected variable names in the component
  const _id = product_id;
  const img = product_image || "/default-product.png"; // fallback if null
  const category = { name: category_name };
  const title = product_english_name;
  const mrp = price_mrp;
  const price = price_sales;
  const discount = tax_percentage;
  const status = product_status === 1 ? "available" : "out-of-stock";
  const offerDate = { endDate: createdAt }; // or use actual expiry if available

  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
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

  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };
  const handleCardClick = () => {
    router.push({
      pathname: '/product-show',
      query: { id: _id }
    });
  };
  return (
    <div
       onClick={handleCardClick}  
        style={{ cursor: "pointer" }}
      className={`${offer_style ? "tp-product-offer-item" : "mb-25"} tp-product-item transition-3`}
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
            {status === "out-of-stock" && <span className="product-hot">out-stock</span>}
          </div>
        </div>

        <div className="tp-product-action">
          <div className="tp-product-action-item d-flex flex-column">
            {isAddedToCart ? (
              <Link
                href="/cart"
                className={`tp-product-action-btn ${isAddedToCart ? "active" : ""} tp-product-add-cart-btn`}
              >
                <Cart />
                <span className="tp-product-tooltip">View Cart</span>
              </Link>
            ) : (
              <button
                onClick={() => handleAddProduct(product)}
                type="button"
                className={`tp-product-action-btn ${isAddedToCart ? "active" : ""} tp-product-add-cart-btn`}
                disabled={status === "out-of-stock"}
              >
                <Cart />
                <span className="tp-product-tooltip">Add to Cart</span>
              </button>
            )}
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
              className={`tp-product-action-btn ${isAddedToWishlist ? "active" : ""} tp-product-add-to-wishlist-btn`}
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
        {/* <div className="tp-product-rating d-flex align-items-center">
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
              <span className="tp-product-price old-price"> Rs  {mrp}</span>
              <span className="tp-product-price new-price">
                {price}
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

