"use client";

import { Rocket, Bell, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";

export default function SmartApplyPage() {
  const { setIsLoading } = useLoading();
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#5b6949]/10 to-[#5b6949]/5 border border-[#5b6949]/20">
              <Rocket className="w-16 h-16 text-[#5b6949]" />
            </div>
            <div className="absolute -top-2 -right-2 px-3 py-1 bg-[#5b6949] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-zinc-900">
            Smart Apply
          </h1>
          <p className="text-zinc-600 text-lg leading-relaxed max-w-md mx-auto">
            Automatically apply to hundreds of jobs matching your profile with a single click.
            Let AI handle the applications while you prepare for interviews.
          </p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {[
            { label: "Auto-Match", desc: "AI finds perfect jobs" },
            { label: "One-Click Apply", desc: "Bulk applications" },
            { label: "Track Progress", desc: "Real-time dashboard" },
          ].map((f) => (
            <div
              key={f.label}
              className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm"
            >
              <p className="text-sm font-semibold text-zinc-900">{f.label}</p>
              <p className="text-xs text-zinc-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Notify button */}
        <button
          onClick={() => setNotified(true)}
          disabled={notified}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300",
            notified
              ? "bg-[#5b6949]/10 text-[#5b6949] border border-[#5b6949]/20"
              : "bg-[#5b6949] text-white hover:bg-[#4a573a] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          )}
        >
          {notified ? (
            <>
              <Bell className="w-4 h-4" />
              You&apos;ll be notified!
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Notify Me When Available
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
