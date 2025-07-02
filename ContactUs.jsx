import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import { useLocation } from "react-router-dom";

const ContactUs = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  useEffect(() => {
    console.log("ContactUs mounted at path:", location.pathname);

    return () => {
      console.log("ContactUs unmounting from path:", location.pathname);
    };
  }, [location.pathname]);

  return (
    <div className="contact-container">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Contact Us</h2>

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              required
            />
          </div>

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
