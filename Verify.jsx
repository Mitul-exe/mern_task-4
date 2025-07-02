import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import "./Verify.css";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
 
  useEffect(() => {
    const verifyPayment = async () => {
      const razorpay_order_id = searchParams.get("razorpay_order_id");
      const razorpay_payment_id = searchParams.get("razorpay_payment_id");
      const razorpay_signature = searchParams.get("razorpay_signature");
  
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error("Payment parameters are missing");
        navigate("/");
        return;
      }
  
      try {
        const response = await axios.post(url + "/api/order/verify", {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          orderId,
        });
  
        if (response.data.success) {
          navigate("/myorders");
        } else {
          alert("Payment verification failed. Redirecting to home.");
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying payment", error);
        alert("An error occurred while verifying payment. Redirecting to home.");
        navigate("/");
      }
    };
  
    verifyPayment();
  }, [url, orderId, searchParams, navigate]);
  

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
