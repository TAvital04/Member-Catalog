/**
 * @file eventBackingPresets.ts
 * @description Dynamic community backing taxonomy presets for IEEE USF Chapter Events & Workshops.
 * Derives contextual backing focus options, descriptions, and non-intimidating placeholder hints
 * automatically from the event's category without requiring custom pages.
 */

import { EventCategory } from "@/data/events";

export interface EventBackingPreset {
  heading: string;
  scopeSummary: string;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}

export function getEventBackingPreset(category?: EventCategory | string): EventBackingPreset {
  switch (category) {
    case "Technical Workshop":
      return {
        heading: "Workshop Materials & Student Lab Backing",
        scopeSummary:
          "Backing directly supports lab tools, test equipment, and hands-on technical training for student participants. Unlike corporate sponsorships, there are no marketing contracts or formal deliverables—just direct support for hands-on engineering development.",
        options: [
          { value: "Lab Tools & Test Equipment Support", label: "Lab Tools & Test Equipment Support" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Spare lab equipment, soldering rework tools, or testing gear",
      };

    case "Competition & Hackathon":
      return {
        heading: "Competition Hardware & Student Prize Backing",
        scopeSummary:
          "Backing directly funds student hackathon awards, sensor breakout kits, and late-night sprint food. Unlike corporate sponsorships, there are no marketing contracts or formal deliverables—just direct fuel for student engineering competitions.",
        options: [
          { value: "Student Prize Pool & Awards", label: "Student Prize Pool & Achievement Awards" },
          { value: "Hardware Hack Pack", label: "Hardware Hack Pack (Sensors, MCUs, Prototyping Wires)" },
          { value: "24-Hour Midnight Sprint Fuel", label: "24-Hour Midnight Sprint Fuel & Refreshments (Food & Drinks)" },
          { value: "Competition Cloud & Dev Resources", label: "Competition Cloud & Dev Resources" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Contribution toward hackathon prizes, sensor packs, or late-night fuel",
      };

    case "General Body Meeting":
      return {
        heading: "General Body Meeting & Member Welcome Backing",
        scopeSummary:
          "Backing provides meeting catering, refreshments, and hospitality for attending engineering students.",
        options: [
          { value: "Meeting Refreshments & Catering", label: "Meeting Refreshments & Catering (Food & Drinks)" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Sponsoring meeting catering, pizza, drinks, snacks, or general support",
      };

    case "Career & Networking":
      return {
        heading: "Career Development & Professional Session Backing",
        scopeSummary:
          "Backing equips engineering undergraduates with printed resume folios, professional networking refreshments, and career prep materials. There are no corporate recruitment quotas or formal agreements required.",
        options: [
          { value: "Networking Reception Refreshments", label: "Networking Reception Refreshments & Coffee (Food & Drinks)" },
          { value: "Printed Resume Portfolios & Name Tags", label: "Printed Resume Portfolios & Lanyard Supplies" },
          { value: "Professional Preparation Materials", label: "Professional Preparation Supplies" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Sponsoring networking coffee, printed materials, or event prep supplies",
      };

    case "Industry Tech Talk":
      return {
        heading: "Technical Seminar & Guest Speaker Backing",
        scopeSummary:
          "Backing supports coffee, refreshments, and hospitality for students attending technical guest lectures.",
        options: [
          { value: "Seminar Refreshments & Coffee", label: "Seminar Refreshments & Coffee (Food & Drinks)" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Sponsoring post-talk refreshments, coffee, snacks, or general support",
      };

    case "Special Event & Tour":
      return {
        heading: "Field Tour & Special Event Student Backing",
        scopeSummary:
          "Backing subsidizes student bus transit, PPE safety equipment, and admission badges for industry facility and space center visits. Community backing ensures all students can participate regardless of personal financial resources.",
        options: [
          { value: "Student Transportation & Bus Subsidies", label: "Student Transportation & Bus Subsidies" },
          { value: "PPE Safety Gear & Tour Badges", label: "PPE Safety Gear (Safety Vests, Eyewear) & Badges" },
          { value: "Group Travel Fuel & Box Lunches", label: "Group Travel Refreshments & Box Lunches (Food & Drinks)" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Subsidizing student tour transport, group lunch, or safety PPE",
      };

    default:
      return {
        heading: "Event Supplies & Student Community Backing",
        scopeSummary:
          "Backing directly supplies our student engineers with workshop materials, event supplies, and lab hospitality. Unlike corporate sponsorships, there are no marketing contracts or formal deliverables—just direct support for student engineering.",
        options: [
          { value: "Student Event Supplies & Materials", label: "Student Event Supplies & Materials" },
          { value: "Event Food & Hospitality", label: "Event Catering & Refreshments (Food & Drinks)" },
          { value: "Technical Equipment Support", label: "Technical Equipment Support" },
          { value: "Other / General Support", label: "Other / General Support" },
        ],
        placeholder: "e.g. Spare components, lab tools, event supplies, or team snacks",
      };
  }
}
