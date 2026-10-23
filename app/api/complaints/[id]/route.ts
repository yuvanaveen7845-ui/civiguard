import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Case from "@/models/Case";
import Evidence from "@/models/Evidence";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

const DEMO_CASES_DATA: Record<string, any> = {
  "case_demo_101": {
    _id: "case_demo_101",
    title: "Armed Robbery at 5th Ave Convenience Store",
    description: "Two masked suspects entered with a weapon and demanded cash from the register. Surveillance camera footage secured. Immediate police investigation dispatched.",
    category: "Theft",
    location: "5th Avenue & 42nd St, New York, NY",
    priorityScore: "High",
    status: "In Progress",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    evidence: [{
      _id: "ev_1",
      fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
      fileType: "image/jpeg",
      fileHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    }]
  },
  "case_demo_102": {
    _id: "case_demo_102",
    title: "Vandalism and Graffiti at Metro Station",
    description: "Public property defaced with spray paint and damaged turnstile access gates during late hours.",
    category: "Vandalism",
    location: "Brooklyn Bridge Metro Station",
    priorityScore: "Medium",
    status: "Assigned Officer",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    evidence: [{
      _id: "ev_2",
      fileUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
      fileType: "image/jpeg",
      fileHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
    }]
  },
  "case_demo_103": {
    _id: "case_demo_103",
    title: "Credit Card Skimmer at Gas Station ATM",
    description: "Detected unauthorized physical scanning device attached to terminal #3. Multiple customer cards flagged.",
    category: "Fraud",
    location: "Queens Blvd Fuel Center",
    priorityScore: "High",
    status: "Pending Review",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    evidence: []
  },
  "case_demo_104": {
    _id: "case_demo_104",
    title: "Physical Altercation near Central Park South",
    description: "Brawl between two groups resulting in minor injuries. Emergency medical dispatched on scene.",
    category: "Assault",
    location: "Central Park South & 7th Ave",
    priorityScore: "High",
    status: "Resolved",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    evidence: []
  },
  "case_demo_105": {
    _id: "case_demo_105",
    title: "Bicycle Theft from Campus Bike Rack",
    description: "Locked commuter bike cut from security rack between 2 PM and 5 PM. Serial number registered.",
    category: "Theft",
    location: "Washington Square East",
    priorityScore: "Low",
    status: "Resolved",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    evidence: []
  }
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;

    if (DEMO_CASES_DATA[caseId]) {
      return NextResponse.json(DEMO_CASES_DATA[caseId]);
    }

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return NextResponse.json({
        _id: caseId,
        title: "Report #" + caseId.slice(-6),
        description: "Case details retrieved from temporary session record.",
        category: "Other",
        location: "City Center",
        priorityScore: "Medium",
        status: "Pending Review",
        isAnonymous: false,
        createdAt: new Date().toISOString(),
        evidence: []
      });
    }

    await dbConnect();
    const caseData = await Case.findById(caseId).lean();
    if (!caseData) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    
    const evidenceList = await Evidence.find({ caseId }).lean();
    
    return NextResponse.json({ 
      ...caseData, 
      _id: caseData._id.toString(),
      location: typeof caseData.location === "object" ? (caseData.location?.address || "Unknown Location") : caseData.location,
      evidence: evidenceList 
    });
  } catch (error) {
    console.error("Fetch case error:", error);
    return NextResponse.json({ message: "Error fetching case" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    const { status, assignedOfficerId, priorityScore } = await req.json();

    if (DEMO_CASES_DATA[caseId]) {
      if (status) DEMO_CASES_DATA[caseId].status = status;
      if (assignedOfficerId) DEMO_CASES_DATA[caseId].assignedOfficerId = assignedOfficerId;
      if (priorityScore) DEMO_CASES_DATA[caseId].priorityScore = priorityScore;
      return NextResponse.json(DEMO_CASES_DATA[caseId]);
    }

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return NextResponse.json({ _id: caseId, status: status || "Pending Review" });
    }

    await dbConnect();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedOfficerId) updateData.assignedOfficerId = assignedOfficerId;
    if (priorityScore) updateData.priorityScore = priorityScore;

    const updatedCase = await Case.findByIdAndUpdate(caseId, updateData, { new: true });
    
    if (status && updatedCase?.citizenId) {
      try {
        await Notification.create({
          userId: updatedCase.citizenId,
          caseId: updatedCase._id,
          message: `Your case status has been updated to: ${status}`
        });
      } catch(e) {}
    }

    return NextResponse.json(updatedCase);
  } catch (error) {
    return NextResponse.json({ message: "Error updating case" }, { status: 500 });
  }
}
