import mongoose, { Document, Model, Schema } from "mongoose";

interface IReview extends Document {
  userId: string;
  rating: number;
  comment?: string;
}

interface IFood extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  day: string;
  timeSlot: string;
  reviews: IReview[];
  averageRating: number;
}

const reviewSchema: Schema<IReview> = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String }
});

const foodSchema: Schema<IFood> = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  day: { type: String, required: true },
  timeSlot: { type: String, required: true },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }
});

const foodModel: Model<IFood> = mongoose.models.food || mongoose.model<IFood>("food", foodSchema);
export {IFood, IReview};
export default foodModel;
