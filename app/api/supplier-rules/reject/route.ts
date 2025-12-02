import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  const rule = await prisma.supplierRule.findUnique({ where: { id } });

  if (!rule) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.supplierRule.update({
    where: { id },
    data: {
      freedCapacity: rule.allocatedCapacity,
      allocatedCapacity: 0
    }
  });

  return Response.json({ success: true, message: "Reservation rejected" });
}
