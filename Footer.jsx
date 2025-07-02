import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    document.getElementById("year").textContent = currentYear;
  }, []);

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Footer Content */}
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__brand">
            <h2 className="footer__company-name">Hungry Box</h2>
            <p className="footer__brand-desc">
              Craving something delicious? Fast. Fresh. Reliable.
            </p>
            <div className="footer__social-links">
              <a href="#" className="footer__social-link">      
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" className="footer__social-link">
              <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="footer__social-link">
              <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>

             
          </div>

          {/* Navigation Section */}
          <nav className="footer__nav">
            <div className="footer__nav-columns">
              <div className="footer__nav-column">
                <ul className="footer__nav-list">
                  <li className="footer__nav-item">
                    <Link to="/contactus" className="footer__nav-link">
                      Contact Us
                    </Link>
                  </li>
                  <li className="footer__nav-item">
                    <a href="#" className="footer__nav-link">
                      About
                    </a>
                  </li>
                  <li className="footer__nav-item">
                    <a href="#" className="footer__nav-link">
                      Features
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer__nav-column">
                <ul className="footer__nav-list">
                  <li className="footer__nav-item">
                    <a href="#" className="footer__nav-link">
                      Career
                    </a>
                  </li>
                  <li className="footer__nav-item">
                    <a href="#" className="footer__nav-link">
                      Terms & Policy
                    </a>
                  </li>
                  <li className="footer__nav-item">
                    <a href="#" className="footer__nav-link">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Newsletter Section */}
          <div className="footer__newsletter">
            <h3 className="footer__newsletter-title">Newsletter</h3>
            <form className="footer__newsletter-form">
              <div className="footer__input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="footer__input"
                />
                <button type="submit" className="footer__button">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © <span id="year"></span> Hungry Box, All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
