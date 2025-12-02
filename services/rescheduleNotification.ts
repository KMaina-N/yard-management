import fs from "fs";
import path from "path";
import { format } from "date-fns";
import { replacePlaceholders, transporter } from "./emailUtils";

async function getEmailHtml({
  supplierName,
  formattedDate,
  bookingId,
  declineLink,
}: {
  supplierName: string;
  formattedDate: string;
  bookingId: string;
  declineLink: string;
  dashboardLink?: string;
  manageSlotsLink?: string;
  supportLink?: string;
}) {
  const filePath = path.join(process.cwd(), "emails", "rescheduledByAdmin.html");
  let html = fs.readFileSync(filePath, "utf-8");

  console.log("REJECT LINK:", declineLink);

  const values = {
    supplierName,
    nextSlotDate: format(new Date(formattedDate), "MMMM do, yyyy"),
    bookingId,
    declineLink,
  };

  return replacePlaceholders(html, values);
}

export async function sendCustomerRescheduleEmail(
  to: string,
  bookingId: string,
  supplierName: string,
  formattedDate: string,
) {
  const declineLink = `${process.env.NEXT_PUBLIC_API_URL}/slot-verification?id=${bookingId}`;
  const html = await getEmailHtml({ supplierName, formattedDate, bookingId, declineLink });

  await transporter.sendMail({
    from: `"Tokić d.d. Yard Management" <${process.env.SMTP_USER}>`,
    to,
    subject: `Your Booking ${bookingId} Has Been Rescheduled`,
    html,
  });
}
