import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    if (mongoose.Types.ObjectId.isValid(userId)) {
      try {
        await dbConnect();
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
      } catch(e) {}
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
