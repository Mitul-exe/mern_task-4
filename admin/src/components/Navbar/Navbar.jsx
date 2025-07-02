import { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('dark', !isDarkMode);
    document.body.classList.toggle('light', isDarkMode);
  };

  return (
    <div className={`navbar ${isDarkMode ? "dark" : "light"}`}>
      <img className="logo" src={assets.logo} alt="Logo" />
      <p className="title">Welcome to HungryBox Admin Console</p>
      <img className="profile" src={assets.profile_image} alt="Profile" />

      {/* Dark/Light Mode Toggle Button */}
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {isDarkMode ? "🌙" : "☀️"}
      </button>
    </div>
  );
};

export default Navbar;
