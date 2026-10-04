/**
 * @file route.ts — POST /api/send-email
 * @description Outbound transactional email dispatcher leveraging the Resend SDK.
 * Used for recruiter inquiry routing, candidate moderation flag notifications, unflag notices,
 * and admin duplicate alerts. Gracefully falls back to simulated delivery when RESEND_API_KEY is not configured in dev.
 *
 * @param {Request} req - JSON body containing { to, subject, message, senderName, senderEmail, recipientType }
 * @returns {Promise<Response>} JSON response with status, delivery id, and dispatch mode
 */

import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, message, senderName, senderEmail, recipientType } = body;

    if (!to || !subject || !message) {
      return Response.json(
        { success: false, error: "Missing required fields: to, subject, or message" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    // Append contact disclaimer instructing recipients not to reply to the automated Resend address
    const contactDisclaimer =
      `\n\n----------------------------------------\n` +
      `PLEASE NOTE: Do not reply directly to this automated email address as inbox replies are unmonitored.\n` +
      `If you have questions or believe there was a mistake, please contact our administrative team directly at ta616249@ucf.edu.`;

    const fullMessage = message.includes("ta616249@ucf.edu")
      ? message + contactDisclaimer
      : message + contactDisclaimer;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const fromAddress = process.env.RESEND_FROM_EMAIL || "UCF Resume Database <onboarding@resend.dev>";

      let emailResponse = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: subject,
        text: fullMessage,
        replyTo: senderEmail || "ta616249@ucf.edu",
      });

      // If testing mode restricts recipients to verified account email, retry sending to owner & ta616249@ucf.edu
      if (
        emailResponse.error &&
        emailResponse.error.name === "validation_error" &&
        emailResponse.error.message.includes("testing emails")
      ) {
        const ownerMatch = emailResponse.error.message.match(/\(([^)]+)\)/);
        const ownerEmail = ownerMatch ? ownerMatch[1] : "tal.avital04@gmail.com";

        console.warn(
          `[Resend Notice] Unverified domain testing mode: Redirecting test email to (${ownerEmail} / ta616249@ucf.edu).`
        );

        emailResponse = await resend.emails.send({
          from: fromAddress,
          to: [ownerEmail],
          subject: `[Test Notice: Target ${to}] ${subject}`,
          text: `[Resend Unverified Domain Notice: Intended Recipient: ${to}]\n\n` + fullMessage,
          replyTo: senderEmail || "ta616249@ucf.edu",
        });

        // Also attempt dispatching to ta616249@ucf.edu if different from account email
        if (ownerEmail !== "ta616249@ucf.edu") {
          resend.emails
            .send({
              from: fromAddress,
              to: ["ta616249@ucf.edu"],
              subject: `[MRD Audit Copy: Target ${to}] ${subject}`,
              text: `[MRD Administrative Copy - Intended Recipient: ${to}]\n\n` + fullMessage,
              replyTo: senderEmail || "ta616249@ucf.edu",
            })
            .catch(() => null);
        }
      }

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
        message: `Direct email sent successfully via Resend (ID: ${emailResponse.data?.id})`,
      });
    }

    // Fallback simulation when RESEND_API_KEY is not configured
    console.log("[Resend Simulation Mode]", { to, subject, senderName, senderEmail, recipientType });

    return Response.json({
      success: true,
      source: "simulation",
      message: `Email to ${to} queued (simulation mode)`,
    });
  } catch (error: any) {
    console.error("[Email API Error]", error);
    return Response.json(
      { success: false, error: error?.message || "Failed to dispatch email notification" },
      { status: 500 }
    );
  }
}
