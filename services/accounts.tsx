import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { replacePlaceholders, transporter } from "./emailUtils";

async function getEmailHtml(
  templateName: string,
  values: Record<string, string>
) {
  const filePath = path.join(process.cwd(), "emails", `${templateName}.html`);
  let html = fs.readFileSync(filePath, "utf-8");
  return replacePlaceholders(html, values);
}

export async function sendUserPendingVerificationEmail({ to, userName }: any) {
  const html = await getEmailHtml("supplierPendingVerification", {
    userName,
  });
  await transporter.sendMail({
    from: `"Tokić d.d. Yard Management" <${process.env.SMTP_USER}>`,
    to,
    html,
  });
}

export async function sendAdminPendingVerificationEmail({
  to,
  userName,
  userEmail,
  userCompany,
}: {
  to: string;
  userName: string;
  userEmail: string;
  userCompany?: string;
}) {
  const html = await getEmailHtml("adminPendingVerification", {
    userName,
    userEmail,
    userCompany: userCompany || "N/A",
  });

  await transporter.sendMail({
    from: `"Tokić Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: `High Priority: User Pending Verification - ${userName}`,
    html,
  });
}

// ------------------------
// 2️⃣ Supplier Account Activated (sent to supplier)
// ------------------------
export async function sendSupplierAccountActivatedEmail({
  to,
  userName,
  userEmail,
  supportLink,
}: {
  to: string;
  userName: string;
  userEmail: string;
  supportLink?: string;
}) {
  const html = await getEmailHtml("supplierActivated", {
    userName,
    userEmail,
    supportLink: supportLink || "#",
  });

  await transporter.sendMail({
    from: `"Tokić d.d. Yard Management" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your Tokic Account Has Been Activated`,
    html,
  });
}
