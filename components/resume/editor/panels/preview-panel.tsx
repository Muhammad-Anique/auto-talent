"use client";

import { Resume } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";
import FollowUpEmail from "@/components/follow-up-email/follow-up-email";
import { FileText, Mail, Send } from "lucide-react";

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
  return (
    <ScrollArea className="z-50  h-full bg-zinc-100 ">
      {/* Resume Section */}
      <div className="space-y-4">
        <div className="sticky top-0 z-10 bg-zinc-50 px-6 pt-6 pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <FileText className="w-5 h-5" style={{ color: "#5b6949" }} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-700">
              Resume
            </h2>
          </div>
        </div>
        <div>
          <ResumeContextMenu resume={resume}>
            <ResumePreview
              resume={resume}
              containerWidth={width}
              template="default"
            />
          </ResumeContextMenu>
        </div>
      </div>

      {/* Cover Letter Section - Only for Application Kits */}
      {!resume.is_base_resume && (
        <div className="space-y-4 mt-8">
          <div className="sticky top-0 z-10 bg-zinc-50 px-6 pt-6 pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <Mail className="w-5 h-5" style={{ color: "#5b6949" }} />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-700">
                Cover Letter
              </h2>
            </div>
          </div>
          <div>
            <CoverLetter containerWidth={width} />
          </div>
        </div>
      )}

      {/* Follow-up Email Section - Only for Application Kits */}
      {!resume.is_base_resume && (
        <div className="space-y-4 mt-8 pb-8">
          <div className="sticky top-0 z-10 bg-zinc-50 px-6 pt-6 pb-3 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <Send className="w-5 h-5" style={{ color: "#5b6949" }} />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-700">
                Follow-up Email
              </h2>
            </div>
          </div>
          <div>
            <FollowUpEmail containerWidth={width} />
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
