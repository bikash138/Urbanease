import { escapeHtmlAttr, escapeHtmlText } from "./html-escape";

export type PasswordResetTemplateParams = {
  siteUrl: string;
  resetLink: string;
};

export function renderPasswordResetHtml({
  siteUrl,
  resetLink,
}: PasswordResetTemplateParams): string {
  const safeSiteHref = escapeHtmlAttr(siteUrl);
  const logoSrc = escapeHtmlAttr(`${siteUrl}/favicon.ico`);
  const safeResetHref = escapeHtmlAttr(resetLink);
  const safeResetText = escapeHtmlText(resetLink);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border-radius:12px;border:1px solid #e4e4e7;box-shadow:0 1px 3px rgba(0,0,0,0.06);overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 8px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td valign="top" style="padding:0;">
                    <a href="${safeSiteHref}" style="text-decoration:none;color:#18181b;">
                      <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.02em;">Urbanease</p>
                    </a>
                    <h1 style="margin:12px 0 0 0;font-size:22px;line-height:1.3;font-weight:700;color:#18181b;">Reset your password</h1>
                  </td>
                  <td valign="top" align="right" width="56" style="padding:0 0 0 16px;">
                    <a href="${safeSiteHref}" style="text-decoration:none;display:inline-block;">
                      <img src="${logoSrc}" width="40" height="40" alt="Urbanease" style="display:block;border:0;border-radius:10px;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 24px 28px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;color:#3f3f46;">
                We received a request to reset the password for your account. Open this link in your browser to choose a new password:
              </p>
              <p style="margin:0;padding:14px 16px;background-color:#fafafa;border:1px solid #e4e4e7;border-radius:8px;font-size:13px;line-height:1.5;word-break:break-all;">
                <a href="${safeResetHref}" style="color:#18181b;text-decoration:underline;">${safeResetText}</a>
              </p>
              <p style="margin:20px 0 0 0;font-size:14px;line-height:1.5;color:#71717a;">
                This link expires in <strong style="color:#3f3f46;">15 minutes</strong>. If you did not ask for a reset, you can ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px 28px;border-top:1px solid #f4f4f5;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#a1a1aa;">
                Sent by <a href="${safeSiteHref}" style="color:#71717a;text-decoration:underline;">Urbanease</a>. Do not reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
