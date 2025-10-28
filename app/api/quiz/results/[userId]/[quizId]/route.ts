import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Result from "@/models/Result";

export async function DELETE(
  req: Request,
  context: { params: { userId: string; quizId: string } }
) {
  const { userId, quizId } = await context.params;

  try {
    await dbConnect();

    const deleted = await Result.findOneAndDelete({ userId, quizId });

    if (!deleted) {
      return NextResponse.json(
        { message: "No matching result found for this user and quiz." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Test result deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting test result." },
      { status: 500 }
    );
  }
}
