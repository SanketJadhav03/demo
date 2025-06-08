import { useState, useEffect } from 'react';
import Head from 'next/head';
import AuthUser from '@/auth/authuser';
import { notifySuccess } from '@/utils/toast';

export default function ShippingAddress() {
  const { user, http } = AuthUser();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    user_id: user?.user_id || 0,
    state: '',
    pincode: '',
    country: '',
    addressType: 'home',
    defaultAddress: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editId, setEditId] = useState(null); // Track if we're editing an address

  // Fetch addresses when component mounts or user changes
  useEffect(() => {
    if (user?.user_id) {
      fetchAddresses();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await http.get(`/addresses/${user.user_id}`);
      setSavedAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!currentAddress.city.trim()) newErrors.city = 'City is required';
    if (!currentAddress.state.trim()) newErrors.state = 'State is required';
    if (!currentAddress.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(currentAddress.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (!currentAddress.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editId) {
        // Update existing address
        await http.put(`/addresses/${editId}`, currentAddress);
      } else {
        console.log(currentAddress);
        // Create new address
      const response  =   await http.post('/addresses', currentAddress);

      notifySuccess(response.data.message);

      
      }
      
      // Refresh the address list
      await fetchAddresses();
      
      // Reset form
      setCurrentAddress({
        addressLine1: '',
        addressLine2: '',
        city: '',
        user_id: user?.user_id || 0,
        state: '',
        pincode: '',
        country: '',
        addressType: 'home',
        defaultAddress: false
      });
      setEditId(null);
      
      // Switch back to list view
      setViewMode('list');
    } catch (error) {
      console.error('Submission error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const editAddress = (address) => {
    setCurrentAddress(address);
    setEditId(address.id);
    setViewMode('form');
  };

  const removeAddress = async (id) => {
    try {
      await http.delete(`/addresses/${id}`);
      await fetchAddresses(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting address:', error);
      // You might want to show an error message to the user here
    }
  };

  const setAsDefault = async (id) => {
    try {
      await http.get(`/set/default/${id}/${user.user_id}`);
      await fetchAddresses(); // Refresh the list to show the new default
    } catch (error) {
      console.error('Error setting default address:', error);
      // You might want to show an error message to the user here
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Shipping Address | Your E-commerce Store</title>
        <meta name="description" content="Manage your shipping addresses" />
      </Head>

      <main className="main">
        <div className="header">
          <h1 className="title">Shipping Addresses</h1>
          <p className="subtitle">Manage your delivery addresses</p>
        </div>

        {viewMode === 'list' ? (
          <div className="address-list-container">
            {savedAddresses.length > 0 ? (
              <div className="address-list">
                {savedAddresses.map(address => (
                  <div key={address.id} className={`address-card ${address.defaultAddress ? 'default' : ''}`}>
                    <div className="card-header">
                      <h3>
                        {address.addressType.charAt(0).toUpperCase() + address.addressType.slice(1)}
                        {address.defaultAddress && <span className="default-badge">Default</span>}
                      </h3>
                      <div className="card-actions">
                        <button 
                          onClick={() => setAsDefault(address.shipping_id)}
                          disabled={address.defaultAddress}
                          className="action-btn"
                        >
                          {address.defaultAddress ? 'Default' : 'Set as Default'}
                        </button>
            
                        <button 
                          onClick={() => removeAddress(address.id)}
                          className="action-btn remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm13.464 12.536L20 12l-3.536-3.536L15.05 9.88 17.172 12l-2.122 2.121 1.414 1.415zM6.828 12L8.95 9.879 7.536 8.464 4 12l3.536 3.536L8.95 14.12 6.828 12zm4.416 5l3.64-10h-2.128l-3.64 10h2.128z" />
                </svg>
                <h3>No addresses saved yet</h3>
                <p>Add your first shipping address to get started</p>
              </div>
            )}

            <button 
              onClick={() => {
                setCurrentAddress({
                  addressLine1: '',
                  addressLine2: '',
                  city: '',
                  user_id: user?.user_id || 0,
                  state: '',
                  pincode: '',
                  country: '',
                  addressType: 'home',
                  defaultAddress: false
                });
                setEditId(null);
                setViewMode('form');
              }}
              className="add-address-btn"
            >
              + Add New Address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-header">
              <h2>{editId ? 'Edit Address' : 'Add New Address'}</h2>
              <button 
                type="button" 
                onClick={() => setViewMode('list')}
                className="back-btn"
              >
                ← Back to List
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1*</label>
              <input
                id="addressLine1"
                name="addressLine1"
                value={currentAddress.addressLine1}
                onChange={handleChange}
                placeholder="House No., Building, Street"
              />
              {errors.addressLine1 && <span className="error">{errors.addressLine1}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                id="addressLine2"
                name="addressLine2"
                value={currentAddress.addressLine2}
                onChange={handleChange}
                placeholder="Area, Colony, Landmark"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City*</label>
                <input
                  id="city"
                  name="city"
                  value={currentAddress.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State*</label>
                <input
                  id="state"
                  name="state"
                  value={currentAddress.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
                {errors.state && <span className="error">{errors.state}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pincode">Pincode*</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="number"
                  value={currentAddress.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                />
                {errors.pincode && <span className="error">{errors.pincode}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="country">Country*</label>
                <select
                  id="country"
                  name="country"
                  value={currentAddress.country}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
                {errors.country && <span className="error">{errors.country}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Address Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={currentAddress.addressType === 'home'}
                    onChange={handleChange}
                  />
                  <span className="radio-label">Home</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="office"
                    checked={currentAddress.addressType === 'office'}
                    onChange={handleChange}
                  />
                  <span className="radio-label">Office</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="other"
                    checked={currentAddress.addressType === 'other'}
                    onChange={handleChange}
                  />
                  <span className="radio-label">Other</span>
                </label>
              </div>
            </div>


            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setViewMode('list')}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    {editId ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  editId ? 'Update Address' : 'Save Address'
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .main {
          padding: 2rem 0;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .title {
          margin: 0 0 0.5rem;
          line-height: 1.2;
          font-size: 2.2rem;
          color: #2d3748;
          font-weight: 700;
        }

        .subtitle {
          margin: 0;
          color: #718096;
          font-size: 1.1rem;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .loading-spinner .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #4299e1;
          animation: spin 1s ease-in-out infinite;
        }

        /* List View Styles */
        .address-list-container {
          margin-top: 2rem;
        }

        .address-list {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .address-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .address-card.default {
          border-left: 4px solid #4299e1;
        }

        .address-card:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #edf2f7;
        }

        .card-header h3 {
          margin: 0;
          color: #2d3748;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .default-badge {
          background: #ebf8ff;
          color: #3182ce;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          background: #fff;
          color: #4299e1;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #ebf8ff;
        }

        .action-btn:disabled {
          color: #a0aec0;
          cursor: not-allowed;
          background: #fff;
        }

        .action-btn.edit {
          color: #38a169;
        }

        .action-btn.edit:hover {
          background: #f0fff4;
        }

        .action-btn.remove {
          color: #e53e3e;
        }

        .action-btn.remove:hover {
          background: #fff5f5;
        }

        .card-body {
          color: #4a5568;
          line-height: 1.6;
        }

        .card-body p {
          margin: 0.5rem 0;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .empty-state svg {
          width: 48px;
          height: 48px;
          color: #cbd5e0;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #2d3748;
          margin: 0 0 0.5rem;
        }

        .empty-state p {
          color: #718096;
          margin: 0;
        }

        .add-address-btn {
          width: 100%;
          padding: 1rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .add-address-btn:hover {
          background-color: #3182ce;
        }

        /* Form View Styles */
        .address-form {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .form-header h2 {
          margin: 0;
          color: #2d3748;
          font-size: 1.5rem;
        }

        .back-btn {
          background: none;
          border: none;
          color: #4299e1;
          font-size: 0.9375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .back-btn:hover {
          text-decoration: underline;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a5568; 
          font-size: 0.9375rem;
        }

        input, select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          background: #f8fafc;
          transition: all 0.2s;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
          background: #fff;
        }

        .error {
          color: #e53e3e;
          font-size: 0.8125rem;
          margin-top: 0.25rem;
          display: block;
        }

        .radio-group {
          display: flex;
          gap: 1.5rem;
          margin-top: 0.5rem;
        }

        .radio-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: normal;
          cursor: pointer;
        }

        .radio-label {
          font-weight: 400;
          color: #4a5568;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checkbox-group label {
          margin-bottom: 0;
          font-weight: normal;
          cursor: pointer;
          color: #4a5568;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .cancel-btn {
          flex: 1;
          padding: 1rem;
          background-color: #fff;
          color: #4299e1;
          border: 1px solid #4299e1;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background-color: #ebf8ff;
        }

        .submit-btn {
          flex: 2;
          padding: 1rem;
          background-color: #4299e1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover {
          background-color: #3182ce;
        }

        .submit-btn:disabled,
        .submit-btn.submitting {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Styles */
        @media (max-width: 640px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .radio-group {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .card-actions {
            width: 100%;
          }

          .action-btn {
            flex: 1;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .submit-btn {
            flex: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}