import { ConnectDB } from "@/db/connection";
import { User } from "@/models/UserModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

ConnectDB();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    if (!email || !password) {
      return NextResponse.json(
        { error: "All Fields are required" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found with this email" },
        { status: 400 }
      );
    }
    const validatePassWord = await bcryptjs.compare(password, user.password);
    if (!validatePassWord) {
      return NextResponse.json(
        { error: "User password was wrong" },
        { status: 400 }
      );
    }
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = await jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const res = NextResponse.json({
      message: "User login success fully",
      success: true,
    });

    res.cookies.set("token", token, { httpOnly: true });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
