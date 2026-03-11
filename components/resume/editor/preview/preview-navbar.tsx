'use client';

import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Save, ZoomIn, ZoomOut, FileText, Palette, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from "./resume-pdf-document";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { TextImport } from "../../text-import";
import { recordUsage, checkCanPerformAction } from "@/utils/actions/subscriptions/usage";
import { useRouter } from "next/navigation";

interface PreviewNavbarProps {
  resume: Resume;
  activeTab: 'designed' | 'simple';
  onTabChange: (tab: 'designed' | 'simple') => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function PreviewNavbar({
  resume,
  activeTab,
  onTabChange,
  zoom,
  onZoomChange,
  onResumeChange,
  onSave,
  isSaving
}: PreviewNavbarProps) {
  const [downloadOptions, setDownloadOptions] = useState({
    designedResume: true,
    simpleResume: false,
    coverLetter: false,
    followUpEmail: false
  });

  const router = useRouter();

  const handleTabChange = (tab: 'designed' | 'simple') => {
    onTabChange(tab);
    onZoomChange(1); // Reset zoom when switching tabs
  };

  const handleDownload = async () => {
    try {
      // Check paywall for CV downloads
      const needsCvCheck = downloadOptions.designedResume || downloadOptions.simpleResume;
      const needsCoverLetterCheck = downloadOptions.coverLetter;

      if (needsCvCheck) {
        const cvCheck = await checkCanPerformAction('cv_download');
        if (!cvCheck.allowed) {
          toast({
            title: "Download limit reached",
            description: "You've used your free CV download. Upgrade to Pro for unlimited downloads.",
            variant: "destructive",
          });
          router.push("/dashboard/subscription");
          return;
        }
      }

      if (needsCoverLetterCheck) {
        const clCheck = await checkCanPerformAction('cover_letter_download');
        if (!clCheck.allowed) {
          toast({
            title: "Download limit reached",
            description: "You've used your free cover letter download. Upgrade to Pro for unlimited downloads.",
            variant: "destructive",
          });
          router.push("/dashboard/subscription");
          return;
        }
      }

      // Download Designed Resume
      if (downloadOptions.designedResume) {
        const html2pdf = (await import('html2pdf.js')).default;
        const { getTemplateById, getDefaultTemplate } = await import('@/lib/cv-templates/template-registry');

        const template = getTemplateById(resume.designed_template_id || '') || getDefaultTemplate();
        const htmlContent = template.generateHTML(resume);

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);

        const opt = {
          margin: 0,
          filename: `${resume.first_name}_${resume.last_name}_Designed_Resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            width: 816,
            windowWidth: 816
          },
          jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait'
          }
        };

        try {
          await html2pdf().set(opt).from(tempContainer).save();
        } finally {
          document.body.removeChild(tempContainer);
        }
      }

      // Download Simple Resume
      if (downloadOptions.simpleResume) {
        const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.first_name}_${resume.last_name}_Simple_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Download Cover Letter
      if (downloadOptions.coverLetter) {
        const html2pdf = (await import('html2pdf.js')).default;
        const coverLetterElement = document.getElementById('cover-letter-content');
        if (!coverLetterElement) throw new Error('Cover letter content not found');

        const content = coverLetterElement.innerHTML.trim();
        if (!content || content.length < 50) {
          toast({
            title: "Cannot download",
            description: "Cover letter content is empty or too short.",
            variant: "destructive",
          });
          return;
        }

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = `
          <div style="font-family: 'Arial', sans-serif; width: 100%; margin: 0; padding: 60px; background-color: white;">
            <div style="background-color: #2563eb; color: white; font-size: 18px; font-weight: bold; margin: -60px -60px 40px -60px; padding: 20px; text-align: center; display: flex; justify-content: center; align-items: center; min-height: 60px;">Cover Letter</div>
            <div style="line-height: 1.5; font-size: 11pt; color: #1f2937; width: 100%;">
              ${content.replace(/<p>/g, '<p style="margin-bottom: 1.5em;">')}
            </div>
          </div>
        `;
        document.body.appendChild(tempContainer);

        const opt = {
          margin: [0, 0, 0, 0],
          filename: `${resume.first_name}_${resume.last_name}_Cover_Letter.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            backgroundColor: 'white',
            useCORS: true,
            letterRendering: true,
            scale: 2,
            logging: true,
            width: 816,
            windowWidth: 816
          },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
          await html2pdf().set(opt).from(tempContainer).save();
        } finally {
          document.body.removeChild(tempContainer);
        }
      }

      // Download Follow-up Email
      if (downloadOptions.followUpEmail) {
        const html2pdf = (await import('html2pdf.js')).default;
        const followUpElement = document.getElementById('follow-up-email-content');
        if (!followUpElement) throw new Error('Follow-up email content not found');

        const content = followUpElement.innerHTML.trim();
        if (!content || content.length < 50) {
          toast({
            title: "Cannot download",
            description: "Follow-up email content is empty or too short.",
            variant: "destructive",
          });
          return;
        }

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = `
          <div style="font-family: 'Arial', sans-serif; width: 100%; margin: 0; padding: 60px; background-color: white;">
            <div style="background-color: #2563eb; color: white; font-size: 18px; font-weight: bold; margin: -60px -60px 40px -60px; padding: 20px; text-align: center; display: flex; justify-content: center; align-items: center; min-height: 60px;">Follow-Up Email</div>
            <div style="line-height: 1.5; font-size: 11pt; color: #1f2937; width: 100%;">
              ${content.replace(/<p>/g, '<p style="margin-bottom: 1.5em;">')}
            </div>
          </div>
        `;
        document.body.appendChild(tempContainer);

        const opt = {
          margin: [0, 0, 0, 0],
          filename: `${resume.first_name}_${resume.last_name}_Follow_Up_Email.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            backgroundColor: 'white',
            useCORS: true,
            letterRendering: true,
            scale: 2,
            logging: true,
            width: 816,
            windowWidth: 816
          },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
          await html2pdf().set(opt).from(tempContainer).save();
        } finally {
          document.body.removeChild(tempContainer);
        }
      }

      // Record usage after successful download
      if (needsCvCheck) {
        await recordUsage('cv_download');
      }
      if (needsCoverLetterCheck) {
        await recordUsage('cover_letter_download');
      }

      toast({
        title: "Download started",
        description: "Your documents are being downloaded.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Unable to download your documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const buttonStyle = cn(
    "h-9 px-3 text-xs font-medium",
    "bg-zinc-100 text-zinc-700 border border-zinc-300",
    "hover:bg-zinc-200 hover:border-zinc-400",
    "transition-colors duration-200"
  );

  const activeButtonStyle = cn(
    "h-9 px-4 text-xs font-medium",
    "transition-colors duration-200"
  );

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-zinc-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Resume Type Toggle */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleTabChange('designed')}
            className={cn(
              activeButtonStyle,
              activeTab === 'designed'
                ? "bg-[#5b6949] text-white hover:bg-[#4a5539]"
                : "bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200"
            )}
          >
            <Palette className="w-4 h-4 mr-2" />
            Designed
          </Button>
          <Button
            onClick={() => handleTabChange('simple')}
            className={cn(
              activeButtonStyle,
              activeTab === 'simple'
                ? "bg-[#5b6949] text-white hover:bg-[#4a5539]"
                : "bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200"
            )}
          >
            <FileText className="w-4 h-4 mr-2" />
            Simple
          </Button>
        </div>

        {/* Middle: Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.02))}
            disabled={zoom <= 0.5}
            className={buttonStyle}
            size="sm"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium text-zinc-600 min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            onClick={() => onZoomChange(Math.min(1.5, zoom + 0.02))}
            disabled={zoom >= 1.5}
            className={buttonStyle}
            size="sm"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Import Button */}
          <TextImport
            resume={resume}
            onResumeChange={onResumeChange}
            className={cn(buttonStyle, "flex items-center gap-2")}
          />

          {/* Download Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={buttonStyle}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-2 border-zinc-200 shadow-lg">
              <DropdownMenuLabel>Select documents to download</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={downloadOptions.designedResume}
                onCheckedChange={(checked) =>
                  setDownloadOptions(prev => ({ ...prev, designedResume: checked }))
                }
              >
                <Palette className="w-4 h-4 mr-2" />
                Designed Resume
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={downloadOptions.simpleResume}
                onCheckedChange={(checked) =>
                  setDownloadOptions(prev => ({ ...prev, simpleResume: checked }))
                }
              >
                <FileText className="w-4 h-4 mr-2" />
                Simple Resume
              </DropdownMenuCheckboxItem>
              {!resume.is_base_resume && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={downloadOptions.coverLetter}
                    onCheckedChange={(checked) =>
                      setDownloadOptions(prev => ({ ...prev, coverLetter: checked }))
                    }
                  >
                    Cover Letter
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={downloadOptions.followUpEmail}
                    onCheckedChange={(checked) =>
                      setDownloadOptions(prev => ({ ...prev, followUpEmail: checked }))
                    }
                  >
                    Follow-Up Email
                  </DropdownMenuCheckboxItem>
                </>
              )}
              <DropdownMenuSeparator />
              <Button
                onClick={handleDownload}
                className="w-full mt-2 bg-[#5b6949] hover:bg-[#4a5539] text-white"
                size="sm"
              >
                Download Selected
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Save Button */}
          <Button
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              buttonStyle,
              "bg-[#5b6949] text-white hover:bg-[#4a5539] border-[#5b6949]"
            )}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}
