import { AuthAccountType } from "@/hooks/useRoleManager";

export interface PortalUserRecord {
  accountType: AuthAccountType;
  role: "admin" | "sponsor" | "student";
  email: string;
  password: string;
  displayName: string;
  organization: string;
  sponsorId?: string;
  studentId?: string;
}

const INITIAL_PORTAL_USERS: PortalUserRecord[] = [
  {
    accountType: "student",
    role: "student",
    email: "student@usf.edu",
    password: "student-access",
    displayName: "Alex Rivera",
    organization: "USF Computer Engineering",
    studentId: "candidate-1",
  },
  {
    accountType: "student",
    role: "student",
    email: "alex.rivera@usf.edu",
    password: "student-access",
    displayName: "Alex Rivera",
    organization: "USF Computer Engineering",
    studentId: "candidate-1",
  },
  {
    accountType: "rso_leadership",
    role: "admin",
    email: "leadership@rsousf.org",
    password: "rso-usf-leadership",
    displayName: "RSO USF Executive Board",
    organization: "RSO USF Student Chapter",
  },
  {
    accountType: "rso_leadership",
    role: "admin",
    email: "president@rsousf.org",
    password: "rso-usf-leadership",
    displayName: "Chapter President",
    organization: "RSO USF Student Chapter",
  },
  {
    accountType: "sponsor",
    role: "sponsor",
    email: "recruiting@lockheedmartin.com",
    password: "sponsor-access",
    displayName: "University Recruiting Partner",
    organization: "Lockheed Martin",
    sponsorId: "lockheed-martin",
  },
  {
    accountType: "sponsor",
    role: "sponsor",
    email: "talent@ti.com",
    password: "sponsor-access",
    displayName: "Engineering Campus Recruiting",
    organization: "Texas Instruments",
    sponsorId: "texas-instruments",
  },
];

// Global fallback registry for local dev when Postgres is offline
const globalForAuth = globalThis as unknown as {
  __ieeePortalUsers?: PortalUserRecord[];
};

if (!globalForAuth.__ieeePortalUsers) {
  globalForAuth.__ieeePortalUsers = [...INITIAL_PORTAL_USERS];
}

export function getPortalUsers(): PortalUserRecord[] {
  return globalForAuth.__ieeePortalUsers!;
}

export function registerPortalUser(user: PortalUserRecord): void {
  const store = getPortalUsers();
  const existingIdx = store.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (existingIdx >= 0) {
    store[existingIdx] = user;
  } else {
    store.push(user);
  }
}
