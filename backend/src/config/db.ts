import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI as string
    await mongoose.connect(URI);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};
