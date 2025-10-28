import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Quiz from "@/models/Quiz";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    if (!deletedQuiz)
      return NextResponse.json({ message: "NO Quiz found" }, { status: 404 });
    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting quiz ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const { title, description, duration, questions, isActive } =
      await req.json();
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, description, duration, questions, isActive },
      { new: true }
    );
    return NextResponse.json({ updatedQuiz }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating quiz" },
      { status: 500 }
    );
  }
}

export async function GET(_: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  try {
    await dbConnect();

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { message: "Error fetching quiz" },
      { status: 500 }
    );
  }
}
