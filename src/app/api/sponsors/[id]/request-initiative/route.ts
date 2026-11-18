import { NextResponse } from "next/server";
import { CURRENT_CHAPTER_SPONSORS } from "@/data/sponsors";

interface InitiativeInquiry {
  id: string;
  sponsorId: string;
  sponsorName: string;
  requesterName: string;
  requesterEmail: string;
  title: string;
  category: string;
  proposal: string;
  createdAt: string;
}

// In-memory inquiry log
const globalForInquiries = globalThis as unknown as {
  __sponsorInitiativeInquiries?: InitiativeInquiry[];
};

if (!globalForInquiries.__sponsorInitiativeInquiries) {
  globalForInquiries.__sponsorInitiativeInquiries = [];
}

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await props.params;
    const sponsorId = params.id.toLowerCase();
    const body = await request.json();

    const {
      sponsorName,
      requesterName,
      requesterEmail,
      title,
      category = "Technical Workshops",
      proposal,
    } = body || {};

    if (!requesterEmail || !String(requesterEmail).trim() || !String(requesterEmail).includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid contact email address is required." },
        { status: 400 }
      );
    }

    if (!title || !String(title).trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter an initiative title or topic." },
        { status: 400 }
      );
    }

    if (!proposal || String(proposal).trim().length < 15) {
      return NextResponse.json(
        {
          success: false,
          error: "Please share a few details about what you would like to discuss (min. 15 characters).",
        },
        { status: 400 }
      );
    }

    const matchedSponsor =
      CURRENT_CHAPTER_SPONSORS.find((s) => s.id.toLowerCase() === sponsorId) || null;
    const finalSponsorName = sponsorName || matchedSponsor?.name || "Corporate Partner";

    const inquiry: InitiativeInquiry = {
      id: `inquiry-${Date.now()}`,
      sponsorId,
      sponsorName: finalSponsorName,
      requesterName: requesterName ? String(requesterName).trim() : "Recruiting Lead",
      requesterEmail: String(requesterEmail).trim(),
      title: String(title).trim(),
      category: String(category).trim(),
      proposal: String(proposal).trim(),
      createdAt: new Date().toISOString(),
    };

    globalForInquiries.__sponsorInitiativeInquiries!.unshift(inquiry);

    // Build pre-composed mailto URL for direct email client handoff
    const leadershipEmail = "leadership@rsousf.org";
    const subject = encodeURIComponent(`[Initiative Proposal] ${finalSponsorName} — ${inquiry.title}`);
    const emailBody = encodeURIComponent(
      `Hello RSO USF Chapter Leadership,\n\n` +
      `Our team at ${finalSponsorName} would like to propose a new chapter initiative and start a conversation with your executive board.\n\n` +
      `Initiative Proposal: ${inquiry.title}\n` +
      `Category: ${inquiry.category}\n` +
      `Primary Contact: ${inquiry.requesterName} (${inquiry.requesterEmail})\n\n` +
      `Proposal Details & Conversation Topics:\n${inquiry.proposal}\n\n` +
      `We look forward to speaking with you.\n\n` +
      `Best regards,\n` +
      `${inquiry.requesterName}\n` +
      `${finalSponsorName}`
    );

    const mailtoUrl = `mailto:${leadershipEmail}?subject=${subject}&body=${emailBody}`;

    return NextResponse.json({
      success: true,
      data: inquiry,
      mailtoUrl,
      message: `Initiative request for "${inquiry.title}" has been sent to RSO Leadership.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to submit chapter initiative request.",
      },
      { status: 500 }
    );
  }
}
