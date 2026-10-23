import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const DEFAULT_OFFICERS = [
  { _id: "off_101", name: "Officer Sarah Jenkins", badge: "NYPD-4412" },
  { _id: "off_102", name: "Detective Marcus Vance", badge: "NYPD-8831" },
  { _id: "off_103", name: "Officer Elena Rostova", badge: "NYPD-2190" },
  { _id: "off_104", name: "Captain David Miller", badge: "NYPD-1004" }
];

export async function GET() {
  try {
    try {
      await dbConnect();
      const officers = await User.find({ role: "Police Officer" }).select("_id name").lean();
      if (officers && officers.length > 0) {
        return NextResponse.json(officers);
      }
    } catch(e) {}
    
    return NextResponse.json(DEFAULT_OFFICERS);
  } catch (error) {
    return NextResponse.json(DEFAULT_OFFICERS);
  }
}
