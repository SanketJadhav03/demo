import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { Minus, Plus } from '@/svg';
import { decrement, increment } from '@/redux/features/cartSlice';

const ProductQuantity = (props) => {
  const { orderQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // handleIncrease
  const handleIncrease = () => {
    dispatch(increment());
    props.setCartQty(orderQuantity+1);
  };
  // handleDecrease
  const handleDecrease = () => {
    dispatch(decrement());
    props.setCartQty(orderQuantity+1);
  };
  return (
    <div className="tp-product-details-quantity">
    <div className="tp-product-quantity mb-15 mr-15">
      <span className="tp-cart-minus" onClick={handleDecrease}>
        <Minus />
      </span>
      <input className="tp-cart-input" type="text" readOnly value={orderQuantity} />
      <span className="tp-cart-plus" onClick={handleIncrease}>
        <Plus />
      </span>
    </div>
  </div>
  );
};

export default ProductQuantity;