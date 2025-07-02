import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  const placeOrder = async (event) => {
    event.preventDefault();

    if (data.city.trim().toLowerCase() !== "new delhi") {
      alert("Our services do not cater outside Delhi.");
      return; // Stop execution if city is invalid
    }
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));
  
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
  
    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });
  
      if (response.data.success) {
        const { order_id, amount, key_id, mongo_order_id  } = response.data;
  
        // Check if Razorpay SDK is loaded
        if (!window.Razorpay) {
          alert("Razorpay SDK failed to load. Please check your internet connection.");
          return;
        }
  
        // Initialize Razorpay
        const options = {
          key: key_id,
          amount: amount, // Amount in paise
          currency: "INR",
          name: "Your App Name",
          description: "Order Payment",
          order_id: order_id,
          handler: function (response) {
            const queryParams = new URLSearchParams({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              success: true,
              orderId: mongo_order_id, 
            }).toString();
          
            navigate(`/verify?${queryParams}`);
          },
          
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: "#3399cc" },
        };
  
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Order placement failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`An error occurred while placing the order: ${error.response?.data?.message || error.message}`);
    }
  };
  
  
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" required />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" required />
        </div>
        <input name="email" onChange={onChangeHandler} value={data.email} type="text" placeholder="Email" required />
        <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" required />
        <div className="multi-fields">
        <div className="city-input-container">
          <input 
            name="city" 
            onChange={onChangeHandler} 
            value={data.city} 
            type="text" 
            placeholder="City" 
            required 
            className="form-input"
          />
          {data.city.trim().toLowerCase() !== "new delhi" && data.city.trim() !== "" && (
            <p className="city-validation-note">❗ We currently serve only New Delhi</p>
          )}
        </div>
        <div className="state-input-container">
          <input 
            name="state" 
            onChange={onChangeHandler} 
            value={data.state} 
            type="text" 
            placeholder="State" 
            required 
            className="form-input"
          />
        </div>
      </div>

        <div className="multi-fields">
          <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" required />
          <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" required />
        </div>
        <input name="phone" onChange={onChangeHandler} value={data.phone} type="tel" placeholder="Phone No" required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>Rs. {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs. {getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
