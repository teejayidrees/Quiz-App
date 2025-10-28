import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Result from "@/models/Result";
import User from "@/models/User";
import Quiz from "@/models/Quiz";
import { getStoredAdminToken } from "@/lib/auth";

export async function GET() {
  try {
    // const adminToken = getStoredAdminToken();
    // if (!adminToken) {
    //   return NextResponse.json(
    //     { message: "Authentication Required(not admin!!)" },
    //     { status: 500 }
    //   );
    // }
    await dbConnect();
    const results = await Result.find({});
    const data = await Promise.all(
      results.map(async (res) => {
        const user = await User.findById(res.userId).select("name email _id");
        if (!user) return null;
        const quiz = await Quiz.findById(res.quizId).select("title");

        return {
          userId: user ? user._id : "No userId",
          user: user ? user.name : "Deleted User",
          email: user ? user.email : "N/A",
          quiz: quiz ? quiz.title : "Deleted Quiz",
          quizId: quiz ? quiz._id : "no quiz",
          score: res.score,
          baseScore: res.baseScore,
          totalQuestions: res.totalQuestions,
          date: res.createdAt,
        };
      })
    );
    // ✅ Filter out null entries
    const filtered = data.filter((entry) => entry !== null);
    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching results" },
      { status: 500 }
    );
  }
}
