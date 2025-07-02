import mongoose, { Document, Schema, Model } from "mongoose";

interface IOrder extends Document {
  userId: string;
  items: any[];
  amount: number;
  address: Record<string, any>;
  status: string;
  date: Date;
  payment: boolean;
}

const orderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
});

const orderModel: Model<IOrder> =
  mongoose.models.order || mongoose.model<IOrder>("order", orderSchema);

export default orderModel;
