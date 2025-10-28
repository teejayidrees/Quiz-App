import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await dbConnect();
    const quizzes = await Quiz.find({});
    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching quizzes" },
      { status: 500 }
    );
  }
}
