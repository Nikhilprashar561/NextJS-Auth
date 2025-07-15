import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const auth = (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({ error: "Token not get" }, { status: 500 });
    }
    const decodeToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    if (!decodeToken) {
      return NextResponse.json(
        { error: "Data was not get in token" },
        { status: 500 }
      );
    }
    return decodeToken.id;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
