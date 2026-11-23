import { NextResponse } from "next/server";
import { ResumeBookOptions } from "@/types/resumeBook";
import { compileResumeBookCandidates } from "@/lib/resumeBook";
import { Student } from "@/data/students";
import { getEnrichedMemberList } from "@/lib/candidates";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const major = searchParams.get("major") || undefined;
    const gradYear = searchParams.get("grad") || undefined;
    const sponsorName = searchParams.get("sponsor") || "Corporate Partner";

    const options: ResumeBookOptions = {
      title: "RSO USF Candidate Resume Book",
      sponsorName,
      selectedMajor: major,
      selectedGradYear: gradYear,
      includeGpa: true,
      includeProjects: true,
      includeEvents: true,
      includeDirectResumeLinks: true,
    };

    const students: Student[] = await getEnrichedMemberList("sponsor");

    const compiled = compileResumeBookCandidates(students, options);

    return NextResponse.json({
      success: true,
      meta: {
        total: compiled.length,
        sponsor: sponsorName,
        chapter: "RSO USF Student Chapter",
      },
      candidates: compiled,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate resume book" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { options = {}, candidateIds = [] } = body;

    let students: Student[] = await getEnrichedMemberList("sponsor");

    if (Array.isArray(candidateIds) && candidateIds.length > 0) {
      const idSet = new Set(candidateIds.map((id: string) => String(id).toLowerCase()));
      students = students.filter((s) => idSet.has(s.id.toLowerCase()));
    }

    const compiled = compileResumeBookCandidates(students, options);

    return NextResponse.json({
      success: true,
      meta: {
        total: compiled.length,
        sponsor: options.sponsorName || "Corporate Partner",
        title: options.title || "RSO USF Candidate Resume Book",
      },
      candidates: compiled,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to compile resume book payload" },
      { status: 500 }
    );
  }
}
