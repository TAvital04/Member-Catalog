import { AuthAccountType, AuthSession } from "@/hooks/useRoleManager";
import { getPortalUsers } from "@/lib/portalAuthStore";
import { db, portalUsers, eq } from "@/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountType, email, password, organization } = body || {};

    if (accountType !== "rso_leadership" && accountType !== "sponsor") {
      return Response.json(
        { success: false, error: "Please select a valid role (RSO Leadership or Sponsor)." },
        { status: 400 }
      );
    }

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password.trim() : "";

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return Response.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      return Response.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    // 1. Check PostgreSQL portal_users first if database is reachable
    let matchedAccount = getPortalUsers().find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.accountType === accountType
    );

    try {
      const dbUserRows = await db
        .select()
        .from(portalUsers)
        .where(eq(portalUsers.email, cleanEmail))
        .limit(1);

      if (dbUserRows && dbUserRows.length > 0) {
        const dbUser = dbUserRows[0];
        if (dbUser.accountType === accountType) {
          matchedAccount = {
            accountType: dbUser.accountType as AuthAccountType,
            role: dbUser.accountType === "rso_leadership" ? "admin" : "sponsor",
            email: dbUser.email,
            password: dbUser.passwordHash,
            displayName: dbUser.displayName,
            organization: dbUser.organization,
            sponsorId: dbUser.sponsorId || undefined,
          };
        }
      }
    } catch {
      // Fallback to in-memory registry when Postgres is unavailable
    }

    if (matchedAccount && matchedAccount.password !== cleanPassword) {
      return Response.json(
        { success: false, error: "Invalid password for this account." },
        { status: 401 }
      );
    }

    const derivedName = matchedAccount
      ? matchedAccount.displayName
      : accountType === "rso_leadership"
      ? "RSO Leadership Officer"
      : "Corporate Sponsor Representative";

    const derivedOrg = matchedAccount
      ? matchedAccount.organization
      : typeof organization === "string" && organization.trim()
      ? organization.trim()
      : accountType === "rso_leadership"
      ? "IEEE UCF Student Chapter"
      : cleanEmail.split("@")[1]?.split(".")[0]?.toUpperCase() || "Partner Organization";

    const session: AuthSession = {
      accountType,
      role: accountType === "rso_leadership" ? "admin" : "sponsor",
      email: cleanEmail,
      displayName: derivedName,
      organization: derivedOrg,
      signedInAt: new Date().toISOString(),
    };

    return Response.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error?.message || "Authentication failed.",
      },
      { status: 500 }
    );
  }
}
