import React, { useState, useCallback } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { motion } from "framer-motion";
import "./Feedback.css";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [error, setError] = useState("");
  const [showpopup, setShowpopup] = useState(false);

  const handleClick = useCallback((star) => {
    setRating(star);
  }, []);

  const handleMouseEnter = useCallback((star) => {
    setHover(star);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(0);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        feedback: formData.get("feedback"),
        rating: rating,
      };
      setError("");
      try {
        const newfeedback = await axios.post(
          "http://localhost:4000/api/feedback/add",
          data
        );
        if (newfeedback.status === 200) {
          setShowpopup(true);
          setTimeout(() => {
            setShowpopup(false);
          }, 2000);
        }
      } catch (error) {
        setError("Something went wrong!");
      }
    },
    [rating]
  );

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <div className="feedback-content">
          <div className="feedback-left">
            <div className="feedback-header">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1>
                  <VscFeedback />
                  We value your Feedback!
                </h1>
                <p>
                  Your thoughts help us improve. Share your experience and suggestions with us!
                </p>
              </motion.div>
              <div className="feedback-image">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img
                    src="https://lightoflove.com.ph/wp-content/uploads/2024/05/reasons-why-attend-food-tasting-chef-customers.jpg"
                    alt="Feedback"
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="feedback-right">
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  required
                  pattern="^[a-zA-Z\s]{3,50}$"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                />
              </div>

              <div className="form-group">
                <textarea
                  rows={6}
                  name="feedback"
                  placeholder="Your valuable feedback or suggestion here..."
                  required
                ></textarea>
              </div>

              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    type="button"
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    className="star-button"
                  >
                    <FaStar
                      className={`star ${star <= (hover || rating) ? "active" : ""}`}
                    />
                  </motion.button>
                ))}
              </div>

              {error && <div className="error-message">{error}</div>}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="submit-button"
              >
                Submit Feedback
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {showpopup && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="feedback-popup"
        >
          Thank you for your feedback!
        </motion.div>
      )}
    </div>
  );
};

export default Feedback;