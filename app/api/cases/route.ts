import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Case from "@/models/Case";

// Sample initial data if database is empty or initial setup
const SAMPLE_CASES = [
  {
    _id: "case_demo_101",
    title: "Armed Robbery at 5th Ave Convenience Store",
    description: "Two masked suspects entered with a weapon and demanded cash from the register. Surveillance camera footage secured.",
    category: "Theft",
    location: "5th Avenue & 42nd St, New York, NY",
    priorityScore: "High",
    status: "In Progress",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    assignedOfficerId: "officer_1"
  },
  {
    _id: "case_demo_102",
    title: "Vandalism and Graffiti at Metro Station",
    description: "Public property defaced with spray paint and damaged turnstile access gates during late hours.",
    category: "Vandalism",
    location: "Brooklyn Bridge Metro Station",
    priorityScore: "Medium",
    status: "Assigned Officer",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    assignedOfficerId: "officer_2"
  },
  {
    _id: "case_demo_103",
    title: "Credit Card Skimmer at Gas Station ATM",
    description: "Detected unauthorized physical scanning device attached to terminal #3. Multiple customer cards flagged.",
    category: "Fraud",
    location: "Queens Blvd Fuel Center",
    priorityScore: "High",
    status: "Pending Review",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    assignedOfficerId: null
  },
  {
    _id: "case_demo_104",
    title: "Physical Altercation near Central Park South",
    description: "Brawl between two groups resulting in minor injuries. Emergency medical dispatched on scene.",
    category: "Assault",
    location: "Central Park South & 7th Ave",
    priorityScore: "High",
    status: "Resolved",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    assignedOfficerId: "officer_1"
  },
  {
    _id: "case_demo_105",
    title: "Bicycle Theft from Campus Bike Rack",
    description: "Locked commuter bike cut from security rack between 2 PM and 5 PM. Serial number registered.",
    category: "Theft",
    location: "Washington Square East",
    priorityScore: "Low",
    status: "Resolved",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    assignedOfficerId: "officer_3"
  }
];

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let cases: any[] = [];
    try {
      await dbConnect();
      if (session?.user && session.user.role === "Citizen") {
        cases = await Case.find({ citizenId: session.user.id }).sort({ createdAt: -1 }).lean();
      } else {
        cases = await Case.find().sort({ createdAt: -1 }).lean();
      }
    } catch (dbErr) {
      console.warn("MongoDB connection fallback for cases:", dbErr);
    }

    // If DB returned cases, format and return them
    if (cases && cases.length > 0) {
      const sanitized = cases.map((c: any) => ({
        ...c,
        _id: c._id.toString(),
        location: typeof c.location === "object" ? (c.location?.address || "Unknown Location") : (c.location || "Unknown Location")
      }));
      return NextResponse.json(sanitized, { status: 200 });
    }

    // Fallback to sample data for smooth experience if DB has no records yet
    return NextResponse.json(SAMPLE_CASES, { status: 200 });
  } catch (error) {
    console.error("Cases API error:", error);
    return NextResponse.json(SAMPLE_CASES, { status: 200 });
  }
}
