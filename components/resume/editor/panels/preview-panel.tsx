"use client";

import { Resume } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";
import FollowUpEmail from "@/components/follow-up-email/follow-up-email";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { DesignedResumePreview } from "../preview/designed-resume-preview";
import { PreviewNavbar } from "../preview/preview-navbar";
import { updateResume } from "@/utils/actions/resumes/actions";
import { toast } from "@/hooks/use-toast";

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  selectedTemplateId?: string;
}

export function PreviewPanel({
  resume,
  onResumeChange,
  width,
  selectedTemplateId = 'CV-11eu400-3',
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'designed' | 'simple'>('designed');
  const [zoom, setZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateResume(resume.id, resume);
      toast({
        title: "Changes saved",
        description: "Your resume has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-100">
      {/* Navbar */}
      <PreviewNavbar
        resume={resume}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        zoom={zoom}
        onZoomChange={setZoom}
        onResumeChange={onResumeChange}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        {/* Resume Section */}
        <div>
          {activeTab === 'designed' ? (
            <DesignedResumePreview
              resume={resume}
              templateId={resume.designed_template_id || selectedTemplateId}
              containerWidth={width * zoom}
            />
          ) : (
            <ResumeContextMenu resume={resume}>
              <ResumePreview
                resume={resume}
                containerWidth={width * zoom}
                template="default"
                design={resume.template_layout || 'classic'}
              />
            </ResumeContextMenu>
          )}
        </div>

      {/* Cover Letter Section - Only for Application Kits */}
      {!resume.is_base_resume && (
        <div className="mt-8">
          <div className="sticky top-0 z-10 bg-white px-6 py-3 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-50 rounded-lg p-2">
                <Mail className="w-5 h-5" style={{ color: "#5b6949" }} />
              </div>
              <h2 className="text-xl font-semibold text-zinc-700">
                Cover Letter
              </h2>
            </div>
          </div>
          <div className="px-2">
            <CoverLetter containerWidth={width} />
          </div>
        </div>
      )}

      {/* Follow-up Email Section - Only for Application Kits */}
      {!resume.is_base_resume && (
        <div className="mt-8 pb-8">
          <div className="sticky top-0 z-10 bg-white px-6 py-3 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-50 rounded-lg p-2">
                <Send className="w-5 h-5" style={{ color: "#5b6949" }} />
              </div>
              <h2 className="text-xl font-semibold text-zinc-700">
                Follow-up Email
              </h2>
            </div>
          </div>
          <div className="px-2">
            <FollowUpEmail containerWidth={width} />
          </div>
        </div>
      )}
      </ScrollArea>
    </div>
  );
}
