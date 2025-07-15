import { ConnectDB } from "@/db/connection";
import { NextRequest, NextResponse } from "next/server";

ConnectDB();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const res = NextResponse.json({
      message: "User Logout Success Fully",
      success: true,
    });

    res.cookies.set("token", "", { httpOnly: true, expires: Date.now() });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
