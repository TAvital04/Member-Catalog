import { NextResponse } from "next/server";
import { CURRENT_CHAPTER_SPONSORS, getSponsorRelatedData } from "@/data/sponsors";

export async function GET() {
  try {
    const data = CURRENT_CHAPTER_SPONSORS.map((sponsor) => {
      const details = getSponsorRelatedData(sponsor);
      return {
        ...sponsor,
        projectCount: details.projects.length,
        eventCount: details.events.length,
        jobCount: details.jobs.length,
        skillsCount: details.skills.length,
        interactionCount: details.interactions.length,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to fetch sponsors:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
