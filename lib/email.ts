// Email sending stub. Wire this to Resend / Postmark / SES in production by
// implementing `sendEmail`. For now it logs so flows (team invites, password
// resets) work end-to-end without an email provider configured.

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  // TODO: replace with a real transactional email provider.
  console.log(
    `[email] → ${message.to} | ${message.subject}\n${message.html}`,
  );
}

export async function sendTeamInvite(
  to: string,
  inviterName: string,
  role: string,
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://thepostpilot.vercel.app";
  await sendEmail({
    to,
    subject: `${inviterName} invited you to PostPilot`,
    html: `<p>${inviterName} invited you to join their PostPilot team as a <strong>${role}</strong>.</p>
           <p><a href="${appUrl}/auth/signup">Accept the invitation</a></p>`,
  });
}
