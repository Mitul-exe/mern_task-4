import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import feedbackRouter from "./routes/feedback.route.js";
import otpVerificationRoutes from "./routes/OTPVefication.route.js";
import dotenv from "dotenv";
// loading envs
dotenv.config({
  path: "./.env",
});

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());

const ORIGIN = "https://hungrybox-frontend.onrender.com/";
// const ORIGIN = "http://localhost:5173";
const corsOptions = {
  origin: ORIGIN,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// db connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/otpVerification", otpVerificationRoutes);
app.use("/images", express.static(path.join(path.resolve(), "src/uploads")));

app.get("/", (req, res) => {
  res.send("API Working");
});

// run express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
