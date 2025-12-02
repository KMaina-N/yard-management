import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import QRCode from "qrcode";

// --- Types ---
interface Product {
  id: string;
  name: string;
}

interface Good {
  type: string;
  quantities: number;
  numberOfPallets: number;
}

interface BookingData {
  goods: Good[];
}

interface PDFConfig {
  logoUrl: string;
  companyName: string;
  supportEmail?: string;
}

// --- Constants ---
const PDF_DEFAULTS = {
  PAGE_WIDTH: 595.28, // A4 width in points
  PAGE_HEIGHT: 841.89, // A4 height in points
  MARGIN: 40,
  COLORS: {
    primary: [64, 108, 226] as [number, number, number],
    secondary: [242, 243, 245] as [number, number, number],
    text: [31, 41, 55] as [number, number, number],
    border: [209, 213, 219] as [number, number, number],
  },
  FONT_SIZES: {
    title: 18,
    heading: 12,
    body: 11,
    footer: 9,
  },
} as const;

// --- Helper Functions ---
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

const generateQRCode = async (bookingId: string, selectedDate: Date, selectedTime: string, selectedBay: number) => {
  try {
    // const baseUrl = process.env.NODE_ENV === "production" 
    //   ? "https://example.com" 
    //   : "http://localhost:3000";
    const baseUrl = "https://reminiscently-sarcophagous-lannie.ngrok-free.dev";
    // Encode the booking data as a query param
    const queryData = encodeURIComponent(JSON.stringify({ bookingId, date: selectedDate, time: selectedTime, bay: selectedBay }));
    const fullUrl = `${baseUrl}/confirmation?data=${queryData}`;

    return await QRCode.toDataURL(fullUrl, {
      margin: 1,
      width: 100,
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

const formatBookingReference = (id: string): string => {
  return id.toUpperCase().slice(0, 12);
};

// --- Main Service ---
export class BookingPDFService {
  private config: PDFConfig;

  constructor(config: PDFConfig) {
    this.config = config;
  }

  private createPDF(): jsPDF {
    return new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
  }

  private addHeader(pdf: jsPDF, logoUrl: string, logoImg: HTMLImageElement): number {
    const { MARGIN } = PDF_DEFAULTS;
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Logo
    pdf.addImage(logoImg, "PNG", MARGIN, MARGIN, 60, 45);

    // Company name
    pdf.setFontSize(PDF_DEFAULTS.FONT_SIZES.heading);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...PDF_DEFAULTS.COLORS.text);
    // pdf.text(this.config.companyName, pageWidth - MARGIN - 100, MARGIN + 10, {
    //   align: "right",
    // });

    // Title
    pdf.setFontSize(PDF_DEFAULTS.FONT_SIZES.title);
    pdf.setFont("helvetica", "bold");
    pdf.text("Booking Confirmation", pageWidth / 2, MARGIN + 70, { align: "center" });

    return MARGIN + 100;
  }

  private addBookingDetails(
    pdf: jsPDF,
    bookingId: string,
    selectedDate: Date,
    selectedTime: string,
    selectedBay: number,
    qrDataUrl: string,
    startY: number
  ): number {
    const { MARGIN } = PDF_DEFAULTS;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const detailsX = MARGIN;
    // const detailsWidth = pageWidth - MARGIN * 2 - 120;
    const detailsWidth = pageWidth - MARGIN * 2


    // Details section background
    pdf.setFillColor(...PDF_DEFAULTS.COLORS.secondary);
    pdf.rect(detailsX, startY, detailsWidth, 90, "F");

    pdf.setFontSize(PDF_DEFAULTS.FONT_SIZES.body);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...PDF_DEFAULTS.COLORS.text);

    let y = startY + 15;
    const lineHeight = 20;

    pdf.text(`Reference: ${formatBookingReference(bookingId)}`, detailsX + 10, y);
    pdf.text(`Date: ${format(selectedDate, "EEEE, MMMM d, yyyy")}`, detailsX + 10, y + lineHeight);
    pdf.text(`Time: ${selectedTime}`, detailsX + 10, y + lineHeight * 2);
    pdf.text(`Bay: ${selectedBay}`, detailsX + 10, y + lineHeight * 3);

    // QR Code
    // const qrX = pageWidth - MARGIN - 100;
    // const qrY = startY;
    // pdf.addImage(qrDataUrl, "PNG", qrX, qrY, 90, 90);

    return startY + 110;
  }

  private addGoodsTable(
    pdf: jsPDF,
    bookingData: BookingData,
    products: Product[],
    startY: number
  ): number {
    const tableBody = bookingData.goods.map((item, idx) => {
      const product = products.find((p) => p.id === item.type);
      return [
        idx + 1,
        product?.name || item.type,
        item.quantities.toString(),
        item.numberOfPallets.toString(),
      ];
    });

    autoTable(pdf, {
      startY,
      head: [["#", "Product", "Quantity", "Pallets"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: PDF_DEFAULTS.COLORS.primary,
        textColor: 255,
        fontStyle: "bold",
        fontSize: PDF_DEFAULTS.FONT_SIZES.body,
        cellPadding: 8,
      },
      bodyStyles: {
        fontSize: PDF_DEFAULTS.FONT_SIZES.body,
        cellPadding: 8,
        textColor: PDF_DEFAULTS.COLORS.text,
      },
      alternateRowStyles: {
        fillColor: PDF_DEFAULTS.COLORS.secondary,
      },
      margin: { left: PDF_DEFAULTS.MARGIN, right: PDF_DEFAULTS.MARGIN },
    });

    return (pdf as any).lastAutoTable.finalY;
  }

  private addTotals(pdf: jsPDF, bookingData: BookingData, startY: number): number {
    const { MARGIN } = PDF_DEFAULTS;

    const totalItems = bookingData.goods.reduce((sum, item) => sum + item.quantities, 0);
    const totalPallets = bookingData.goods.reduce((sum, item) => sum + item.numberOfPallets, 0);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(PDF_DEFAULTS.FONT_SIZES.body);
    pdf.setTextColor(...PDF_DEFAULTS.COLORS.primary);

    const y = startY + 20;
    pdf.text(`Total Items: ${totalItems}`, MARGIN, y);
    pdf.text(`Total Pallets: ${totalPallets}`, MARGIN + 200, y);

    return y + 30;
  }

  private addFooter(pdf: jsPDF): void {
    const { MARGIN } = PDF_DEFAULTS;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const footerY = pageHeight - MARGIN - 30;

    pdf.setFontSize(PDF_DEFAULTS.FONT_SIZES.footer);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...PDF_DEFAULTS.COLORS.text);

    // Divider
    pdf.setDrawColor(...PDF_DEFAULTS.COLORS.border);
    pdf.line(MARGIN, footerY - 10, pageWidth - MARGIN, footerY - 10);

    // Message
    pdf.setFont("helvetica", "italic");
    pdf.text("Thank you for your booking!", pageWidth / 2, footerY + 5, { align: "center" });

    // Support info
    if (this.config.supportEmail) {
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Support: ${this.config.supportEmail}`, pageWidth / 2, footerY + 15, {
        align: "center",
      });
    }
  }

  async generate(
    bookingData: BookingData,
    selectedDate: Date,
    selectedTime: string,
    selectedBay: number,
    products: Product[],
    bookingId: string
  ): Promise<void> {
    try {
      const pdf = this.createPDF();
      const logoImg = await loadImage(this.config.logoUrl);
      const qrDataUrl = await generateQRCode(bookingId, selectedDate, selectedTime, selectedBay);



      let currentY = this.addHeader(pdf, this.config.logoUrl, logoImg);
      currentY = this.addBookingDetails(pdf, bookingId, selectedDate, selectedTime, selectedBay, qrDataUrl, currentY);
      currentY = this.addGoodsTable(pdf, bookingData, products, currentY);
      this.addTotals(pdf, bookingData, currentY);
      this.addFooter(pdf);

      pdf.save(`Booking-${formatBookingReference(bookingId)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

// --- Usage ---
export async function handlePrintPDF(
  bookingData: BookingData,
  selectedDate: Date,
  selectedTime: string,
  selectedBay: number,
  productTypes: Product[],
  bookingId: string
): Promise<void> {
  const pdfService = new BookingPDFService({
    logoUrl: "/logo_truck.png",
    companyName: "Tokic Yard Management",
    supportEmail: "support@tokic.hr",
  });

  await pdfService.generate(bookingData, selectedDate, selectedTime, selectedBay, productTypes, bookingId);
}