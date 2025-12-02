import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

export function AvailabilityBadge({
  available,
  remaining,
}: {
  available: boolean;
  remaining: number | null;
}) {
  if (remaining === null)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 animate-fade-in">
        <HelpCircle className="h-4 w-4" />
        <span className="text-xs">Unscheduled</span>
      </span>
    );

  if (remaining === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-200 text-red-700 px-3 py-1 text-xs font-semibold animate-fade-in">
        <XCircle className="h-4 w-4" />
        <span className="text-xs">Full</span>
      </span>
    );

  if (available && remaining)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-200 text-green-700 px-3 py-1 text-xs font-semibold animate-fade-in">
        <CheckCircle className="h-4 w-4" />
        <span className="text-xs">Available</span>
      </span>
    );

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-200 text-yellow-700 px-3 py-1 text-xs font-semibold animate-fade-in">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-xs">Limited ({remaining})</span>
    </span>
  );
}
