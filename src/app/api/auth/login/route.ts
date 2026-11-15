import { AuthAccountType, AuthSession } from "@/hooks/useRoleManager";

interface PreconfiguredAccount {
  accountType: AuthAccountType;
  role: "admin" | "sponsor";
  email: string;
  password: string;
  displayName: string;
  organization: string;
}

const PRECONFIGURED_ACCOUNTS: PreconfiguredAccount[] = [
  {
    accountType: "rso_leadership",
    role: "admin",
    email: "leadership@ieeeucf.org",
    password: "ieee-ucf-leadership",
    displayName: "IEEE UCF Executive Board",
    organization: "IEEE UCF Student Chapter",
  },
  {
    accountType: "rso_leadership",
    role: "admin",
    email: "president@ieeeucf.org",
    password: "ieee-ucf-leadership",
    displayName: "Chapter President",
    organization: "IEEE UCF Student Chapter",
  },
  {
    accountType: "sponsor",
    role: "sponsor",
    email: "recruiting@lockheedmartin.com",
    password: "ieee-sponsor-access",
    displayName: "University Recruiting Partner",
    organization: "Lockheed Martin",
  },
  {
    accountType: "sponsor",
    role: "sponsor",
    email: "talent@ti.com",
    password: "ieee-sponsor-access",
    displayName: "Engineering Campus Recruiting",
    organization: "Texas Instruments",
  },
];

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

    // Match against preconfigured accounts if email matches, otherwise provision session for valid format
    const matchedAccount = PRECONFIGURED_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.accountType === accountType
    );

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
