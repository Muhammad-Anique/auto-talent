"use client";

import { Resume } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";
import FollowUpEmail from "@/components/follow-up-email/follow-up-email";
import { useState } from "react";

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  // percentWidth: number;
}

export function PreviewPanel({
  resume,
  // onResumeChange,
  width,
}: PreviewPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'basic' | 'modern' | 'professional'>('basic');

  // Debug log when template changes
  console.log('PreviewPanel - Selected template:', selectedTemplate);

  return (
    <ScrollArea
      className={cn(
        " z-50     bg-red-500 h-full",
        resume.is_base_resume
          ? "bg-purple-50/30"
          : "bg-pink-50/60 shadow-sm shadow-pink-200/20"
      )}
    >
      <div className="">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              selectedTemplate === "basic"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedTemplate("basic")}
          >
            Sidebar Dark
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedTemplate === "modern"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedTemplate("modern")}
          >
            Sidebar Accent
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedTemplate === "professional"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedTemplate("professional")}
          >
            Patterned Header
          </button>
        </div>

        <ResumeContextMenu resume={resume}>
          <ResumePreview
            resume={resume}
            containerWidth={width}
            template={selectedTemplate}
          />
        </ResumeContextMenu>
      </div>

      <CoverLetter containerWidth={width} />
      <FollowUpEmail containerWidth={width} />
    </ScrollArea>
  );
}
