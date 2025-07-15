import { ConnectDB } from "@/db/connection";
import { User } from "@/models/UserModels";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

ConnectDB();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;
    if (!username || !email || !password) {
      return NextResponse.json({
        error: "All Fields are Required",
        status: 400,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        error: "User Already Exist With this email",
        status: 400,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashPassword,
    });

    const savedUser = await newUser.save();

    const VerifyEmail = await sendEmail({
      email: email,
      emailType: "VERIFY",
      UserId: savedUser._id,
    });

    return NextResponse.json({
      message: "User Register SuccessFully",
      success: true,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}