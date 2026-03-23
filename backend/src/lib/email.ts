import { Resend } from "resend";
import { env } from "../config";
import { renderPasswordResetHtml } from "./email-templates/password-reset.template";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
): Promise<void> {
  const siteUrl = env.FRONTEND_URL.replace(/\/$/, "");
  const html = renderPasswordResetHtml({ siteUrl, resetLink });

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html,
    text: `Reset your password\n\nUse this link (expires in 15 minutes):\n${resetLink}\n\nIf you did not request this, ignore this email.\n\n${siteUrl}\n`,
  });

  if (error) {
    throw new Error(error.message);
  }
}
