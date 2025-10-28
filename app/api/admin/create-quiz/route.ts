import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { title, questions, duration, isActive, description } =
      await req.json();

    if (!title || !duration || !questions || questions.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const quiz = new Quiz({
      title,
      questions,
      duration,
      isActive,
      description,
    });
    await quiz.save();

    return NextResponse.json(
      { message: "Quiz created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error creating quiz ${error}` },
      { status: 500 }
    );
  }
}
