import React from "react";
import "./notfound.css";

function Notfound() {
  return (
    <div className="notfound-page">
      {/* Spline Background */}
      <div className="video-component">
        <video autoPlay loop muted src="/404.mp4"></video>
      </div>

      {/* Content */}
      <div className="content">
        <h1>Oops!</h1>
        <p>Page not found</p>
        <button onClick={() => (window.location.href = "/")}>
          <a href="/">Go back to home</a>
        </button>
      </div>
    </div>
  );
}

export default Notfound;
