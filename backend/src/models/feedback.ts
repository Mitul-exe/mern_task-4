import mongoose, { Document, Schema, Model } from "mongoose";

interface IFeedback extends Document {
    name: string;
    email: string;
    feedback: string;
    rating: number;
}

const feedbackSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
});

const Feedback: Model<IFeedback> = mongoose.model<IFeedback>("Feedback", feedbackSchema);

export default Feedback;