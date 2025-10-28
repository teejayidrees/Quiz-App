import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Result from "@/models/Result";
import User from "@/models/User";
import Quiz from "@/models/Quiz";

export async function GET(_: Request, context: { params: { userId: string } }) {
  const { userId } = await context.params;

  try {
    await dbConnect();

    const results = await Result.find({ userId }).sort({ createdAt: -1 });

    const user = await User.findById(userId).select("name email");

    const data = await Promise.all(
      results.map(async (res) => {
        const quiz = await Quiz.findById(res.quizId).select("title");
        return {
          userName: user ? user.name : "Deleted User",
          email: user ? user.email : "N/A",
          quiz: quiz ? quiz.title : "Deleted Quiz",
          quizId: quiz ? quiz._id : "No Quiz",
          score: res.score,
          totalQuestions: res.totalQuestions,
          answers: res.answers,
          date: res.createdAt,
          userId: user._id,
          timeRemaining: res.timeRemaining,
          baseScore: res.baseScore,
        };
      })
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user results" },
      { status: 500 }
    );
  }
}
