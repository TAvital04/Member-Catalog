import { NextResponse } from "next/server";
import { db, chapterSponsors } from "@/db";
import { CURRENT_CHAPTER_SPONSORS, ChapterSponsor, SponsorInitiative } from "@/data/sponsors";
import { eq } from "drizzle-orm";

const globalForSponsors = globalThis as unknown as {
  __ieeeDynamicSponsors?: ChapterSponsor[];
};

if (!globalForSponsors.__ieeeDynamicSponsors) {
  globalForSponsors.__ieeeDynamicSponsors = [...CURRENT_CHAPTER_SPONSORS];
}

function getDynamicSponsors(): ChapterSponsor[] {
  return globalForSponsors.__ieeeDynamicSponsors!;
}

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await props.params;
    const sponsorId = params.id.toLowerCase();

    // 1. Check PostgreSQL first
    try {
      const dbRows = await db
        .select()
        .from(chapterSponsors)
        .where(eq(chapterSponsors.id, sponsorId));

      if (dbRows && dbRows.length > 0) {
        const row = dbRows[0];
        const sponsor: ChapterSponsor = {
          id: row.id,
          name: row.name,
          tier: (row.tier as ChapterSponsor["tier"]) || "Gold",
          tagline: row.tagline,
          description: row.description,
          logoText: row.logoText,
          website: row.website,
          careersUrl: row.careersUrl,
          contactEmail: row.contactEmail,
          location: row.location,
          partnerSince: row.partnerSince,
          primaryFocus: Array.isArray(row.primaryFocus) ? row.primaryFocus : [],
          initiatives: Array.isArray(row.initiatives) ? row.initiatives : [],
          sponsoredProjectSlugs: Array.isArray(row.sponsoredProjectSlugs)
            ? row.sponsoredProjectSlugs
            : [],
          sponsoredEventSlugs: Array.isArray(row.sponsoredEventSlugs)
            ? row.sponsoredEventSlugs
            : [],
          jobCompanyNames: Array.isArray(row.jobCompanyNames)
            ? row.jobCompanyNames
            : [row.name],
          keySkills: Array.isArray(row.keySkills) ? row.keySkills : [],
        };

        return NextResponse.json({ success: true, source: "database", data: sponsor });
      }
    } catch (dbError) {
      console.warn("[API Warning] Database query for sponsor failed, checking fallback:", dbError);
    }

    // 2. Check in-memory store
    const store = getDynamicSponsors();
    const match = store.find((s) => s.id.toLowerCase() === sponsorId);
    if (match) {
      return NextResponse.json({ success: true, source: "fallback", data: match });
    }

    return NextResponse.json(
      { success: false, error: "Chapter sponsor not found." },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch sponsor details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const role = request.headers.get("x-user-role") || "standard";
    if (role !== "admin" && role !== "sponsor") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Sponsor or RSO Leadership access is required to update sponsor profiles.",
        },
        { status: 403 }
      );
    }

    const params = await props.params;
    const sponsorId = params.id.toLowerCase();
    const body = await request.json();

    const {
      initiatives,
      newInitiative,
      tagline,
      description,
      careersUrl,
      website,
      location,
      primaryFocus,
    } = body || {};

    // Validate new initiative if submitted
    const VALID_CATEGORIES: SponsorInitiative["category"][] = [
      "Technical Workshops",
      "Lab & Hardware Grants",
      "Recruiting & Careers",
      "Capstone Mentorship",
    ];

    if (newInitiative) {
      if (!newInitiative.title || !String(newInitiative.title).trim()) {
        return NextResponse.json(
          { success: false, error: "Initiative title is required." },
          { status: 400 }
        );
      }
      if (!VALID_CATEGORIES.includes(newInitiative.category)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid program category. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
          },
          { status: 400 }
        );
      }
      if (!newInitiative.description || String(newInitiative.description).trim().length < 15) {
        return NextResponse.json(
          { success: false, error: "Initiative description must be at least 15 characters." },
          { status: 400 }
        );
      }
    }

    // Find current sponsor record to patch
    const store = getDynamicSponsors();
    let currentSponsor = store.find((s) => s.id.toLowerCase() === sponsorId);

    if (!currentSponsor) {
      // Try DB lookup
      try {
        const rows = await db
          .select()
          .from(chapterSponsors)
          .where(eq(chapterSponsors.id, sponsorId));
        if (rows && rows.length > 0) {
          const r = rows[0];
          currentSponsor = {
            id: r.id,
            name: r.name,
            tier: (r.tier as ChapterSponsor["tier"]) || "Gold",
            tagline: r.tagline,
            description: r.description,
            logoText: r.logoText,
            website: r.website,
            careersUrl: r.careersUrl,
            contactEmail: r.contactEmail,
            location: r.location,
            partnerSince: r.partnerSince,
            primaryFocus: Array.isArray(r.primaryFocus) ? r.primaryFocus : [],
            initiatives: Array.isArray(r.initiatives) ? r.initiatives : [],
            sponsoredProjectSlugs: Array.isArray(r.sponsoredProjectSlugs)
              ? r.sponsoredProjectSlugs
              : [],
            sponsoredEventSlugs: Array.isArray(r.sponsoredEventSlugs)
              ? r.sponsoredEventSlugs
              : [],
            jobCompanyNames: Array.isArray(r.jobCompanyNames) ? r.jobCompanyNames : [r.name],
            keySkills: Array.isArray(r.keySkills) ? r.keySkills : [],
          };
        }
      } catch (err) {
        console.warn("[API Warning] Database lookup error during patch:", err);
      }
    }

    if (!currentSponsor) {
      return NextResponse.json(
        { success: false, error: "Chapter sponsor not found." },
        { status: 404 }
      );
    }

    // Build updated initiatives list
    let updatedInitiatives = [...currentSponsor.initiatives];
    if (Array.isArray(initiatives)) {
      updatedInitiatives = initiatives.map((init: any) => ({
        title: String(init.title).trim(),
        category: VALID_CATEGORIES.includes(init.category) ? init.category : "Technical Workshops",
        description: String(init.description).trim(),
        metrics: init.metrics ? String(init.metrics).trim() : undefined,
      }));
    } else if (newInitiative) {
      updatedInitiatives.push({
        title: String(newInitiative.title).trim(),
        category: newInitiative.category,
        description: String(newInitiative.description).trim(),
        metrics: newInitiative.metrics ? String(newInitiative.metrics).trim() : undefined,
      });
    }

    // Prepare updated sponsor object
    const updatedSponsor: ChapterSponsor = {
      ...currentSponsor,
      initiatives: updatedInitiatives,
      tagline: tagline !== undefined ? String(tagline).trim() : currentSponsor.tagline,
      description:
        description !== undefined ? String(description).trim() : currentSponsor.description,
      careersUrl: careersUrl !== undefined ? String(careersUrl).trim() : currentSponsor.careersUrl,
      website: website !== undefined ? String(website).trim() : currentSponsor.website,
      location: location !== undefined ? String(location).trim() : currentSponsor.location,
      primaryFocus: Array.isArray(primaryFocus)
        ? primaryFocus.map((f: string) => String(f).trim()).filter(Boolean)
        : currentSponsor.primaryFocus,
    };

    // 1. Update in PostgreSQL if reachable
    try {
      await db
        .update(chapterSponsors)
        .set({
          initiatives: updatedSponsor.initiatives,
          tagline: updatedSponsor.tagline,
          description: updatedSponsor.description,
          careersUrl: updatedSponsor.careersUrl,
          website: updatedSponsor.website,
          location: updatedSponsor.location,
          primaryFocus: updatedSponsor.primaryFocus,
          updatedAt: new Date(),
        })
        .where(eq(chapterSponsors.id, sponsorId));
    } catch (dbError) {
      console.warn("[API Warning] Could not persist sponsor patch to Postgres, updated fallback:", dbError);
    }

    // 2. Update in-memory fallback store
    const storeIdx = store.findIndex((s) => s.id.toLowerCase() === sponsorId);
    if (storeIdx >= 0) {
      store[storeIdx] = updatedSponsor;
    } else {
      store.unshift(updatedSponsor);
    }

    return NextResponse.json({
      success: true,
      data: updatedSponsor,
      message: "Sponsor initiatives and partner profile updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to update sponsor initiatives and profile.",
      },
      { status: 500 }
    );
  }
}
