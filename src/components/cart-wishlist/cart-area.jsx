import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AuthUser from '@/auth/authuser';
import RenderCartProgress from '../common/render-cart-progress';
import Link from 'next/link';
import { IMG_URL } from '@/url_helper';
import noImage from '@assets/extra/img/no.jpg';
import { toast } from 'react-toastify';
import Image from 'next/image';

const CartArea = () => {
  const dispatch = useDispatch();
  const { http, user } = AuthUser();

  const [cart_products, setCartProducts] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const getAllCartProducts = async () => {
    try {
      const res = await http.get(`/cart/list/${user.user_id}`);
      setCartProducts(res.data.data || []); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCartProducts();
  }, []); 

  const handleQuantityChange = async (product_id, delta, cart_id,cart_quantity) => {
    setCartProducts((prev) =>
      prev.map((item) =>
        item.cart_id === cart_id
          ? {
            ...item,
            cart_quantity: Math.max(1, item.cart_quantity + delta),
          }
          : item
      )
    );
    console.log(cart_quantity,delta);
    
    http.post('/cart/count', {
      cart_id: cart_id,
      cart_quantity: delta === -1 ? cart_quantity - 1 : cart_quantity + 1,

    })
      .then(() => {
        toast.success('Cart updated successfully');
        // getAllCartProducts();
      })
      .catch((error) => {
        console.error('Error updating cart:', error);
        toast.error('Failed to update cart');
      });
  };

  const handleRemoveItem = async (cart_id) => {
    http.delete(`/cart/delete/${cart_id}`)
      .then(() => {
        toast.success('Item removed from cart successfully');
        setCartProducts((prev) => prev.filter((item) => item.cart_id !== cart_id));
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleEditClick = (cart_id, currentQuantity) => {
    setEditingId(cart_id);
    setEditValue(currentQuantity.toString());
  };

  const handleEditChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && (value === '' || parseInt(value) > 0)) {
      setEditValue(value);
    }
  };

  const handleEditBlur = async (cart_id, product_id) => {
    if (editValue === '') return;
    
    const newQuantity = parseInt(editValue);
    setCartProducts((prev) =>
      prev.map((item) =>
        item.cart_id === cart_id
          ? {
            ...item,
            cart_quantity: Math.max(1, newQuantity),
          }
          : item
      )
    );

    try {
      await http.post('/cart/count', {
        cart_id: cart_id,
        cart_quantity: newQuantity,
      });
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }

    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e, cart_id, product_id) => {
    if (e.key === 'Enter') {
      handleEditBlur(cart_id, product_id);
    }
  };

  const calculateSubtotal = () => {
    return cart_products.reduce((acc, item) => acc + item.price_sales * item.cart_quantity, 0);
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + (typeof shippingCost === 'number' ? shippingCost : 0);

  const handleShippingChange = (type, cost) => {
    setSelectedShipping(type);
    setShippingCost(cost);
  };

  return (
    <section className="tp-cart-area pb-120">
      <div className="container">
        {cart_products.length === 0 ? (
          <div className="text-center pt-50">
            <h3>Your Cart is Empty</h3>
            <Link href="/shop" className="tp-cart-checkout-btn mt-20">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="tp-cart-list mb-25 mr-30">
                <div className="cartmini__shipping">
                  {/* <RenderCartProgress /> */}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cart_products.map((item) => (
                        <tr key={item.product_id} className="hover:bg-gray-50 transition-colors">
                          {/* Product Image */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <Link href={`/product-details/${item.product_id}`} className="block">
                              <div className="flex-shrink-0 h-20 w-20">
                                <Image
                                  src={item.img && item.img != null ? `${IMG_URL}/products/${item.img}` : noImage}
                                  alt={item.product_english_name || 'Product image'}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded-md border border-gray-200"
                                />
                              </div>
                            </Link>
                          </td>

                          {/* Product Name */}
                          <td className="py-4 px-4">
                            <Link href={`/product-details/${item.product_id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                              {item.product_english_name}
                            </Link>
                            {item.product_marathi_name && (
                              <p className="text-xs text-gray-500 mt-1">{item.product_marathi_name}</p>
                            )}
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {formatINR(item.price_sales * item.cart_quantity)}
                            </span>
                            {item.cart_quantity > 1 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {formatINR(item.price_sales)} each
                              </p>
                            )}
                          </td>

                          {/* Quantity */}
                          <td className="tp-cart-quantity">
                            <div className="tp-product-quantity mt-10 mb-10">
                              <button
                                onClick={() => handleQuantityChange(item.product_id, -1, item.cart_id,item.cart_quantity)}
                                className="tp-cart-minus"
                                disabled={item.cart_quantity <= 1}
                              >
                                -
                              </button>
                              {editingId === item.cart_id ? (
                                <input
                                  className="tp-cart-input"
                                  type="text"
                                  value={editValue}
                                  onChange={handleEditChange}
                                  onBlur={() => handleEditBlur(item.cart_id, item.product_id)}
                                  onKeyPress={(e) => handleKeyPress(e, item.cart_id, item.product_id)}
                                  autoFocus
                                />
                              ) : (
                                <input
                                  className="tp-cart-input"
                                  type="text"
                                  value={item.cart_quantity}
                                  onClick={() => handleEditClick(item.cart_id, item.cart_quantity)}
                                  readOnly
                                />
                              )}
                              <button
                                onClick={() => handleQuantityChange(item.product_id, 1, item.cart_id,item.cart_quantity)}
                                className="tp-cart-plus"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <button
                              onClick={() => handleRemoveItem(item.cart_id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Checkout Sidebar */}
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="tp-cart-checkout-wrapper">
                <div className="tp-cart-checkout-total d-flex align-items-center justify-content-between">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>

                <div className="tp-cart-checkout-proceed">
                  <Link href="/checkoutpage" className="tp-cart-checkout-btn w-100">
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