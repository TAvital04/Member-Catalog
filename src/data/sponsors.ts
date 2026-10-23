/**
 * @file sponsors.ts — Current IEEE UCF Corporate Sponsors & Industry Partners
 */

export interface ChapterSponsor {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Partner";
  tagline: string;
  website: string;
}

export const CURRENT_CHAPTER_SPONSORS: ChapterSponsor[] = [
  {
    id: "lockheed-martin",
    name: "Lockheed Martin",
    tier: "Platinum",
    tagline: "Aerospace, Defense & Radar Engineering",
    website: "https://www.lockheedmartin.com",
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    tier: "Platinum",
    tagline: "Semiconductors & Embedded Processing",
    website: "https://www.ti.com",
  },
  {
    id: "l3harris",
    name: "L3Harris Technologies",
    tier: "Gold",
    tagline: "Tactical Communications & Avionics",
    website: "https://www.l3harris.com",
  },
  {
    id: "northrop-grumman",
    name: "Northrop Grumman",
    tier: "Gold",
    tagline: "Autonomous Systems & Space Systems",
    website: "https://www.northropgrumman.com",
  },
  {
    id: "siemens-eda",
    name: "Siemens EDA",
    tier: "Silver",
    tagline: "Electronic Design Automation & IC Verification",
    website: "https://eda.sw.siemens.com",
  },
];
