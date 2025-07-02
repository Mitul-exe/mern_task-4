import React, { useState, useEffect, useRef } from "react";
import "./TwoFactorAuth.css";
import { assets } from "../../assets/assets";
import { RiLockPasswordFill } from "react-icons/ri";

function TwoFactorAuth({ open, onVerify }) {
  const [error, setError] = useState("");
  const [code, setCode] = useState(["", "", "", ""]); // 4 digits for the code
  const inputRefs = useRef([]);

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [open]);

  const InputHandle = (value, index) => {
    // Ensure only numbers are entered
    const digit = value.replace(/[^0-9]/g, "");

    if (digit.length <= 1) {
      const newCode = [...code];
      newCode[index] = digit;
      setCode(newCode);

      // Move to next input if there's a value and not the last input
      if (digit !== "" && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1].focus();
    }

    // Handle space
    if (e.key === " " && index < 3 && code[index] !== "") {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    try {
      if (fullCode.length === 4) {
        await onVerify(fullCode);
      }
      setCode(["", "", "", ""]);
      setError("");
    } catch (error) {
      setError(`Please enter a valid 4 digit code.`);
      console.error(error);
      setCode(["", "", "", ""]);
    }
  };

  return (
    <div className="two-factor-auth">
      <div
        className="outer-container"
        style={{
          backgroundImage: `url(${assets.twoFa})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="top">
          <h2>
            <RiLockPasswordFill /> Two-Factor Authentication
          </h2>
          <p className="subtitle">Enhanced Security for Your Account</p>
        </div>
        <p>
          We've sent a 4-digit code to your email. Please enter it below to
          verify your identity.
        </p>
        <div className="input-container">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              maxLength={1}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => InputHandle(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button onClick={handleVerify}>VERIFY</button>
        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              paddingInline: "10px",
              fontSize: "1.2em",
              marginTop: "10px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default TwoFactorAuth;
