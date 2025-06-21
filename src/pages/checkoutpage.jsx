/*
Enhanced checkout page with blue/white theme, improved UI/UX, and order placement functionality
Now with proper default address handling from API
*/

import React, { useEffect, useState } from 'react';
import noImage from '@assets/extra/img/no.jpg';
import AuthUser from '@/auth/authuser';
import { notifySuccess, notifyError } from '@/utils/toast';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiTrash2, FiMapPin, FiPlus, FiCheck, FiEdit2, FiLoader, FiChevronRight } from 'react-icons/fi';
import Wrapper from '@/layout/wrapper';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import { IMG_URL } from '@/url_helper';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';
import ShippingAddressModal from '@/components/my-account/ShippingAddressModalPage';

const CheckoutAddressPage = () => {
  const { http, user } = AuthUser();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', state: '', zip: '', country: '' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    if (!user) router.push('/login');
    else {
      loadAddresses();
      loadCart();
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price_sales * item.cart_quantity), 0);
      const shipping = 0; // Free shipping over $50
      const tax = 0; // 8% tax
      const total = subtotal;

      setOrderSummary({
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      });
    }
  }, [cartItems]);

  const loadAddresses = async () => {
    try {
      const { data } = await http.get(`/addresses/${user.user_id}`);
      setAddresses(data || []);
      const defaultAddress = data.find(addr => addr.defaultAddress == 1);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
        setSelectedAddressId(defaultAddress.shipping_id);
      } else if (data.length > 0) {
        // Fallback to first address if no default
        setSelectedAddressId(data[0].shipping_id);
      }
    } catch (err) {
      notifyError('Failed to load addresses');
    }
  };

  const loadCart = async () => {
    try {
      const res = await http.get(`/cart/list/${user.user_id}`);
      setCartItems(res.data.data || []);
    } catch (err) {
      notifyError('Failed to load cart');
    }
  };

  const handleRemoveItem = async (cart_id) => {
    http.delete(`/cart/delete/${cart_id}`)
      .then(() => {
        notifySuccess('Item removed from cart successfully');
        setCartItems((prev) => prev.filter((item) => item.cart_id != cart_id));
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleNewAddressSubmit = async e => {
    e.preventDefault();
    setIsAddingAddress(true);

    try {
      const { data } = await http.post('/addresses/create', {
        customer_id: user.customer_id,
        ...newAddress,
        defaultAddress: addresses.length === 0 // Set as default if first address
      });

      notifySuccess('Address added successfully');
      setAddresses(prev => [...prev, data]);

      // If this is the first address or was set as default, select it
      if (addresses.length === 0 || data.defaultAddress) {
        setSelectedAddressId(data.shipping_id);
      }

      setNewAddress({ label: '', street: '', city: '', state: '', zip: '', country: '' });
      setIsAddingAddress(false);
    } catch {
      notifyError('Could not add address');
      setIsAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      notifyError('Please select a shipping address');
      return;
    }

    if (cartItems.length === 0) {
      notifyError('Your cart is empty');
      return;
    }



    setIsPlacingOrder(true);
    try {

      const totalQuantity = cartItems.reduce((sum, item) => sum + item.cart_quantity, 0);
      const { data } = await http.post('/orders/create', {
        customer_id: user.user_id,
        city: selectedAddress.city ? selectedAddress.city : "",
        state: selectedAddress.city ? selectedAddress.state : "",
        address_line1: selectedAddress.address_line1 ? selectedAddress.address_line1 : "",
        address_line2: selectedAddress.address_line2 ? selectedAddress.address_line2 : "",
        country: selectedAddress.country ? selectedAddress.country : "",
        cart_items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.cart_quantity
        })),
        subtotal: parseFloat(orderSummary.subtotal),
        shipping: parseFloat(orderSummary.shipping),
        tax: parseFloat(orderSummary.tax),
        total: parseFloat(orderSummary.total),
        total_quantity: totalQuantity,
      });


      notifySuccess(`Order #${data.order_id} placed successfully!`);
      router.push(`/`);
    } catch (err) {
      console.error('Order error:', err);
      notifyError('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
    loadAddresses(); // Trigger after modal is closed
  };
  return (
    <>
      <Wrapper>
        <SEO pageTitle="Checkout - Confirm Your Order" />
        <HeaderTwo style_2={true} />
        <CommonBreadcrumb title="Checkout Page" subtitle="Checkout Page" />
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Head>

        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
          <div className="container mx-auto px-4 py-12" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-blue-700 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <FiShoppingBag className="mr-3" /> Your Shopping Cart ( {cartItems.length} ) items
                    </h2>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr className="bg-blue-50 text-left text-sm font-semibold text-gray-700">
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Total Price</th>
                            <th className="px-4 py-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {cartItems.map((item, index) => (
                            <motion.tr
                              key={item.product_id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-blue-50 transition-colors duration-200"
                            >
                              <td className="px-4 py-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                  {item.img && item.img != null ? <img
                                    width={100}
                                    height={70}
                                    src={`${IMG_URL}/products/${item.img}`}
                                    alt={noImage}
                                    className="w-full h-full object-cover"
                                  /> : <img
                                    width={100}
                                    height={70}
                                    src={`${IMG_URL}/products/${item.img}`}
                                    alt={"No Image Available"}
                                    className="w-full h-full object-cover"
                                  />}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {item.product_english_name}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {item.cart_quantity}
                              </td>
                              <td className="px-4 py-3 font-semibold text-blue-700">
                                ₹{(item.price_sales * item.cart_quantity).toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleRemoveItem(item.cart_id)}
                                  className="text-sm text-red-500 hover:text-red-700 flex items-center"
                                >
                                  <FiTrash2 className="mr-1" /> Remove
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-gray-500 mb-4">Your cart is empty</p>
                      <button
                        onClick={() => router.push('/shop')}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}

                </motion.div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header  text-white">
                      <h5 className="mb-0">
                        <FiMapPin className="me-2" />
                        Shipping Address
                      </h5>
                    </div>
                    <div className="card-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {addresses.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {addresses.map((addr) => (
                            <div
                              key={addr.shipping_id}
                              className={`list-group-item list-group-item-action ${selectedAddressId === addr.shipping_id ? 'active' : ''}`}
                              onClick={() => setSelectedAddressId(addr.shipping_id)}
                            >
                              <div className="form-check d-flex align-items-start">
                                <input
                                  className="form-check-input me-3 mt-1"
                                  type="radio"
                                  name="shippingAddress"
                                  id={`address-${addr.shipping_id}`}
                                  checked={selectedAddressId === addr.shipping_id || addr.defaultAddress}
                                  onChange={() => setSelectedAddressId(addr.shipping_id)}
                                />
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <label
                                      className="form-check-label fw-bold"
                                      htmlFor={`address-${addr.shipping_id}`}
                                    >
                                      {addr.addressType.charAt(0).toUpperCase() + addr.addressType.slice(1)}
                                      {addr.defaultAddress && (
                                        <span className="badge bg-info ms-2">Default</span>
                                      )}
                                    </label>
                                    <div className="btn-group btn-group-sm">
                                      {/* <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          editAddress(addr);
                                        }}
                                      >
                                        <FiEdit2 size={14} />
                                      </button> */}
                                      {/* <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeAddress(addr.shipping_id);
                                        }}
                                      >
                                        <FiTrash2 size={14} />
                                      </button> */}
                                    </div>
                                  </div>
                                  <div className="mt-2 small">
                                    <div>{addr.street}</div>
                                    <div>{addr.city}, {addr.state} {addr.zip}</div>
                                    <div>{addr.country}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                            <FiMapPin size={24} className="text-primary" />
                          </div>
                          <h5 className="mb-2">No Saved Addresses</h5>
                          <p className="text-muted mb-3">You haven't saved any shipping addresses yet.</p>
                          <button
                            className="btn btn-primary"
                            // onClick={() => hand}
                            onClick={() => setIsModalOpen(true)}
                          >
                            <FiPlus className="me-1" /> Manage Shipping Address
                          </button>
                        </div>
                      )}

                      <div className="mt-3">
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <FiPlus className="me-1" /> Manage Shipping Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="col-4 bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="bg-blue-700 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-2">
                      {/* <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium"> ₹{orderSummary.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium"> ₹{orderSummary.shipping}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Tax</span>
                        <span className="font-medium"> ₹{orderSummary.tax}</span>
                      </div> */}

                      <div className="border-t border-gray-200  d-flex justify-between font-semibold">
                        <h5 className="text-gray-900">Total &nbsp;</h5>
                        <span className="text-blue-700 font-bold"> ₹{orderSummary.total}</span>
                      </div>
                    </div>
                    <div>
                      <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
                        <p>Guaranteed safe   &amp; secure checkout</p>
                        <br />
                        <img src="assets/img/product/icons/payment-option.png" alt />
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      className="btn btn-primary mt-3 w-100 shadow btn-lg w-full"
                    >
                      Place Your Order
                    </button>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
        <ShippingAddressModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
        <Footer />
      </Wrapper>
    </>
  );
};

export default CheckoutAddressPage;