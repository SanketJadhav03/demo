import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthUser from '@/auth/authuser';
import { notifySuccess } from '@/utils/toast';

// Dummy AuthUser and notify (replace with actual)




export default function ShippingAddressModal({ isOpen, onClose }) {
  const { user, http } = AuthUser();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);
  const emptyAddress = {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    addressType: 'home',
    defaultAddress: false,
    user_id: user.user_id,
  };
  const [currentAddress, setCurrentAddress] = useState(emptyAddress);

  useEffect(() => {
    if (isOpen) fetchAddresses();
  }, [isOpen]);

  const fetchAddresses = async () => {
    const res = await http.get(`/addresses/${user.user_id}`);
    setSavedAddresses(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!currentAddress.addressLine1) errs.addressLine1 = 'Required';
    if (!currentAddress.city) errs.city = 'Required';
    if (!currentAddress.state) errs.state = 'Required';
    if (!/^\d{6}$/.test(currentAddress.pincode)) errs.pincode = 'Invalid pincode (6 digits required)';
    if (!currentAddress.country) errs.country = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editId) {
        await http.put(`/addresses/${editId}`, currentAddress);
        notifySuccess('Address updated successfully');
      } else {
        const res = await http.post('/addresses', currentAddress);
        console.log(res.data);
        
        notifySuccess(res.data.message);
      }
      await fetchAddresses();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentAddress(emptyAddress);
    setEditId(null);
    setViewMode('list');
  };

  const editAddress = (addr) => {
    setCurrentAddress(addr);
    setEditId(addr.id);
    setViewMode('form');
  };

  const removeAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await http.delete(`/addresses/${id}`);
      await fetchAddresses();
      notifySuccess('Address removed');
    }
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case 'home': return '🏠';
      case 'work': return '🏢';
      case 'other': return '📍';
      default: return '🏠';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {viewMode === 'list' ? 'Your Shipping Addresses' : (editId ? 'Edit Address' : 'Add New Address')}
              </h2>
              <button className="modal-close-btn" onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {viewMode === 'list' ? (
              <div className="address-list-container">
                {savedAddresses.length > 0 ? (
                  <div className="address-grid">
                    {savedAddresses.map(addr => (
                      <motion.div 
                        key={addr.id} 
                        className="address-card"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="address-card-header">
                          <span className="address-type-icon">{getAddressTypeIcon(addr.addressType)}</span>
                          <span className="address-type">{addr.addressType.charAt(0).toUpperCase() + addr.addressType.slice(1)}</span>
                          {addr.defaultAddress && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                        <div className="address-details">
                          <p>{addr.addressLine1}</p>
                          {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                          <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p>{addr.country}</p>
                        </div>
                        <div className="address-card-actions">
                          {/* <button 
                            className="edit-btn"
                            onClick={() => editAddress(addr)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button> */}
                          {/* <button 
                            className="delete-btn"
                            onClick={() => removeAddress(addr.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            Delete
                          </button> */}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No Saved Addresses</h3>
                    <p>You haven't saved any shipping addresses yet.</p>
                    
                  </div>
                )}

                <motion.button 
                  className="add-address-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewMode('form')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add New Address
                </motion.button>
              </div>
            ) : (
              <form className="address-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="addressLine1">Street Address *</label>
                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    placeholder="123 Main St"
                    value={currentAddress.addressLine1}
                    onChange={handleChange}
                    className={errors.addressLine1 ? 'error' : ''}
                  />
                  {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="addressLine2">Apt, Suite, Building (Optional)</label>
                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    placeholder="Apt 4B"
                    value={currentAddress.addressLine2}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="New York"
                      value={currentAddress.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <div className="error-message">{errors.city}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="NY"
                      value={currentAddress.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <div className="error-message">{errors.state}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pincode">Postal Code *</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="10001"
                      value={currentAddress.pincode}
                      onChange={handleChange}
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <div className="error-message">{errors.pincode}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={currentAddress.country}
                      onChange={handleChange}
                      className={errors.country ? 'error' : ''}
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                    {errors.country && <div className="error-message">{errors.country}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="addressType">Address Type</label>
                  <div className="address-type-options">
                    {['home', 'work', 'other'].map(type => (
                      <label key={type} className="address-type-option">
                        <input
                          type="radio"
                          name="addressType"
                          value={type}
                          checked={currentAddress.addressType === type}
                          onChange={handleChange}
                        />
                        <span className="radio-custom"></span>
                        <span className="type-label">
                          {type === 'home' && '🏠 Home'}
                          {type === 'work' && '🏢 Work'}
                          {type === 'other' && '📍 Other'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="default-address-checkbox">
                    <input
                      type="checkbox"
                      name="defaultAddress"
                      checked={currentAddress.defaultAddress}
                      onChange={(e) => setCurrentAddress(prev => ({
                        ...prev,
                        defaultAddress: e.target.checked
                      }))}
                    />
                    <span className="checkbox-custom"></span>
                    Set as default shipping address
                  </label>
                </div>

                <div className="form-actions">
                  <motion.button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="spinner" viewBox="0 0 50 50">
                          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                         'Saving...'
                      </>
                    ) : (
                       'Save Address'
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// CSS Styles (would typically be in a separate CSS file)
const styles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
  }

  .modal-container {
    background: #fff;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    position: relative;
    padding: 0;
  }

  .modal-header {
    padding: 24px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    border-radius: 16px 16px 0 0;
  }

  .modal-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
  }

  .modal-close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #718096;
  }

  .modal-close-btn:hover {
    background: #f8f9fa;
    color: #4a5568;
  }

  .address-list-container {
    padding: 24px;
  }

  .address-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .address-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    position: relative;
  }

  .address-card:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .address-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 8px;
  }

  .address-type-icon {
    font-size: 1.2rem;
  }

  .address-type {
    font-weight: 600;
    color: #2d3748;
    text-transform: capitalize;
  }

  .default-badge {
    background: #edf2f7;
    color: #4a5568;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: auto;
  }

  .address-details {
    color: #4a5568;
    line-height: 1.6;
  }

  .address-details p {
    margin: 4px 0;
  }

  .address-card-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }

  .address-card-actions button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .edit-btn {
    background: #ebf8ff;
    color: #3182ce;
  }

  .edit-btn:hover {
    background: #bee3f8;
  }

  .delete-btn {
    background: #fff5f5;
    color: #e53e3e;
  }

  .delete-btn:hover {
    background: #fed7d7;
  }

  .add-address-btn {
    width: 100%;
    padding: 14px;
    background: #3182ce;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 16px;
  }

  .add-address-btn:hover {
    background: #2c5282;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .empty-state h3 {
    margin: 0 0 8px;
    color: #2d3748;
  }

  .empty-state p {
    color: #718096;
    margin: 0;
  }

  .address-form {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #4a5568;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  }

  .form-group input.error,
  .form-group select.error {
    border-color: #e53e3e;
  }

  .form-group input.error:focus,
  .form-group select.error:focus {
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.2);
  }

  .error-message {
    color: #e53e3e;
    font-size: 0.875rem;
    margin-top: 6px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .address-type-options {
    display: flex;
    gap: 16px;
    margin-top: 8px;
  }

  .address-type-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .address-type-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .radio-custom {
    position: relative;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #cbd5e0;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  .address-type-option input:checked ~ .radio-custom {
    background-color: #3182ce;
    border-color: #3182ce;
  }

  .radio-custom:after {
    content: "";
    position: absolute;
    display: none;
  }

  .address-type-option input:checked ~ .radio-custom:after {
    display: block;
  }

  .address-type-option .radio-custom:after {
    top: 3px;
    left: 3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }

  .type-label {
    color: #4a5568;
  }

  .checkbox-group {
    margin-top: 24px;
  }

  .default-address-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #4a5568;
  }

  .default-address-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkbox-custom {
    position: relative;
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #cbd5e0;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .default-address-checkbox input:checked ~ .checkbox-custom {
    background-color: #3182ce;
    border-color: #3182ce;
  }

  .checkbox-custom:after {
    content: "";
    position: absolute;
    display: none;
  }

  .default-address-checkbox input:checked ~ .checkbox-custom:after {
    display: block;
  }

  .default-address-checkbox .checkbox-custom:after {
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 32px;
  }

  .cancel-btn {
    padding: 12px 20px;
    background: #fff;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel-btn:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  .submit-btn {
    padding: 12px 24px;
    background: #3182ce;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .submit-btn:hover {
    background: #2c5282;
  }

  .submit-btn:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  .spinner {
    animation: rotate 1s linear infinite;
    width: 20px;
    height: 20px;
  }

  .spinner circle {
    stroke: currentColor;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .address-type-options {
      flex-direction: column;
      gap: 12px;
    }
    
    .form-actions {
      flex-direction: column-reverse;
    }
  }
`;

