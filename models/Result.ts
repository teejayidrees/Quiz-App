import mongoose, { Schema, Document, models } from "mongoose";

export interface IResult extends Document {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: [string];
  baseScore: number;
  timeRemaining: number;
}

const ResultSchema = new Schema<IResult>(
  {
    baseScore: { type: Number, required: true },
    userId: { type: String, required: true },
    quizId: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: { type: [String], required: true },
    timeRemaining: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Result || mongoose.model<IResult>("Result", ResultSchema);
