import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import axios from "axios";
import AuthUser from "@/auth/authuser";

const MyOrders = ({ orderData }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { http, user } = AuthUser();
  useEffect(() => {
    // Only fetch orders if we don't already have them from the props
    if (!orderData?.orders || orderData?.orders.length === 0) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const response = await http.get(`/show/orders/${user.user_id}`); // Fetch API by user_id
console.log(response.data);

          setOrderItems(response.data); // Assuming response has { orders: [...] }
        } catch (err) {
          setError(`Failed to fetch orders. ${err}`);
        } finally {
          setLoading(false);
        }
      };

      if (user?.user_id) {
        fetchOrders();
      }
    }
  }, [orderData, user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <p>{error}</p>
      </div>
    );
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert the string to a Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day, pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month, pad with zero if needed
    const year = date.getFullYear(); // Get the full year

    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  };
  return (
    <div className="profile__ticket table-responsive">
      {!orderItems ||
        (orderItems?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>You Have no order Yet!</p>
            </div>
          </div>
        ))}
      {orderItems && orderItems?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Order Date</th>
              <th scope="col">Status</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, i) => (
              <tr key={i}>
                <th scope="row">#{i + 1}</th>
                <td data-info="title">
                  {item.master_bill_date}
                </td>
                <td
                  className={`px-3 py-1 text-sm font-semibold rounded-full text-center w-fit 
    ${item.master_bill_status == 1 ? "bg-yellow-100 text-yellow-800"
                      : item.master_bill_status == 2 ? "bg-blue-100 text-blue-800"
                        : item.master_bill_status == 3 ? "bg-indigo-100 text-indigo-800"
                          : item.master_bill_status == 4 ? "bg-purple-100 text-purple-800"
                            : item.master_bill_status == 5 ? "bg-red-100 text-red-800"
                              : item.master_bill_status == 6 ? "bg-green-100 text-green-800"
                                : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {
                    item.master_bill_status == 1 ? "Pending"
                      : item.master_bill_status == 2 ? "Approved"
                        : item.master_bill_status == 3 ? "Packing"
                          : item.master_bill_status == 4 ? "Dispatch"
                            : item.master_bill_status == 5 ? "Rejected"
                              : item.master_bill_status == 6 ? "Delivered"
                                : "Unknown"
                  }
                </td>

                <td>


                  <Link href={`/order?master_id=${item.master_id}`} className="btn btn-success">
                    {/* <i className="ri-eye-line fs-16"></i> */}
                    View
                  </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
