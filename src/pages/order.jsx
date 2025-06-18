import AuthUser from "@/auth/authuser";
import SEO from "@/components/seo";
import Footer from "@/layout/footers/footer";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import noImage from '@assets/extra/img/no.jpg';
import { IMG_URL } from "@/url_helper";
import businessLogo from "@assets/img/business/business_logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiPackage, FiCheckCircle, FiTruck, FiHome, FiUser, FiCreditCard, FiCalendar, FiXCircle, FiPrinter } from "react-icons/fi";

export default function OrderPage() {
  const router = useRouter();
  const { master_id } = router.query;
  const { user, http } = AuthUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [businessData, setBusinessData] = useState({});

  // Fetch order details
  useEffect(() => {
    if (!master_id || !user) return;

    async function fetchOrderDetails() {
      setLoading(true);
      setError(null);

      try {
        await http.post("/order/show", { user_id: user.user_id, master_id })
          .then((res) => {
            console.log(res.data);
            
            setOrder(res.data[0]);
          })
          .catch((e) => {
            console.log(e);
            setError("Failed to fetch order details");
          });
      } catch (err) {
        setError(err.message || "Something went wrong");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [master_id, user]);

  // Fetch business details
  useEffect(() => {
    const getBusinessDetails = async () => {
      try {
        await http.get("/business_index").then((res) => {
          setBusinessData(res.data);
        }).catch((e) => {
          console.log(e);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getBusinessDetails();
  }, []);

  if (loading) return (
    <Wrapper>
      <SEO pageTitle={"Order Details"} />
      <HeaderTwo style_2={true} />
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    </Wrapper>
  );

  if (error) return (
    <Wrapper>
      <SEO pageTitle={"Order Error"} />
      <HeaderTwo style_2={true} />
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          {error}
          <button className="btn btn-link" onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    </Wrapper>
  );

  if (!order) return (
    <Wrapper>
      <SEO pageTitle={"Order Not Found"} />
      <HeaderTwo style_2={true} />
      <div className="container py-5">
        <div className="text-center py-5">
          <FiPackage size={48} className="text-muted mb-3" />
          <h4>No order data available</h4>
          <button className="btn btn-primary mt-3" onClick={() => router.back()}>
            <FiArrowLeft className="me-2" /> Go Back
          </button>
        </div>
      </div>
    </Wrapper>
  );

  // Status configuration
  const statusConfig = {
    '1': { label: 'New Order', icon: <FiCheckCircle />, color: 'bg-info', bgColor: '#d4edff' },
    '2': { label: 'Approved', icon: <FiCheckCircle />, color: 'bg-primary', bgColor: '#d4f5e0' },
    '3': { label: 'Packing', icon: <FiPackage />, color: 'bg-warning', bgColor: '#fff3d5' },
    '4': { label: 'Dispatched', icon: <FiTruck />, color: 'bg-secondary', bgColor: '#f0e5ff' },
    '5': { label: 'Rejected', icon: <FiXCircle />, color: 'bg-secondary', bgColor: '#d5f5f0' },
    '6': { label: 'Delivered', icon: <FiHome />, color: 'bg-success', bgColor: '#d5f5f0' }
  };

  // Get status steps with proper filtering
  const getStatusSteps = () => {
    const currentStatus = order.master_bill_status;
    const isRejected = currentStatus === '5';
    const isDelivered = currentStatus === '6';

    const allSteps = [
      { id: '1', name: 'New Order', ...statusConfig['1'] },
      { id: '2', name: 'Approved', ...statusConfig['2'] },
      { id: '3', name: 'Packing', ...statusConfig['3'] },
      { id: '4', name: 'Dispatched', ...statusConfig['4'] },
      { id: '5', name: 'Rejected', ...statusConfig['5'] },
      { id: '6', name: 'Delievered', ...statusConfig['6'] }
    ];

    // Add rejected or delivered step based on current status
    if (isRejected) {
      allSteps.push({ id: '5', name: 'Rejected', ...statusConfig['5'] });
    } else if (isDelivered) {
      allSteps.push({ id: '6', name: 'Delivered', ...statusConfig['6'] });
    } else {
      // For other statuses, show both but conditionally
      allSteps.push({ id: '5', name: 'Rejected', ...statusConfig['5'], hidden: true });
      allSteps.push({ id: '6', name: 'Delivered', ...statusConfig['6'], hidden: true });
    }

    return allSteps
      .filter(step => !step.hidden)
      .map(step => ({
        ...step,
        isActive: step.id === currentStatus,
        isCompleted: step.id < currentStatus,
        isRejected: step.id === '5'
      }));
  };

  const statusSteps = getStatusSteps();

  // Print invoice function
  const handlePrintInvoice = (order) => {
    const uniqueItemsMap = new Map();

    order.items.forEach((item) => {
      if (!uniqueItemsMap.has(item.product_id)) {
        uniqueItemsMap.set(item.product_id, item);
      }
    });

    const uniqueItems = Array.from(uniqueItemsMap.values());

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedOrderDate = new Date(order.master_bill_date).toLocaleDateString('en-US', {
      day: 'numeric',
      year: 'numeric',
      month: 'long'
    });

    const paymentMethod = order.master_payment_mode_id === "1" ? "Cash On Delivery" : "Online";

    const statusText =
      order.master_bill_status === '1' ? "New Order" :
        order.master_bill_status === '2' ? "Approved" :
          order.master_bill_status === '3' ? "Packing" :
            order.master_bill_status === '4' ? "Dispatch" :
              order.master_bill_status === '5' ? "Rejected" :
                order.master_bill_status === '6' ? "Delivered" : "Unknown";

    const statusClass =
      order.master_bill_status === '1' ? "status-new" :
        order.master_bill_status === '2' ? "status-approved" :
          order.master_bill_status === '3' ? "status-packing" :
            order.master_bill_status === '4' ? "status-dispatch" :
              order.master_bill_status === '5' ? "status-rejected" :
                order.master_bill_status === '6' ? "status-delivered" : "";

    const subtotal = parseFloat(order.master_total_bill_amt);
    const taxRate = 0;
    const taxAmount = 0;
    const grandTotal = parseFloat(order.master_total_bill_amt);

    const itemsRows = uniqueItems.length > 0 ?
      uniqueItems.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.product_name || 'Product'}</td>
          <td>${item.product_description ? item.product_description.replace(/<[^>]*>/g, '') : ''}</td>
          <td class="text-right">₹${parseFloat(item.price || 0).toFixed(2)}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">₹${(parseFloat(item.price || 0) * parseFloat(item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `).join('') :
      `<tr><td colspan="6" class="text-center">No items found</td></tr>`;

    const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Invoice #${order.master_id}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 30px;
          padding-bottom: 20px;
        }
        .company-name {
          font-size: 24px;
          font-weight: 600;
          color: #2c3e50;
        }
        .invoice-title {
          font-size: 28px;
          font-weight: 600;
          color: #3498db;
          text-align: center;
          margin: 20px 0;
        }
        .info-box {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
        }
        th {
          background-color: #3498db;
          color: white;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .totals-table {
          width: 300px;
          margin-left: auto;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 12px;
          display: inline-block;
        }
        .status-new { background-color: #d4edff; color: #2980b9; }
        .status-approved { background-color: #d4f5e0; color: #27ae60; }
        .status-packing { background-color: #fff3d5; color: #f39c12; }
        .status-dispatch { background-color: #f0e5ff; color: #9b59b6; }
        .status-rejected { background-color: #ffdede; color: #e74c3c; }
        .status-delivered { background-color: #d5f5f0; color: #16a085; }
        .signature-area {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
        }
        .signature-box {
          width: 200px;
          border-top: 1px solid #ccc;
          text-align: center;
          padding-top: 10px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <div class="company-name">${businessData ? businessData.business_name : 'Your Company Name '}</div>
            <div>265 Kasba Peth,<br>Shankar Market Road,<br>Phaltan,</div>
            <div>Dist. Satara – 415523,</div>
            <div>${order.master_city}</div>
            <div>${order.master_state}, ${order.master_country}</div>
            <div>Phone: +91 92264 39223</div>
          </div>
          <div>
            <img src="/img/business/business_logo.png" alt="Company Logo" style="max-width: 150px;">
          </div>
        </div>
        <div class="invoice-title">INVOICE</div>
        <div class="info-box">
          <strong>Bill To:</strong><br>
          ${order.user_name || 'Customer'}<br>
          ${order.master_address1 || ''}<br>
          ${order.master_address2 || ''}<br>
          ${order.master_city}, ${order.master_state}<br>
          ${order.master_country || ''}
        </div>
        <div class="info-box">
          <strong>Invoice #:</strong> ${order.master_id}<br>
          <strong>Date:</strong> ${order.master_bill_date}<br>
          <strong>Status:</strong> <span class="status-badge ${statusClass}">${statusText}</span><br>
          <strong>Payment:</strong> ${paymentMethod}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Description</th>
              <th class="text-right">Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        <table class="totals-table">
          <tr><td>Subtotal:</td><td class="text-right">₹${subtotal.toFixed(2)}</td></tr>
          <tr><td>Tax (${taxRate}%):</td><td class="text-right">₹${taxAmount.toFixed(2)}</td></tr>
          <tr><td><strong>Grand Total:</strong></td><td class="text-right"><strong>₹${grandTotal.toFixed(2)}</strong></td></tr>
        </table>
        <div class="signature-area">
          <div class="signature-box">Customer Signature</div>
          <div class="signature-box">Authorized Signature</div>
        </div>
        <div class="footer">
          Generated by POS System on ${currentDate}<br>
          Your Company Name | www.yourcompany.com | support@yourcompany.com
        </div>
      </div>
    </body>
    </html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  return (
    <Wrapper>
      <SEO pageTitle={`Order #${order.master_invoice_no}`} />
      <HeaderTwo style_2={true} />

      <div className="container py-5">
        <button
          onClick={() => router.back()}
          className="btn btn-outline-secondary mb-4 d-flex align-items-center"
        >
          <FiArrowLeft className="me-2" /> Back to Orders
        </button>

        {/* Rejected Alert */}
        {order.master_bill_status === '5' && (
          <div className="alert alert-danger mb-4">
            <FiXCircle className="me-2" />
            This order has been rejected. Please contact customer support if you have any questions.
          </div>
        )}

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Order #{order.master_invoice_no}</h4>
                  <span className={`badge ${statusConfig[order.master_bill_status]?.color || 'bg-secondary'}`}>
                    {statusConfig[order.master_bill_status]?.label || 'Processing'}
                  </span>
                </div>
              </div>
              <div className="card-body">
                {/* Enhanced Status Timeline */}
                <div className="order-timeline mb-4">
                  <div className="timeline-container">
                    <div className="timeline-scroll">
                      {statusSteps.map((step, index) => (
                        <div
                          key={step.id}
                          className={`timeline-step ${step.isActive ? 'active' : ''} ${step.isCompleted ? 'completed' : ''} ${step.isRejected ? 'rejected' : ''}`}
                          style={{
                            backgroundColor: step.isActive ? step.bgColor : 'transparent',
                            padding: step.isActive ? '10px' : '0',
                            borderRadius: step.isActive ? '8px' : '0'
                          }}
                        >
                          <div className="timeline-icon">
                            {step.icon}
                          </div>
                          <div className="timeline-label">
                            {step.label}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`timeline-connector ${step.isCompleted ? 'completed' : ''}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {(() => {
                  const uniqueItemCount = order.items
                    ? new Map(order.items.map(item => [item.product_id, item])).size
                    : 0;
                  return <h5 className="mb-3">Order Items ({uniqueItemCount})</h5>;
                })()}

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.length ? (
                        (() => {
                          const uniqueItemsMap = new Map();

                          order.items.forEach((item) => {
                            if (!uniqueItemsMap.has(item.product_id)) {
                              uniqueItemsMap.set(item.product_id, item);
                            }
                          });

                          const uniqueItems = Array.from(uniqueItemsMap.values());

                          return uniqueItems.map((item) => (
                            <tr key={item.product_id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-3">
                                    <div className="bg-light rounded" style={{ width: 60, height: 60 }}>
                                      <Image
                                        width={60}
                                        height={60}
                                        src={item.product_image ? `${IMG_URL}/products/${item.product_image}` : noImage}
                                        alt={item.product_name}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="mb-1">{item.product_name}</h6>
                                    <small className="text-muted">SKU: {item.product_id}</small>
                                  </div>
                                </div>
                              </td>
                              <td>₹{item.price}</td>
                              <td>{item.quantity}</td>
                              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ));
                        })()
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-4">No items found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Order #{order.master_invoice_no}</h4>
                  <span className={`badge ${order.master_bill_status == '5' ? 'bg-danger' :
                    order.master_bill_status == '6' ? 'bg-success' : 'bg-primary'
                    }`}>
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="mb-4">
                  <h4
                    className={
                      `mb-3 ${order.master_bill_status == '5' ? 'text-danger' :
                        order.master_bill_status == '6' ? 'text-success' :
                          'text-primary'
                      }`
                    }
                  >
                    {order.order_description}
                  </h4>
                </div>
                <div className="mb-4">
                  <p className="text-muted">
                    Thank you for placing your order with us! This order includes a carefully selected set of products tailored to your preferences.
                    We are currently processing your order and will notify you once it is shipped.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="text-right mb-3">
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => handlePrintInvoice(order)}
              >
                <FiPrinter className="me-2" /> Print Invoice
              </button>
            </div>

            <div className="card mb-4">
              <div className="card-header p-2">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{order.master_total_bill_amt}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>₹0.00</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>₹0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>₹{order.master_total_bill_amt}</span>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Customer Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6 className="d-flex align-items-center">
                    <FiUser className="me-2" /> Contact Info
                  </h6>
                  <p className="mb-1">{user.user_name || 'N/A'}</p>
                  <p className="mb-1">{user.user_email || 'N/A'}</p>
                  <p className="mb-0">{user.user_mobile || 'N/A'}</p>
                </div>

                <div className="mb-3">
                  <h6 className="d-flex align-items-center">
                    <FiCreditCard className="me-2" /> Payment Method
                  </h6>
                  <p className="mb-0">Cash on Delivery</p>
                </div>

                <div>
                  <h6 className="d-flex align-items-center">
                    <FiCalendar className="me-2" /> Order Date
                  </h6>
                  <p className="mb-0">
                    {order.master_bill_date}
                  </p>
                  {order.master_bill_status !== '5' && (
                    <small className="text-muted">
                      Estimated delivery: N/A
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                <p className="mb-1">{order.user_name || 'N/A'}</p>
                <p className="mb-1">{order.master_address1}</p>
                <p className="mb-1">{order.master_city}, {order.master_state} {order.master_pincode}</p>
                <p className="mb-0">{order.master_country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer style_2={true} />

      <style jsx>{`
        .order-timeline {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .timeline-container {
          width: 100%;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .timeline-scroll {
          display: flex;
          min-width: fit-content;
          padding: 20px 0;
        }

        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          min-width: 120px;
          padding: 0 15px;
          transition: all 0.3s ease;
        }

        .timeline-step.active {
          padding: 10px;
          border-radius: 8px;
        }

        .timeline-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          background-color: #e9ecef;
          color: #6c757d;
        }

        .timeline-step.completed .timeline-icon {
          background-color: #28a745;
          color: white;
        }

        .timeline-step.active .timeline-icon {
          background-color: #007bff;
          color: white;
        }

        .timeline-step.rejected .timeline-icon {
    background-color: #e9ecef;
          color: white;
        }

        .timeline-label {
          font-size: 0.85rem;
          text-align: center;
          white-space: nowrap;
          font-weight: 500;
        }

        .timeline-step.active .timeline-label {
          font-weight: 600;
          color: #007bff;
        }

        .timeline-step.rejected .timeline-label {
          font-weight: 600;
              color:black
        }

        .timeline-step.completed .timeline-label {
          color: #28a745;
        }

        .timeline-connector {
          position: absolute;
          top: 20px;
          right: -15px;
          width: 30px;
          height: 2px;
          background-color: #e9ecef;
        }

        .timeline-connector.completed {
          background-color: #28a745;
        }

        /* Custom scrollbar for timeline */
        .timeline-container::-webkit-scrollbar {
          height: 6px;
        }

        .timeline-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .timeline-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        .timeline-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .timeline-step {
            min-width: 100px;
          }
        }
      `}</style>
    </Wrapper>
  );
}
