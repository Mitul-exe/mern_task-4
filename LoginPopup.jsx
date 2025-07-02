import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";
import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth.jsx";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [is2faopen, setIs2faopen] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(null);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    token: "",
    newPassword: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTokenSetup = (responseData) => {
    const newToken = responseData.token;
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    setShowLogin(false);
    setIs2faopen(false);
  };

  const onLoginOrSignUp = async (event) => {
    event.preventDefault();
    const endpoint =
      currentState === "Login" ? "/api/user/login" : "/api/user/register";
    const newUrl = `${url}${endpoint}`;

    try {
      // Clear any existing session data
      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      const response = await axios.post(newUrl, data);
      // If currentState is "Sign Up", then redirect to two factor auth page
      if (currentState === "Sign Up") {
        setIs2faopen(true);
        setPendingResponse(response.data);
      } else {
        handleTokenSetup(response.data);
      }
    } catch (error) {
      console.error("Error during login or sign-up:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // On the success of the two factor authentication, authenticate the user
  const on2FaSuccess = () => {
    if (pendingResponse) {
      handleTokenSetup(pendingResponse);
      setPendingResponse(null);
      setIs2faopen(false);
    }
  };

  const handle2FaVerify = async (OTPcode) => {
    try {
      const verifyOTPResponse = await axios.post(
        `${url}/api/otpVerification/verifyOTP`,
        {
          userId: pendingResponse.userId,
          otp: OTPcode,
        }
      );
      on2FaSuccess();
    } catch (error) {
      console.error("Error during 2FA verification:", error);
    }
  };

  const onForgotPassword = async (event) => {
    event.preventDefault();
    const forgotPasswordUrl = `${url}/api/user/forgot-password`;

    try {
      const response = await axios.post(forgotPasswordUrl, {
        email: data.email,
      });
      if (response.data.success) {
        alert("Password reset link has been sent to your email.");
        setCurrentState("Reset Password");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const onResetPassword = async (event) => {
    event.preventDefault();
    const resetPasswordUrl = `${url}/api/user/reset-password`;

    try {
      const response = await axios.post(resetPasswordUrl, {
        token: data.token,
        newPassword: data.newPassword,
      });
      if (response.data.success) {
        alert(
          "Password reset successfully. You can now log in with your new password."
        );
        setCurrentState("Login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      {is2faopen ? (
        <div>
          <TwoFactorAuth open={is2faopen} onVerify={handle2FaVerify} />
        </div>
      ) : (
        <>
          <form
            onSubmit={
              currentState === "Forgot Password"
                ? onForgotPassword
                : currentState === "Reset Password"
                ? onResetPassword
                : onLoginOrSignUp
            }
            className="login-popup-cont"
          >
            <div className="login-popup-title">
              <h2>{currentState}</h2>
              <img
                onClick={() => setShowLogin(false)}
                src={assets.cross_icon}
                alt="Close"
              />
            </div>

            <div className="login-popup-input">
              {currentState === "Sign Up" && (
                <input
                  onChange={onChangeHandler}
                  name="name"
                  value={data.name}
                  type="text"
                  placeholder="Your Name"
                  required
                  pattern="[a-zA-Z ]+"
                  title="Please enter your name without numbers and special characters"
                />
              )}

              {(currentState === "Login" ||
                currentState === "Sign Up" ||
                currentState === "Forgot Password") && (
                <input
                  onChange={onChangeHandler}
                  name="email"
                  value={data.email}
                  type="email"
                  placeholder="Your Email"
                  required
                />
              )}

              {(currentState === "Login" || currentState === "Sign Up") && (
                <input
                  onChange={onChangeHandler}
                  name="password"
                  value={data.password}
                  type="password"
                  placeholder="Password"
                  required
                />
              )}

              {currentState === "Reset Password" && (
                <>
                  <input
                    onChange={onChangeHandler}
                    name="token"
                    value={data.token}
                    type="text"
                    placeholder="Enter reset token"
                    required
                  />
                  <input
                    onChange={onChangeHandler}
                    name="newPassword"
                    value={data.newPassword}
                    type="password"
                    placeholder="Enter new password"
                    required
                  />
                </>
              )}

              {currentState === "Login" && (
                <p
                  className="forgot-password-link"
                  onClick={() => setCurrentState("Forgot Password")}
                >
                  Forgot Password?
                </p>
              )}
            </div>

            {currentState === "Sign Up" && (
              <div className="login-popup-cond">
                <input type="checkbox" required />
                <span> I agree to the above Terms & Conditions.</span>
              </div>
            )}

            <button type="submit">
              {currentState === "Forgot Password"
                ? "Send Reset Link"
                : currentState === "Reset Password"
                ? "Reset Password"
                : currentState === "Sign Up"
                ? "Create Account"
                : "Login"}
            </button>

            {currentState === "Login" ? (
              <p>
                Create a New Account?{" "}
                <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span>
              </p>
            ) : currentState === "Sign Up" ? (
              <p>
                Already have an Account?{" "}
                <span onClick={() => setCurrentState("Login")}>Login</span>
              </p>
            ) : (
              <p>
                Back to{" "}
                <span onClick={() => setCurrentState("Login")}>Login</span>
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default LoginPopup;
