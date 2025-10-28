import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    const token = createToken({
      id: newUser._id.toString(), // convert ObjectId to string
      email: newUser.email,
      name: newUser.name,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "Signup successful",
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Error creating user ${error}` },
      { status: 500 }
    );
  }
}
