import mongoose from "mongoose";

const userOTPVerifySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const userOTPVerifyModel = mongoose.model("userOTPVerify", userOTPVerifySchema);

export default userOTPVerifyModel;
