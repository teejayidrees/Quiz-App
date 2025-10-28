import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    const token = createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    // Simplified: client handles session in localStorage
    return NextResponse.json(
      {
        message: "Login successful",
        user,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
