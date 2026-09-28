export interface EmailPayload {
  to: string;
  recipientType?: "admin" | "student" | "general";
  subject: string;
  message: string;
  senderName?: string;
  senderEmail?: string;
}

/**
 * Dispatches direct email via server API route (/api/send-email) using Resend.
 */
export async function sendDirectEmail(payload: EmailPayload) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data || !data.success) {
    const errorMsg = data?.error || `Email dispatch failed (Status ${res.status})`;
    console.error("[Email API Dispatch Failed]", errorMsg, data);
    throw new Error(errorMsg);
  }

  return data;
}

// Export alias for backward compatibility
export const sendWeb3FormsEmail = sendDirectEmail;
