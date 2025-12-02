import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Utility to replace all placeholders
function replacePlaceholders(html: string, values: Record<string, string>) {
  for (const key in values) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, values[key]);
  }
  return html;
}

export { transporter, replacePlaceholders };