import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendOTPVerification, sendMail } from "../Services/MailSender.js";
import { Request, Response } from "express";
// Utility function to create JWT token
const createToken = (id: string) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  return jwt.sign({ id },JWT_SECRET, { expiresIn: "1h" });
};

// Login User
const loginUser = async (req : Request, res : Response) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User doesn't exist" });
      return
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
      return
    }

    const token = createToken((user._id as string));
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Register User
const registerUser = async (req : Request, res : Response) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      res.status(409).json({ success: false, message: "User already exists" });
      return
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ success: false, message: "Invalid email format" });
      return
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });

    const user = await newUser.save();
    const token = createToken((user._id as string));

    const otp = await sendOTPVerification(user);
    const sendingMail = await sendMail(req, res, otp);

    if (!sendingMail) {
      // Handle mail sending failure if needed
      console.warn("Mail sending failed but user was registered");
    }
    
    return res.status(201).json({
      message: "User registered successfully and otp sent successfully!!",
      userId: user.id,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Forgot Password
const forgotPassword = async (req : Request, res : Response) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/user/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "YourAppName <noreply@yourapp.com>",
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

// Reset Password
const resetPassword = async (req : Request, res : Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid or expired token" });
      return
    }

    if (password.length < 8) {
      res.status(400).json({ success: false, message: "Password too short" });
      return
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { loginUser, registerUser, forgotPassword, resetPassword };
