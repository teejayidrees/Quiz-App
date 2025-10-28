import mongoose, { Schema, Document, models } from "mongoose";

interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuiz extends Document {
  title: string;
  questions: IQuestion[];
  description: string;
  duration: number;
  isActive: boolean;
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      },
    ],
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    isActive: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
