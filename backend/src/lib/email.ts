import { Resend } from "resend";
import { env } from "../config";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
): Promise<void> {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    html: `
        <h2>Reset Password</h2>
        <p>Click the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 15 minutes</p>
      `,
  });
  if (error) {
    throw new Error(error.message);
  }
}
