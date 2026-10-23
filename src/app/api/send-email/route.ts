/**
 * @file route.ts — POST /api/send-email
 * @description Secure outbound transactional email dispatcher leveraging Resend.
 * Enforces rate limiting, recipient authorization, CRLF injection defenses, and configurable admin routing.
 */

import { Resend } from "resend";

// In-memory token bucket rate limiter for DoS / spam protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // max 5 emails per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();

  // Prune expired entries to prevent memory accumulation
  if (rateLimitMap.size > 100) {
    for (const [ip, item] of rateLimitMap.entries()) {
      if (now > item.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }

  const entry = rateLimitMap.get(clientIp);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ieee@ucf.edu";

export async function POST(req: Request) {
  try {
    const clientIp =
      (req.headers && typeof req.headers.get === "function"
        ? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        : null) || "127.0.0.1";

    if (!checkRateLimit(clientIp)) {
      return Response.json(
        { success: false, error: "Too many email requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { to, subject, message, senderName, senderEmail, recipientType } = body || {};

    if (!to || !subject || !message) {
      return Response.json(
        { success: false, error: "Missing required fields: to, subject, or message" },
        { status: 400 }
      );
    }

    // CRLF header injection defenses
    const cleanTo = String(to).replace(/[\r\n]/g, "").trim();
    const cleanSubject = String(subject).replace(/[\r\n]/g, "").trim().slice(0, 200);
    const cleanSenderEmail = senderEmail ? String(senderEmail).replace(/[\r\n]/g, "").trim() : undefined;
    const cleanSenderName = senderName ? String(senderName).replace(/[\r\n]/g, "").trim().slice(0, 100) : "Recruiter";

    // Open relay prevention: Recipient must be a UCF student email or the authorized admin address
    const isAllowedStudent = cleanTo.endsWith("@knights.ucf.edu") || cleanTo.endsWith("@ucf.edu");
    const isAllowedAdmin = cleanTo.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isSenderConfirmation = cleanSenderEmail && cleanTo.toLowerCase() === cleanSenderEmail.toLowerCase();

    if (!isAllowedStudent && !isAllowedAdmin && !isSenderConfirmation) {
      return Response.json(
        { success: false, error: "Email destination address is not permitted by relay policy." },
        { status: 403 }
      );
    }

    const contactDisclaimer =
      `\n\n----------------------------------------\n` +
      `PLEASE NOTE: Do not reply directly to this automated address as inbox replies are unmonitored.\n` +
      `For inquiries or support, please contact the RSO UCF administrative team at ${ADMIN_EMAIL}.`;

    const fullMessage = String(message).slice(0, 5000) + contactDisclaimer;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "RSO UCF Member Catalog <onboarding@resend.dev>";

      const emailResponse = await resend.emails.send({
        from: fromAddress,
        to: [cleanTo],
        subject: cleanSubject,
        text: fullMessage,
        replyTo: cleanSenderEmail || ADMIN_EMAIL,
      });

      if (emailResponse.error) {
        console.error("[Resend Error]", emailResponse.error);
        return Response.json(
          {
            success: false,
            error: emailResponse.error.message || "Failed to deliver email via Resend",
          },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        source: "resend",
        id: emailResponse.data?.id,
        message: `Email dispatched successfully via Resend`,
      });
    }

    // Development fallback simulation mode
    console.log("[Resend Simulation Mode]", {
      to: cleanTo,
      subject: cleanSubject,
      senderName: cleanSenderName,
      senderEmail: cleanSenderEmail,
      recipientType,
    });

    return Response.json({
      success: true,
      source: "simulation",
      message: `Email to ${cleanTo} queued (simulation mode)`,
    });
  } catch (error: any) {
    console.error("[Email API Error]", error);
    return Response.json(
      { success: false, error: error?.message || "Failed to dispatch email notification" },
      { status: 500 }
    );
  }
}
