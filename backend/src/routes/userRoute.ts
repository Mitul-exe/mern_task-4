import express from "express";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Existing routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// New routes for forgot password and reset password
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword); // Include token in the URL

export default userRouter;
