import React from "react";
import "./FeedbackPopup.css"; // Add this for styling
import { FaCheckCircle } from "react-icons/fa";
import { assets } from "../../assets/assets";

function FeedbackPopup({
  companyName = "HungryBox",
  companyLogo = assets.logo,
}) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-header">
          {companyLogo && (
            <img
              src={companyLogo}
              alt="Company Logo"
              className="company-logo"
            />
          )}
          <h2>{companyName}</h2>
        </div>
        <FaCheckCircle className="tick-icon" />
        <p>Feedback sent successfully!</p>
      </div>
    </div>
  );
}

export default FeedbackPopup;
