import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import dayjs from "dayjs";
import noImage from '@assets/extra/img/no.jpg';
import AuthUser from "@/auth/authuser";
import DOMPurify from "dompurify";
// internal
import { Cart, CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";

const ShopListItem = ({ product }) => {
  const { IMG_URL } = AuthUser();
  const dispatch = useDispatch();
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [textMore, setTextMore] = useState(false);
  // Destructure product with fallbacks
  const {
    product_id,
    product_image,
    category_name,
    product_english_name,
    product_marathi_name,
    price_sales,
    price_mrp,
    product_status,
    createdAt,
    product_description,
    brand_name,
    unit_name,
    // Optional fallback for reviews
    reviews = [],
  } = product || {};

  // Mapped to expected variable names
  const _id = product_id;
  const img = product_image ? `${IMG_URL}/products/${product_image}` : noImage;
  const title = product_english_name;
  const price = price_sales;
  const discount = price_mrp > 0
    ? Math.round(((parseFloat(price_mrp) - parseFloat(price_sales)) / parseFloat(price_mrp) * 100)) : 0;
  const status = product_status === 1 ? "in-stock" : "out-of-stock";
  const isAddedToCart = cart_products.some((prd) => prd.product_id === product_id);
  const isAddedToWishlist = wishlist.some((prd) => prd.product_id === product_id);

  const [ratingVal, setRatingVal] = useState(0);
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  // Format price with commas
  const formatPrice = (price) => {
    return parseFloat(price || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  const handleAddProduct = () => {
    dispatch(add_cart_product({
      ...product,
      _id: product_id, // Adding _id for compatibility
      quantity: 1
    }));
  };

  const handleWishlistProduct = () => {
    dispatch(add_to_wishlist({
      ...product,
      _id: product_id // Adding _id for compatibility
    }));
  };

  const handleCompareProduct = () => {
    dispatch(add_to_compare({
      ...product,
      _id: product_id // Adding _id for compatibility
    }));
  };

  return (
    <div className="tp-product-list-item d-md-flex">
      <div className="tp-product-list-thumb p-relative fix">

        <Link href={`/product-details/${_id}`}>
          <Image
            src={img}
            alt={product_english_name || 'Product image'}
            width={350}
            height={310}
            onError={(e) => {
              e.target.src = noImage;
            }}
          />
        </Link>

        {/* Product badge */}
        <div className="tp-product-badge">
          {status === "out-of-stock" && (
            <span className="product-hot">Out of Stock</span>
          )}
          {discount > 0 && (
            <span className="product-discount">-{discount}%</span>
          )}
        </div>

        {/* Product actions */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
              onClick={() => dispatch(handleProductModal(product))}
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
            <button
              type="button"
              onClick={handleWishlistProduct}
              className={`tp-product-action-btn-2 tp-product-add-to-wishlist-btn ${isAddedToWishlist ? "active" : ""
                }`}
              disabled={status === "out-of-stock"}
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                {isAddedToWishlist ? "In Wishlist" : "Add To Wishlist"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleCompareProduct}
              className="tp-product-action-btn-2 tp-product-add-to-compare-btn"
            >
              <CompareThree />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-list-content">
        <div className="tp-product-content-2 pt-15">
          <div className="tp-product-tag-2">
            <Link href="#">{brand_name || 'Brand'}</Link>
            <Link href="#">{category_name || 'Category'}</Link>
          </div>
          <h3 className="tp-product-title-2">
            <Link href={`/product-details/${_id}`}>
              {title || 'Product Name'}
            </Link>
          </h3>
          <div className="tp-product-rating-icon tp-product-rating-icon-2">
            <Rating
              allowFraction
              size={16}
              initialValue={ratingVal}
              readonly={true}
            />
            {reviews.length > 0 && (
              <span className="tp-product-rating-text">
                ({reviews.length} Review{reviews.length !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          <div className="tp-product-price-wrapper-2">
            {discount > 0 ? (
              <>
                <span className="tp-product-price-2 new-price">₹{formatPrice(price)}</span>
                <span className="tp-product-price-2 old-price">
                  ₹{formatPrice(price_mrp)}
                </span>
              </>
            ) : (
              <span className="tp-product-price-2 new-price">₹{formatPrice(price)}</span>
            )}
          </div>
          <p>
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  textMore || !product_description
                    ? product_description || 'No description available.'
                    : `${product_description?.slice(0, 100)}...`
                ),
              }}
            />
            {product_description && product_description.length > 100 && (
              <span
                onClick={() => setTextMore(!textMore)}
                style={{ cursor: 'pointer', color: '#007bff', marginLeft: 5 }}
              >
                {textMore ? 'See less' : 'See more'}
              </span>
            )}
          </p>
          <div className="tp-product-list-add-to-cart">
            {isAddedToCart ? (
              <Link
                href="/cart"
                className="tp-product-list-add-to-cart-btn active"
              >
                View Cart
              </Link>
            ) : (
              <button
                onClick={handleAddProduct}
                className={`tp-product-list-add-to-cart-btn ${status === "out-of-stock" ? "disabled" : ""
                  }`}
                disabled={status === "out-of-stock"}
              >
                {status === "out-of-stock" ? "Out of Stock" : "Add To Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListItem;