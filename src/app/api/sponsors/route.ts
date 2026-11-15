import { NextResponse } from "next/server";
import { db, chapterSponsors, portalUsers } from "@/db";
import { CURRENT_CHAPTER_SPONSORS, ChapterSponsor } from "@/data/sponsors";
import { registerPortalUser } from "@/lib/portalAuthStore";
import { desc } from "drizzle-orm";

const globalForSponsors = globalThis as unknown as {
  __ieeeDynamicSponsors?: ChapterSponsor[];
};

if (!globalForSponsors.__ieeeDynamicSponsors) {
  globalForSponsors.__ieeeDynamicSponsors = [...CURRENT_CHAPTER_SPONSORS];
}

function getDynamicSponsors(): ChapterSponsor[] {
  return globalForSponsors.__ieeeDynamicSponsors!;
}

export async function GET() {
  try {
    try {
      const dbRows = await db
        .select()
        .from(chapterSponsors)
        .orderBy(desc(chapterSponsors.createdAt));

      if (dbRows && dbRows.length > 0) {
        const results: ChapterSponsor[] = dbRows.map((row) => ({
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
        }));

        return NextResponse.json({
          success: true,
          source: "database",
          data: results,
        });
      }
    } catch (dbError) {
      console.warn(
        "[API Warning] Database query for chapter sponsors encountered error, falling back to dataset:",
        dbError
      );
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      data: getDynamicSponsors(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch chapter sponsors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const role = request.headers.get("x-user-role") || "standard";
    if (role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. RSO Leadership privileges are required to onboard sponsors.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      tier = "Gold",
      logoText,
      tagline,
      description,
      website,
      careersUrl,
      contactEmail,
      location,
      partnerSince,
      primaryFocus = [],
      keySkills = [],
      sponsorLoginPassword,
    } = body || {};

    if (!name || !tagline || !website || !careersUrl || !contactEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: Company Name, Tagline, Website, Careers Portal URL, and Contact Email are required.",
        },
        { status: 400 }
      );
    }

    const cleanName = String(name).trim();
    const cleanSlug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const derivedLogo =
      typeof logoText === "string" && logoText.trim()
        ? logoText.trim().toUpperCase().slice(0, 4)
        : cleanName
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 4) || cleanName.slice(0, 2).toUpperCase();

    const normalizeWebsite = (urlStr: string) => {
      const trimmed = String(urlStr).trim();
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const newSponsor: ChapterSponsor = {
      id: cleanSlug || `sponsor-${Date.now()}`,
      name: cleanName,
      tier: ["Platinum", "Gold", "Silver", "Partner"].includes(tier) ? tier : "Gold",
      tagline: String(tagline).trim(),
      description: description ? String(description).trim() : String(tagline).trim(),
      logoText: derivedLogo,
      website: normalizeWebsite(website),
      careersUrl: normalizeWebsite(careersUrl),
      contactEmail: String(contactEmail).trim().toLowerCase(),
      location: location ? String(location).trim() : "Orlando, FL",
      partnerSince: String(partnerSince || new Date().getFullYear()).trim(),
      primaryFocus: Array.isArray(primaryFocus)
        ? primaryFocus.map((f: string) => String(f).trim()).filter(Boolean)
        : [],
      initiatives: [],
      sponsoredProjectSlugs: [],
      sponsoredEventSlugs: [],
      jobCompanyNames: [cleanName],
      keySkills: Array.isArray(keySkills)
        ? keySkills.map((s: string) => String(s).trim()).filter(Boolean)
        : [],
    };

    // Persist to PostgreSQL chapter_sponsors and portal_users if available
    try {
      await db.insert(chapterSponsors).values({
        id: newSponsor.id,
        name: newSponsor.name,
        tier: newSponsor.tier,
        tagline: newSponsor.tagline,
        description: newSponsor.description,
        logoText: newSponsor.logoText,
        website: newSponsor.website,
        careersUrl: newSponsor.careersUrl,
        contactEmail: newSponsor.contactEmail,
        location: newSponsor.location,
        partnerSince: newSponsor.partnerSince,
        primaryFocus: newSponsor.primaryFocus,
        initiatives: newSponsor.initiatives,
        sponsoredProjectSlugs: newSponsor.sponsoredProjectSlugs,
        sponsoredEventSlugs: newSponsor.sponsoredEventSlugs,
        jobCompanyNames: newSponsor.jobCompanyNames,
        keySkills: newSponsor.keySkills,
        active: true,
      });

      if (sponsorLoginPassword && String(sponsorLoginPassword).trim().length >= 4) {
        await db.insert(portalUsers).values({
          email: newSponsor.contactEmail,
          passwordHash: String(sponsorLoginPassword).trim(),
          accountType: "sponsor",
          displayName: `${newSponsor.name} Partner Account`,
          organization: newSponsor.name,
          sponsorId: newSponsor.id,
          active: true,
        });
      }
    } catch (dbError) {
      console.warn(
        "[API Warning] Could not persist sponsor to Postgres, saving in fallback store:",
        dbError
      );
    }

    // Register sponsor login in fallback auth store as well
    if (sponsorLoginPassword && String(sponsorLoginPassword).trim().length >= 4) {
      registerPortalUser({
        accountType: "sponsor",
        role: "sponsor",
        email: newSponsor.contactEmail,
        password: String(sponsorLoginPassword).trim(),
        displayName: `${newSponsor.name} Partner Account`,
        organization: newSponsor.name,
        sponsorId: newSponsor.id,
      });
    }

    // Update fallback sponsors list
    const store = getDynamicSponsors();
    const existingIndex = store.findIndex((s) => s.id === newSponsor.id);
    if (existingIndex >= 0) {
      store[existingIndex] = newSponsor;
    } else {
      store.unshift(newSponsor);
    }

    return NextResponse.json(
      {
        success: true,
        data: newSponsor,
        message: "Chapter sponsor onboarded successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to onboard chapter sponsor",
      },
      { status: 500 }
    );
  }
}
