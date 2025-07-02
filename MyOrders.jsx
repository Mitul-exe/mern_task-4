import React, { useContext, useEffect, useState, useCallback } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import axios from "axios";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching orders with token:', token); // Debug token
      
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      
      console.log('Order data:', response.data.data); // Debug response
      setData(response.data.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [fetchOrders, token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="container">
          {data.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            data.map((order) => (
              <div key={order._id} className="my-order">
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                <p>
                  {order.items.map((item, index) => (
                    <span key={item.name + index}>
                      {item.name} - {item.quantity}
                      {index < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p>Price: Rs.{order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p>
                  <span>&#x25cf; </span>
                  <b>{order.status}</b>
                </p>
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
