import { NextResponse } from "next/server";
import { ShortlistedCandidate } from "@/types/shortlist";

// In-memory fallback and server store for candidate shortlists
let fallbackShortlists: ShortlistedCandidate[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recruiterId = searchParams.get("recruiterId")?.trim().toLowerCase();

    let filtered = [...fallbackShortlists];
    if (recruiterId) {
      filtered = filtered.filter((r) => r.recruiterId?.toLowerCase() === recruiterId);
    }

    return NextResponse.json({
      success: true,
      source: "store",
      data: filtered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load shortlists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      candidateId,
      candidateName,
      candidateEmail,
      candidateMajor,
      gradDate,
      listName = "General",
      notes = "",
      tags = [],
      recruiterId = "default",
    } = body;

    if (!candidateId) {
      return NextResponse.json(
        { success: false, error: "candidateId is required" },
        { status: 400 }
      );
    }

    const newCandidate: ShortlistedCandidate = {
      candidateId,
      candidateName: candidateName || "Candidate",
      candidateEmail: candidateEmail || "",
      candidateMajor: candidateMajor || "",
      gradDate: gradDate || "",
      savedAt: new Date().toISOString(),
      listName,
      notes,
      tags,
      recruiterId: (recruiterId || "default").toLowerCase(),
    };

    const existingIdx = fallbackShortlists.findIndex(
      (c) =>
        c.candidateId.toLowerCase() === candidateId.toLowerCase() &&
        c.recruiterId?.toLowerCase() === (recruiterId || "default").toLowerCase()
    );

    if (existingIdx >= 0) {
      fallbackShortlists[existingIdx] = newCandidate;
    } else {
      fallbackShortlists.unshift(newCandidate);
    }

    return NextResponse.json({
      success: true,
      message: "Candidate saved to shortlist",
      data: newCandidate,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save candidate to shortlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");
    const recruiterId = searchParams.get("recruiterId") || "default";

    if (!candidateId) {
      return NextResponse.json(
        { success: false, error: "candidateId is required" },
        { status: 400 }
      );
    }

    fallbackShortlists = fallbackShortlists.filter(
      (c) =>
        !(
          c.candidateId.toLowerCase() === candidateId.toLowerCase() &&
          c.recruiterId?.toLowerCase() === recruiterId.toLowerCase()
        )
    );

    return NextResponse.json({
      success: true,
      message: "Candidate removed from shortlist",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete candidate from shortlist" },
      { status: 500 }
    );
  }
}
