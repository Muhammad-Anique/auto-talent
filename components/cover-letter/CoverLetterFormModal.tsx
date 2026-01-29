"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Mail, Sparkles, Send, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverLetterFormModalProps {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, jobDescription: string, tone: number) => void;
}

const CoverLetterFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  modalTitle,
}: CoverLetterFormModalProps) => {
  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState(5); // Default tone to 5 (neutral)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, jobDescription, tone);
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <Card
        className={cn(
          "relative w-full max-w-2xl p-0 overflow-hidden",
          "bg-white/90 backdrop-blur-xl border-white/40 shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-300",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "relative px-8 pt-6 pb-4 border-b",
            "bg-gradient-to-r from-zinc-50/80 to-gray-50/80",
            "border-zinc-200/40",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60",
              )}
            >
              <Mail className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-zinc-900">
                {modalTitle}
              </h2>
              <p className="text-sm text-zinc-600 mt-1">
                Create a professional follow-up email that stands out
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn(
                "h-8 w-8 rounded-lg",
                "text-zinc-500 hover:text-zinc-700",
                "hover:bg-zinc-100/80 transition-all duration-200",
              )}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-zinc-700"
              >
                Email Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Follow-up for Software Engineer Position"
                className={cn(
                  "w-full transition-all duration-200",
                  "border-zinc-200 focus:border-[#5b6949]",
                  "focus:ring-2 focus:ring-[#5b6949]/20",
                  "bg-white/60 backdrop-blur-sm",
                )}
                required
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label
                htmlFor="jobDescription"
                className="text-sm font-medium text-zinc-700"
              >
                Job Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to help AI create a personalized email..."
                rows={5}
                className={cn(
                  "w-full resize-none transition-all duration-200",
                  "border-zinc-300 border focus:border-[#5b6949]",
                  "focus:ring-2 focus:ring-[#5b6949]/20",
                  "bg-white/60 backdrop-blur-sm",
                )}
                required
              />
            </div>

            {/* Tone Slider */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#5b6949]" />
                <Label
                  htmlFor="tone"
                  className="text-sm font-medium text-zinc-700"
                >
                  Email Tone
                </Label>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Formal</span>
                  <span className="text-[#5b6949] font-medium">
                    Current: {tone}/10
                  </span>
                  <span>Casual</span>
                </div>

                <div className="relative">
                  <input
                    id="tone"
                    type="range"
                    min="1"
                    max="10"
                    value={tone}
                    onChange={(e) => setTone(Number(e.target.value))}
                    className={cn(
                      "w-full h-2 rounded-lg appearance-none cursor-pointer",
                      "bg-zinc-200 slider-thumb",
                    )}
                  />
                  <style jsx>{`
                    .slider-thumb::-webkit-slider-thumb {
                      appearance: none;
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #5b6949;
                      cursor: pointer;
                      box-shadow: 0 2px 6px rgba(91, 105, 73, 0.3);
                      transition: all 0.2s ease;
                    }
                    .slider-thumb::-webkit-slider-thumb:hover {
                      transform: scale(1.1);
                      box-shadow: 0 4px 12px rgba(91, 105, 73, 0.4);
                    }
                    .slider-thumb::-moz-range-thumb {
                      height: 20px;
                      width: 20px;
                      border-radius: 50%;
                      background: #5b6949;
                      cursor: pointer;
                      border: none;
                      box-shadow: 0 2px 6px rgba(91, 105, 73, 0.3);
                    }
                  `}</style>
                </div>

                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Professional & Reserved</span>
                  <span>Friendly & Approachable</span>
                </div>
              </div>
            </div>

            {/* Tone Preview */}
            <div
              className={cn(
                "p-4 rounded-lg border transition-all duration-200",
                tone <= 3
                  ? "bg-blue-50 border-blue-200"
                  : tone <= 7
                    ? "bg-amber-50 border-amber-200"
                    : "bg-green-50 border-green-200",
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#5b6949]" />
                <span className="text-sm font-medium text-zinc-700">
                  Tone Preview
                </span>
              </div>
              <p className="text-xs text-zinc-600">
                {tone <= 3
                  ? "Your email will have a formal, professional tone suitable for corporate environments."
                  : tone <= 7
                    ? "Your email will have a balanced tone that's professional yet approachable."
                    : "Your email will have a friendly, casual tone that's warm and engaging."}
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "px-8 py-4 border-t",
            "bg-gradient-to-r from-zinc-50/50 to-gray-50/50",
            "border-zinc-200/40",
          )}
        >
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className={cn(
                "border-zinc-200 text-zinc-600",
                "hover:bg-zinc-50 hover:border-zinc-300",
                "transition-all duration-200",
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={cn(
                "text-white shadow-lg hover:shadow-xl transition-all duration-500",
                "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
                "group",
              )}
            >
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              Create Email
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoverLetterFormModal;
