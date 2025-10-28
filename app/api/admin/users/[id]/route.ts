import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const deletedUsers = await User.findByIdAndDelete(id);
    if (!deletedUsers)
      return NextResponse.json({ message: "No User found" }, { status: 404 });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error deleting User ${error}` },
      { status: 500 }
    );
  }
}
