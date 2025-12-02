import fs from "fs";
import path from "path";
import { format } from "date-fns";
import QRCode from "qrcode";
import { replacePlaceholders, transporter } from "./emailUtils";

interface GoodsItem {
  productType: {
    name: string;
    description?: string;
  };
  quantities: number;
  numberOfPallets: number;
}

async function generateQRCode(bookingId: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(bookingId, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

function formatGoodsDescription(goods: GoodsItem[]): string {
  return goods
    .map((item) => {
      const productName = item.productType.name;
      const quantity = item.quantities;
      const pallets = item.numberOfPallets > 0 ? ` (${item.numberOfPallets} pallets)` : "";
      return `${productName} - ${quantity} units${pallets}`;
    })
    .join("<br />");
}

async function getConfirmationEmailHtml({
  bookingId,
  slotDate,
  locationName,
  deliveryAddress,
  goods,
  companyName,
}: {
  bookingId: string;
  slotDate: string;
  locationName: string;
  deliveryAddress: string;
  goods: GoodsItem[];
  companyName: string;
}): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "emails",
    "bookingConfirmed.html"
  );
  let html = fs.readFileSync(filePath, "utf-8");

  const qrCodeUrl = await generateQRCode(bookingId);
  const goodsDescription = formatGoodsDescription(goods);

  const values = {
    bookingId,
    slotDate: format(new Date(slotDate), "MMMM do, yyyy"),
    locationName,
    deliveryAddress,
    goodsDescription,
    companyName,
    qrCodeUrl,
  };

  return replacePlaceholders(html, values);
}

export async function sendBookingConfirmationEmail(
  to: string,
  bookingId: string,
  slotDate: string,
  locationName: string,
  deliveryAddress: string,
  goods: GoodsItem[],
  companyName: string
): Promise<void> {
  try {
    const html = await getConfirmationEmailHtml({
      bookingId,
      slotDate,
      locationName,
      deliveryAddress,
      goods,
      companyName,
    });

    await transporter.sendMail({
      from: `"Tokić d.d. Yard Management" <${process.env.SMTP_USER}>`,
      to,
      subject: `Booking Confirmed: ${bookingId}`,
      html,
    });

    console.log(`Confirmation email sent to ${to} for booking ${bookingId}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
}