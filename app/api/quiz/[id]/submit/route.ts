import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Result from "@/models/Result";
import Quiz from "@/models/Quiz";

export async function POST(req: Request) {
  try {
    const {
      userId,
      quizId,
      totalQuestions,
      answers,
      score,
      baseScore,
      timeRemaining,
    } = await req.json();
    await dbConnect();
    const quiz = await Quiz.findById(quizId);

    if (!quiz)
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    const existing = await Result.findOne({ userId, quizId });
    if (existing) {
      return NextResponse.json(
        { message: "Already submitted" },
        { status: 409 }
      );
    }
    const timeBonus = Math.round(Math.max(0, timeRemaining) * 0.1);
    const normalizedScore = (baseScore / totalQuestions) * 100 + timeBonus;
    const finalScore = Math.min(100, normalizedScore);

    const result = new Result({
      userId,
      quizId,
      answers,
      score: finalScore,
      baseScore,
      timeRemaining,
      totalQuestions,
    });
    console.log(result);
    await result.save();

    return NextResponse.json(
      { message: "Quiz submitted", score },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Error submitting quiz" },
      { status: 500 }
    );
  }
}
