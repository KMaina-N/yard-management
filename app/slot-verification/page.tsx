"use client";

export const dynamic = "force-dynamic"; // prevents build-time prerender and fixes SSR crash

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { decodeId } from "@/lib/crpyto";

type Status = "loading" | "success" | "error";
type ActionType = "confirm" | "decline" | null;

interface ApiResponse {
  message?: string;
}

export default function SlotConfirmation() {
  const [status, setStatus] = useState<Status>("loading");
  const [slotId, setSlotId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const runAsync = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paramsId = params.get("id");
        const action = params.get("action") as ActionType;

        const decoded = await decodeId(paramsId || "");

        if (!decoded) {
          setStatus("error");
          setMessage("Invalid request. Missing slot ID.");
          return;
        }

        setSlotId(decoded);
        setActionType(action);
        submitConfirmation(decoded, action);
      } catch {
        setStatus("error");
        setMessage("Invalid request. Missing slot ID.");
      }
    };

    runAsync();
  }, []);

  const submitConfirmation = async (id: string, action: ActionType) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch(`/api/supplier-rules/reject?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data: ApiResponse = await response.json();
      setStatus("success");
      setMessage(data.message || "Your confirmation has been recorded.");

    } catch (error: any) {
      setStatus("error");
      setMessage(
        error?.message || "Something went wrong. Please try again or contact support."
      );
    }
  };

  return (
    <div className="min-h-screen bg-fafafa flex items-center justify-center p-4">
      <div className="w-full max-w-520px">
        {status === "loading" && (
          <div className="bg-white border border-f0f0f0 rounded-md overflow-hidden">
            <div className="px-12 py-16 flex flex-col items-center">
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5 rounded-full blur-2xl"></div>
                <div className="relative w-14 h-14 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-light tracking-tight mb-3">
                Confirming your delivery slot
              </h2>
              <p className="text-sm text-999 text-center">
                Please wait while we process your submission...
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white border border-f0f0f0 rounded-md overflow-hidden">
            <div className="px-12 py-16 flex flex-col items-center">
              <div className="mb-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 stroke-1" />
              </div>
              <h2 className="text-2xl font-light tracking-tight mb-3">
                {actionType === "confirm" ? "Delivery Confirmed" : "Slot Released"}
              </h2>
              <p className="text-sm text-555 text-center mb-8 leading-relaxed max-w-80">
                {actionType === "confirm"
                  ? "Your delivery slot has been confirmed. You're all set for next week."
                  : "Your slot has been released and is now available for other suppliers."}
              </p>
              <p className="text-xs text-999 mb-6">ID: {slotId}</p>
              <a
                href="/dashboard"
                className="px-6 py-3 bg-000 text-fff text-sm font-semibold rounded-md hover:bg-222 transition-all duration-250 inline-block"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white border border-f0f0f0 rounded-md overflow-hidden">
            <div className="px-12 py-16 flex flex-col items-center">
              <div className="mb-8">
                <AlertCircle className="w-16 h-16 text-999 stroke-1" />
              </div>
              <h2 className="text-2xl font-light tracking-tight mb-3">
                Something went wrong
              </h2>
              <p className="text-sm text-555 text-center mb-8 leading-relaxed max-w-80">
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-000 text-fff text-sm font-semibold rounded-md hover:bg-222 transition-all duration-250"
                >
                  Try Again
                </button>
                <a
                  href="/support"
                  className="px-6 py-3 bg-f5f5f5 text-000 text-sm font-semibold rounded-md border border-e0e0e0 hover:bg-f0f0f0 transition-all duration-250"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
