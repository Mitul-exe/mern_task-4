import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cartData: Record<string, unknown>;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  subscription: boolean;
}

const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  subscription: { type: Boolean, default: false },
});

const userModel = mongoose.model<IUser>("user", userSchema);

export default userModel;
