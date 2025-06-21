import DOMPurify from 'dompurify'; 
import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Rating } from 'react-simple-star-rating';
import { CompareTwo, WishlistTwo, AskQuestion } from '@/svg';
import DetailsBottomInfo from './details-bottom-info';
import ProductQuantity from './product-quantity';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { add_to_compare } from '@/redux/features/compareSlice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import AuthUser from '@/auth/authuser';
import { notifyError, notifySuccess } from '@/utils/toast';
const DetailsWrapper = ({ productItem, detailsBottom = false }) => {
  const dispatch = useDispatch();
  const [textMore, setTextMore] = useState(false);

  const {
    product_english_name,
    product_description,
    product_image,
    price_mrp,
    price_sales,
    product_status,
    product_id,
    product_hsn_code,
    category_name,
    brand_name,
    unit_name
  } = productItem || {};

  const isOutOfStock = Number(product_status) === 0;

  const {user,http} = AuthUser();
  const handleAddProduct = async(prd) => {
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
    // dispatch(add_cart_product(prd));
  };

  const handleWishlistProduct = async(prd) => {
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

  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  const discount = (
    ((parseFloat(price_mrp) - parseFloat(price_sales)) / parseFloat(price_mrp)) * 100
  ).toFixed(0);

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category_name}</span>
      </div>

      <h3 className="tp-product-details-title">{product_english_name}</h3>

      {/* Inventory & rating */}
      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{isOutOfStock ? 'Out of Stock' : 'In Stock'}</span>
        </div>
        {/* No rating logic as no reviews provided */}
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


      {/* Price */}
      <div className="tp-product-details-price-wrapper mb-20">
        {parseFloat(price_mrp) > parseFloat(price_sales) ? (
          <>
            <span className="tp-product-details-price old-price">Rs. {parseFloat(price_mrp).toFixed(2)}</span>
            <span className="tp-product-details-price new-price"> Rs. {parseFloat(price_sales).toFixed(2)}</span>
            <span className="tp-product-details-discount"> ({discount}% OFF)</span>
          </>
        ) : (
          <span className="tp-product-details-price new-price">Rs. {parseFloat(price_sales).toFixed(2)}</span>
        )}
      </div>

      {/* Quantity and Add to cart */}
      <div className="tp-product-details-action-wrapper">
        <h3 className="tp-product-details-action-title">Quantity</h3>
        <div className="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
          <ProductQuantity />
          <div className="tp-product-details-add-to-cart mb-15 w-100">
            <button
              onClick={() => handleAddProduct(productItem)}
              disabled={isOutOfStock}
              className="tp-product-details-add-to-cart-btn w-100"
            >
              Add To Cart
            </button>
          </div>
        </div>
        <Link href="/cart" onClick={() => dispatch(handleModalClose())}>
          <button className="tp-product-details-buy-now-btn w-100">Buy Now</button>
        </Link>
      </div>

      {/* Wishlist / Compare / Ask */}
      <div className="tp-product-details-action-sm">
        <button
          disabled={isOutOfStock}
          onClick={() => handleCompareProduct(productItem)}
          type="button"
          className="tp-product-details-action-sm-btn"
        >
          <CompareTwo /> Compare
        </button>
        <button
          disabled={isOutOfStock}
          onClick={() => handleWishlistProduct(productItem)}
          type="button"
          className="tp-product-details-action-sm-btn"
        >
          <WishlistTwo /> Add Wishlist
        </button>
        <button type="button" className="tp-product-details-action-sm-btn">
          <AskQuestion /> Ask a question
        </button>
      </div>

      {/* Extra Info */}
      {detailsBottom && (
        <DetailsBottomInfo category={category_name} sku={product_hsn_code} tag={brand_name} />
      )}
    </div>
  );
};

export default DetailsWrapper;
