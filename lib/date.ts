// utils/date.ts
export function formatDateDDMMYYYY(date?: Date | string | null): string {
  if (!date) return "";

  const dateStr = date instanceof Date ? date.toISOString().split("T")[0] : undefined;

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "";



    const day = dateStr ? dateStr.split("-")[2] : "";
    const month = dateStr ? dateStr.split("-")[1] : "";
    const year = dateStr ? dateStr.split("-")[0] : "";

  return `${day}-${month}-${year}`;
    // return dateStr || "";
}
