import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthUser from '@/auth/authuser';
import RenderCartProgress from '../common/render-cart-progress';
import Link from 'next/link';

const CartArea = () => {
  const dispatch = useDispatch();
  const { http, IMG_URL, user } = AuthUser();

  const [cart_products, setCartProducts] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);

  const getAllCartProducts = async () => {
    try {
      const res = await http.get(`/cart/list/${user.customer_id}`);
      setCartProducts(res.data.data || []);
      
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCartProducts();
  }, []);

  const handleQuantityChange = (product_id, delta) => {
    setCartProducts((prev) =>
      prev.map((item) =>
        item.product_id === product_id
          ? {
              ...item,
              cart_quantity: Math.max(1, item.cart_quantity + delta),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (product_id) => {
    setCartProducts((prev) => prev.filter((item) => item.product_id !== product_id));
  };

  const calculateSubtotal = () => {
    return cart_products.reduce((acc, item) => acc + item.price_sales * item.cart_quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + (typeof shippingCost === 'number' ? shippingCost : 0);

  return (
    <section className="tp-cart-area pb-120">
      <div className="container">
        {cart_products.length === 0 ? (
          <div className="text-center pt-50">
            <h3>No Cart Items Found</h3>
            <Link href="/shop" className="tp-cart-checkout-btn mt-20">Continue Shopping</Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="tp-cart-list mb-25 mr-30">
                <div className="cartmini__shipping">
                  {/* <RenderCartProgress /> */}
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="tp-cart-title">Product</th>
                      <th className="tp-cart-header-price">Name</th>
                      <th className="tp-cart-header-price">Price</th>
                      <th className="tp-cart-header-quantity">Quantity</th>
                      <th className="tp-cart-header-price">Action</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {cart_products.map((item) => (
                      <tr key={item.product_id}>
                        <td className="tp-cart-img">
                          <Link href={`/product-details/${item.product_id}`}>
                            <img src={`${IMG_URL}/products/${item.img}`} alt={"product"}width={70} height={100} />
                          </Link>
                        </td>
                        <td className="tp-cart-title">
                          <Link>{item.product_english_name}</Link>
                        </td>
                        <td className="tp-cart-price">
                          <span>${(item.price_sales * item.cart_quantity).toFixed(2)}</span>
                        </td>
                        <td className="tp-cart-quantity">
                          <div className="tp-product-quantity mt-10 mb-10">
                            <span onClick={() => handleQuantityChange(item.product_id, -1)} className="tp-cart-minus">-</span>
                            <input className="tp-cart-input" type="text" value={item.cart_quantity} readOnly />
                            <span onClick={() => handleQuantityChange(item.product_id, 1)} className="tp-cart-plus">+</span>
                          </div>
                        </td>
                        <td className="tp-cart-action">
                          <button onClick={() => handleRemoveItem(item.product_id)} className="tp-cart-action-btn">
                            × <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checkout Sidebar */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="tp-cart-checkout-wrapper">
                <div className="tp-cart-checkout-top d-flex align-items-center justify-content-between">
                  <span className="tp-cart-checkout-top-title">Subtotal</span>
                  <span className="tp-cart-checkout-top-price">${subtotal.toFixed(2)}</span>
                </div>
                <div className="tp-cart-checkout-shipping">
                  <h4 className="tp-cart-checkout-shipping-title">Shipping</h4>
                  <div className="tp-cart-checkout-shipping-option-wrapper">
                    <div className="tp-cart-checkout-shipping-option">
                      <input id="flat_rate" type="radio" name="shipping" onChange={() => setShippingCost(20)} />
                      <label htmlFor="flat_rate">Flat rate: <span>$20.00</span></label>
                    </div>
                    <div className="tp-cart-checkout-shipping-option">
                      <input id="local_pickup" type="radio" name="shipping" onChange={() => setShippingCost(25)} />
                      <label htmlFor="local_pickup">Local pickup: <span>$25.00</span></label>
                    </div>
                    <div className="tp-cart-checkout-shipping-option">
                      <input id="free_shipping" type="radio" name="shipping" onChange={() => setShippingCost(0)} />
                      <label htmlFor="free_shipping">Free shipping</label>
                    </div>
                  </div>
                </div>
                <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="tp-cart-checkout-proceed">
                  <Link href="/checkout" className="tp-cart-checkout-btn w-100">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartArea;
