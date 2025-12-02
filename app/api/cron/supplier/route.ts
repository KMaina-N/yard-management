import { addDays, format } from "date-fns";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    // Lazy imports
    const { prisma } = await import("@/lib/prisma");
    const { encodeId } = await import("@/lib/crpyto");
    const { sendSupplierEmail } = await import("@/services/notifyReservedSupplier");

    const today = new Date();
    const targetDay = format(addDays(today, 4), "EEEE"); // e.g., Monday

    // Step 1: Restore freedCapacity if applicable
    const rulesToRestore = await prisma.supplierRule.findMany({
      where: {
        freedCapacity: { gt: 0 },
        allocatedCapacity: 0,
      },
    });

    for (const rule of rulesToRestore) {
      await prisma.supplierRule.update({
        where: { id: rule.id },
        data: { allocatedCapacity: rule.freedCapacity, freedCapacity: 0 },
      });
    }

    // Step 2: Find rules matching the target day and with capacity
    const rules = await prisma.supplierRule.findMany({
      where: {
        day: targetDay,
        allocatedCapacity: { gt: 0 },
        deliveryEmail: { not: "" },
      },
    });

    console.log(`Found ${rules.length} supplier rules for ${targetDay}`);

    // Send email to each supplier
    for (const rule of rules) {
      const reservedDate = addDays(today, 5);
      const formattedDate = reservedDate.toISOString();
      const dayName = format(reservedDate, "EEEE");

      const encodedId = encodeId(rule.id);

      await sendSupplierEmail(
        rule.deliveryEmail,
        encodedId,
        rule.allocatedCapacity,
        rule.supplierName,
        formattedDate,
        dayName
      );
    }

    return new Response(JSON.stringify({ sent: rules.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending supplier notifications:", error);
    return new Response(JSON.stringify({ error: "Failed to send notifications" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
