import React from 'react';
import './KitchenToDoorstep.css';
import { assets } from '../../assets/assets';

const KitchenToDoorstep = () => {
  return (
    <div className="kitchen-doorstep dark">
      <h1 className="main-title">
        We DO <span className="emphasis">NOT</span> serve food from <span className="restaurant">Restaurants</span>!
      </h1>
      
      <div className="features-container">
        <div className="feature-column">
          <div className="feature-image-container yellow-bg">
            <img src={assets.app_screens} alt="Hungry Box Application" />
          </div>
          <h2>Hungry Box Application</h2>
          <p>Download Hungry Box app from iOS or Playstore, or just visit our website; simply signup & place a homemade food order.</p>
        </div>

        <div className="feature-column">
          <div className="feature-image-container pink-bg">
            <img src={assets.home_cook} alt="Home Cook" />
          </div>
          <h2>No Restaurant</h2>
          <p>Home-made food served from nearby family kitchens. They are families like yours. We do not partner with restaurants or dhaba.</p>
        </div>

        <div className="feature-column">
          <div className="feature-image-container yellow-bg">
            <img src={assets.delivery_man} alt="Delivery" />
          </div>
          <h2>Reliable Home Delivery</h2>
          <p>We have a reliable door-to-door delivery. You can even place advance or subscription food orders. Our delivery takes care of the rest.</p>
        </div>
      </div>
    </div>
  );
};

export default KitchenToDoorstep;
