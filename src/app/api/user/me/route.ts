import { ConnectDB } from "@/db/connection";
import { auth } from "@/helpers/getUserData";
import { User } from "@/models/UserModels";
import { NextRequest, NextResponse } from "next/server";

ConnectDB();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const UserId = await auth(req);
    const user = await User.findById({ _id: UserId }).select("-password");
    return NextResponse.json({
      message: "User Fetch Success fully",
      data: user,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
