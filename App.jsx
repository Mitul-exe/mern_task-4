import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import ContactUs from "./pages/ContactUs/ContactUs";
import Subscription from "./pages/Subscription/Subscription";
import HappyClients from "./components/HappyClients/HappyClients";
import Notfound from "./pages/notfound/Notfound";
import "./styles/theme.css";
import { ThemeProvider } from "./context/ThemeContext";

// Layout component to wrap the main content
const Layout = ({ children, setShowLogin }) => {
  return (
    <div className="app">
      <Navbar setShowLogin={setShowLogin} />
      {children}
      <HappyClients />
      <Footer />
    </div>
  );
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ThemeProvider>
      <>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <Routes>
          {/* Main routes with Layout */}
          <Route
            path="/"
            element={
              <Layout setShowLogin={setShowLogin}>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/subscription"
            element={
              <Layout setShowLogin={setShowLogin}>
                <Subscription />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout setShowLogin={setShowLogin}>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/order"
            element={
              <Layout setShowLogin={setShowLogin}>
                <PlaceOrder />
              </Layout>
            }
          />
          <Route
            path="/verify"
            element={
              <Layout setShowLogin={setShowLogin}>
                <Verify />
              </Layout>
            }
          />
          <Route
            path="/myorders"
            element={
              <Layout setShowLogin={setShowLogin}>
                <MyOrders />
              </Layout>
            }
          />
          <Route
            path="/contactus"
            element={
              <Layout setShowLogin={setShowLogin}>
                <ContactUs />
              </Layout>
            }
          />

          {/* NotFound route without Layout */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </>
    </ThemeProvider>
  );
};

export default App;
