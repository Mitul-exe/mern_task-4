import React, { useState } from 'react';
import './Subscription.css'

const Subscription = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [planDetails, setPlanDetails] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const plans = {
    weekly: {
      price: "$5",
      period: "per week",
      benefits: [
        "Access to daily content",
        "Free Delivery Charges",
        "24/7 customer support",
        "No Exclusive discounts"
      ]
    },
    monthly: {
      price: "$15",
      period: "per month",
      benefits: [
        "Free Delivery Charges",
        "24/7 customer support",
        "Exclusive offers and promotions",
        "Personalized recommendations"
      ]
    },
    yearly: {
      price: "$150",
      period: "per year",
      benefits: [
        "Free Delivery Charges",
        "Access to all content for the year",
        "Exclusive offers and promotions",
        "Free event tickets",
        "Premium customer support"
      ]
    }
  };

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setPlanDetails(plans[plan]);
    setIsModalOpen(true);
  };

  const handleConfirmSubscription = () => {
    setSubscriptionMessage(`Successfully subscribed to ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan!`);
  };

  return (
    <div className="subscription-container">
      {Object.entries(plans).map(([plan, details]) => (
        <div key={plan} className={`subscription-card ${plan}-plan`}>
          <div className="card-content">
            <h3>{plan.charAt(0).toUpperCase() + plan.slice(1)}</h3>
            <div className="price-container">
              <span className="price">{details.price}</span>
              <span className="period">{details.period}</span>
            </div>
            <ul className="benefits-list">
              {details.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            <button className="subscribe-button" onClick={() => handleSubscribe(plan)}>
              Choose Plan
            </button>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan</h3>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="price-container">
                <span className="price">{planDetails.price}</span>
                <span className="period">{planDetails.period}</span>
              </div>
              <div className="benefits-container">
                <h4>Plan Benefits</h4>
                <ul>
                  {planDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              {subscriptionMessage && (
                <div className="success-message">{subscriptionMessage}</div>
              )}
              <button className="confirm-button" onClick={handleConfirmSubscription}>
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;