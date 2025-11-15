import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configure these in your .env
  const APP_NAME = process.env.APP_NAME || "RentHarbor";
  const FRONTEND_VERIFY_URL =
    process.env.FRONTEND_VERIFY_URL || "http://localhost:5174";
  const LOGO_URL = process.env.LOGO_URL || "https://ibb.co.com/BHfVrTpk";
  const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.EMAIL_USER;
  // build a friendly verify link (frontend can read query params)
  const verifyLink = `${FRONTEND_VERIFY_URL}?email=${encodeURIComponent(
    email
  )}&code=${encodeURIComponent(code)}`;

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      /* Mobile-friendly base */
      @media only screen and (max-width: 620px) {
        .container { width: 100% !important; padding: 16px !important; }
        .hero { padding: 24px !important; }
        .otp { font-size: 28px !important; letter-spacing: 6px !important; }
        .btn { display:block !important; width:100% !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0f172a;">
    <!-- Preheader (hidden preview text) -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#fff; opacity:0;">
      Your ${APP_NAME} verification code — valid for 10 minutes.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" class="container" width="600" style="width:600px; max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(15,23,42,0.08);">
            <!-- Header -->
            <tr>
              <td style="padding:20px 28px; border-bottom:1px solid rgba(15,23,42,0.06);">
                <table role="presentation" width="100%">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="https://i.ibb.co.com/bj6g2N0t/favicon.png" alt="${APP_NAME} logo" width="36" style="display:block; border:0; outline:none;" />
                    </td>
                    <td style="text-align:right; font-size:14px; color:#0f172a;">
                      <strong style="font-size:15px; color:#FD6C23;">${APP_NAME}</strong><br/>
                      Verify your account
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Hero -->
            <tr>
              <td class="hero" style="padding:32px 28px 20px;">
                <h1 style="margin:0 0 8px; font-size:20px; letter-spacing:-0.2px;">Verify your email address</h1>
                <p style="margin:0 0 18px; color:#0f172a; line-height:1.5;">
                  Use the code below to complete your registration. This code will expire in <strong>10 minutes</strong>.
                </p>

                <!-- OTP box -->
                <div style="margin:20px 0; text-align:center;">
                  <div style="display:inline-block; background:linear-gradient(90deg,#eef2ff,#f8fafc); padding:26px 34px; border-radius:10px; border:1px solid rgba(15,23,42,0.04);">
                    <div style="font-size:36px; font-weight:700; letter-spacing:8px; color:#0f172a;" class="otp">
                      ${code}
                    </div>
                  </div>
                </div>

                <hr style="border:none; border-top:1px solid rgba(15,23,42,0.06); margin:20px 0;" />
                <p style="margin:0; font-size:13px; color:#94a3b8;">
                  Didn't request this? You can safely ignore this email or contact our support at <a href="mailto:${SUPPORT_EMAIL}" style="color:#FD6C23;">${SUPPORT_EMAIL}</a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px; background:#fbfdff; font-size:12px; color:#94a3b8;">
                <table role="presentation" width="100%">
                  <tr>
                    <td>
                      ${APP_NAME} • Building great experiences<br/>
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </td>
                    <td style="text-align:right;">
                      <a href="#" style="color:#94a3b8; text-decoration:none;">Unsubscribe</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // Plain-text fallback
  const text = `Your ${APP_NAME} verification code is: ${code}
It will expire in 10 minutes.

Verify here: ${verifyLink}

If you didn't request this, contact support: ${SUPPORT_EMAIL}
`;

  await transporter.sendMail({
    from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${APP_NAME} — Your verification code`,
    text,
    html,
  });
};
