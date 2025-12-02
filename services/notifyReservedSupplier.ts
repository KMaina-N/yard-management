import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { format } from "date-fns";
import { replacePlaceholders, transporter } from "./emailUtils";



// Read HTML and replace placeholders
async function getEmailHtml({
  supplierName,
  allocatedCapacity,
  formattedDate,
  dayName,
  declineLink,
  dashboardLink = "#",
  manageSlotsLink = "#",
  supportLink = "#",
}: {
  supplierName: string;
  allocatedCapacity: number;
  formattedDate: string;
  dayName: string;
  declineLink: string;
  dashboardLink?: string;
  manageSlotsLink?: string;
  supportLink?: string;
}) {
  const filePath = path.join(process.cwd(), "emails", "specialRuleNotification.html");
  let html = fs.readFileSync(filePath, "utf-8");

  console.log("REJECT LINK:", declineLink);

  const values = {
    supplierName,
    allocatedCapacity: allocatedCapacity.toString(),
    nextSlotDate: format(new Date(formattedDate), "MMMM do, yyyy"),
    dayOfWeek: dayName,
    declineLink,
    dashboardLink,
    manageSlotsLink,
    supportLink,
  };

  return replacePlaceholders(html, values);
}

// Send email
export async function sendSupplierEmail(
  to: string,
  supplierRuleId: string,
  allocatedCapacity: number,
  supplierName: string,
  formattedDate: string,
  dayName: string
) {
  const declineLink = `${process.env.NEXT_PUBLIC_API_URL}/slot-verification?id=${supplierRuleId}`;
  const html = await getEmailHtml({ supplierName, allocatedCapacity, formattedDate, dayName, declineLink });

  await transporter.sendMail({
    from: `"Your Company" <${process.env.SMTP_USER}>`,
    to,
    subject: `Reservation Notification for ${formattedDate}`,
    html,
  });
}
