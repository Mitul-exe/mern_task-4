import { CSVLink } from "react-csv";
import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import Loading from "../../components/Loading/Loading"; // Add a loader

const Orders = ({ url, isDarkMode }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchAllOrders = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(url + "/api/order/list");

      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
    } finally {
      setLoading(false); // End loading
    }
  }, [url]);

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value,
      });

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Prepare CSV data
  const csvData = orders.map((order) => ({
    Customer: order.address.firstName + " " + order.address.lastName,
    Items: order.items.map((item) => item.name + " x " + item.quantity).join(", "),
    Status: order.status,
    Amount: order.amount,
  }));

  const headers = [
    { label: "Customer", key: "Customer" },
    { label: "Items", key: "Items" },
    { label: "Status", key: "Status" },
    { label: "Amount", key: "Amount" },
  ];

  return (
    <div className={`order ${isDarkMode ? "dark" : ""}`}>
      {/* Show loader while loading */}
      {loading ? (
        <div className="loader-overlay">
          <Loading />
        </div>
      ) : (
        <>
          <div className="list-title">
            <h3>Order Page</h3>
            {/* Add the CSV export button */}
            <CSVLink data={csvData} headers={headers} filename={"orders_list.csv"}>
              <button className="export-btn">Export to CSV</button>
            </CSVLink>
          </div>

          <div className="order-list">
            {orders.map((order, index) => (
              <div key={index} className="order-item">
                <img src={assets.parcel_icon} alt="" />

                <div>
                  <p className="order-item-food">
                    {order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return item.name + " x " + item.quantity;
                      } else {
                        return item.name + " x " + item.quantity + ", ";
                      }
                    })}
                  </p>

                  <p className="order-item-name">
                    {order.address.firstName + " " + order.address.lastName}
                  </p>

                  <div className="order-item-address">
                    <p>{order.address.street + ", "}</p>
                    <p>
                      {order.address.city +
                        ", " +
                        order.address.state +
                        ", " +
                        order.address.country +
                        ", " +
                        order.address.zipcode}
                    </p>
                  </div>

                  <p className="order-item-phone">{order.address.phone}</p>
                </div>

                <p>Items: {order.items.length}</p>
                <p>Rs. {order.amount}</p>

                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

Orders.propTypes = {
  url: PropTypes.string.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default Orders;
