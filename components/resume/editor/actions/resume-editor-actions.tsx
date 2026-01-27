'use client';

import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Save, Languages } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { pdf } from '@react-pdf/renderer';
import { TextImport } from "../../text-import";
import { ResumePDFDocument } from "../preview/resume-pdf-document";
import { cn } from "@/lib/utils";
import { useResumeContext } from "../resume-editor-context";

import { updateResume } from "@/utils/actions/resumes/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { LanguageSelector } from './language-selector';
import { TranslationDialog } from '../dialogs/translation-dialog';
import { translateResume } from '@/utils/actions/translation/actions';
import type { TranslationLanguage } from '@/lib/translation-config';

interface ResumeEditorActionsProps {
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
}

export function ResumeEditorActions({
  onResumeChange
}: ResumeEditorActionsProps) {
  const { state, dispatch } = useResumeContext();
  const { resume, isSaving } = state;
  const [downloadOptions, setDownloadOptions] = useState({
    resume: true,
    coverLetter: true,
    followUpEmail: true
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslationDialog, setShowTranslationDialog] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<TranslationLanguage>('en');

  // Save Resume
  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_SAVING', value: true });
      await updateResume(state.resume.id, state.resume);
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
      dispatch({ type: 'SET_SAVING', value: false });
    }
  };

  // Translate Resume
  const handleTranslate = async () => {
    if (!targetLanguage || targetLanguage === resume.current_language) return;

    setIsTranslating(true);
    try {
      // Get model and API key from local storage
      const MODEL_STORAGE_KEY = 'resumelm-default-model';
      const LOCAL_STORAGE_KEY = 'resumelm-api-keys';

      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];

      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error('Error parsing API keys:', error);
      }

      const translatedResume = await translateResume(
        state.resume,
        targetLanguage,
        { model: selectedModel || 'gpt-4o-mini', apiKeys }
      );

      // Update context with translated resume
      dispatch({ type: 'UPDATE_FIELD', field: 'work_experience', value: translatedResume.work_experience });
      dispatch({ type: 'UPDATE_FIELD', field: 'education', value: translatedResume.education });
      dispatch({ type: 'UPDATE_FIELD', field: 'skills', value: translatedResume.skills });
      dispatch({ type: 'UPDATE_FIELD', field: 'projects', value: translatedResume.projects });
      dispatch({ type: 'UPDATE_FIELD', field: 'target_role', value: translatedResume.target_role });
      dispatch({ type: 'UPDATE_FIELD', field: 'current_language', value: targetLanguage });

      if (translatedResume.cover_letter) {
        dispatch({ type: 'UPDATE_FIELD', field: 'cover_letter', value: translatedResume.cover_letter });
      }
      if (translatedResume.follow_up_email) {
        dispatch({ type: 'UPDATE_FIELD', field: 'follow_up_email', value: translatedResume.follow_up_email });
      }

      toast({
        title: "Translation complete",
        description: "Your resume has been translated successfully.",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: error instanceof Error ? error.message : "Unable to translate your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
      setShowTranslationDialog(false);
    }
  };

  // Dynamic color classes based on resume type
  const colors = {
    // Import button colors
    importBg: "bg-[#5b6949]",
    importHover: "hover:bg-[#5b6949]/90",
    importShadow: "shadow-[#5b6949]/20",
    // Action buttons colors (download & save)
    actionBg: "bg-[#5b6949]",
    actionHover: "hover:bg-[#5b6949]/90",
    actionShadow: "shadow-[#5b6949]/20"
  };

  
  const buttonBaseStyle = cn(
    "transition-all duration-300",
    "relative overflow-hidden",
    "h-8 px-3 text-[11px] font-medium",
    "rounded-md border-none",
    "text-white shadow-sm",
    "hover:shadow-md hover:-translate-y-[1px]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
  );

  const importButtonClasses = cn(
    buttonBaseStyle,
    colors.importBg,
    colors.importHover,
    colors.importShadow
  );

  const actionButtonClasses = cn(
    buttonBaseStyle,
    colors.actionBg,
    colors.actionHover,
    colors.actionShadow
  );

  return (
    <div className="px-1 py-2 @container">
      <div className="space-y-2">
        {/* Translation Row */}
        <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-md border border-zinc-200">
          <Languages className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs text-zinc-600 font-medium">Language:</span>
          <LanguageSelector
            currentLanguage={resume.current_language || 'en'}
            onLanguageSelect={(lang) => {
              setTargetLanguage(lang);
              setShowTranslationDialog(true);
            }}
            disabled={isTranslating || isSaving}
          />
          {isTranslating && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#5b6949]" />
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Text Import Button */}
          <TextImport
            resume={resume}
            onResumeChange={onResumeChange}
            className={importButtonClasses}
          />

        {/* Download Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={async () => {
                  try {
                    // Download Resume if selected
                    if (downloadOptions.resume) {
                      const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${resume.first_name}_${resume.last_name}_Resume.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }

                    // Download Cover Letter if selected and exists
                    if (downloadOptions.coverLetter) {
                      const html2pdf = (await import('html2pdf.js')).default;
                      
                      const coverLetterElement = document.getElementById('cover-letter-content');
                      if (!coverLetterElement) {
                        throw new Error('Cover letter content not found');
                      }

                      // Check if content is empty or too short
                      const content = coverLetterElement.innerHTML.trim();
                      if (!content || content.length < 50) {
                        toast({
                          title: "Cannot download",
                          description: "Cover letter content is empty or too short.",
                          variant: "destructive",
                        });
                        return;
                      }

                      // Create a temporary container for PDF generation
                      const tempContainer = document.createElement('div');
                      tempContainer.innerHTML = `
                        <div style="
                          font-family: 'Arial', sans-serif;
                          width: 100%;
                          margin: 0;
                          padding: 60px;
                          background-color: white;
                        ">
                          <div style="
                            background-color: #2563eb;
                            color: white;
                            font-size: 18px;
                            font-weight: bold;
                            margin: -60px -60px 40px -60px;
                            padding: 20px;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 60px;
                          ">
                            Cover Letter
                          </div>
                          <div style="
                            line-height: 1.5;
                            font-size: 11pt;
                            color: #1f2937;
                            width: 100%;
                          ">
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

                    // Download Follow-Up Email if selected and exists
                    if (downloadOptions.followUpEmail) {
                      const html2pdf = (await import('html2pdf.js')).default;
                      
                      const followUpElement = document.getElementById('follow-up-email-content');
                      if (!followUpElement) {
                        throw new Error('Follow-up email content not found');
                      }

                      // Check if content is empty or too short
                      const content = followUpElement.innerHTML.trim();
                      if (!content || content.length < 50) {
                        toast({
                          title: "Cannot download",
                          description: "Follow-up email content is empty or too short.",
                          variant: "destructive",
                        });
                        return;
                      }

                      // Create a temporary container for PDF generation
                      const tempContainer = document.createElement('div');
                      tempContainer.innerHTML = `
                        <div style="
                          font-family: 'Arial', sans-serif;
                          width: 100%;
                          margin: 0;
                          padding: 60px;
                          background-color: white;
                        ">
                          <div style="
                            background-color: #2563eb;
                            color: white;
                            font-size: 18px;
                            font-weight: bold;
                            margin: -60px -60px 40px -60px;
                            padding: 20px;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 60px;
                          ">
                            Follow-Up Email
                          </div>
                          <div style="
                            line-height: 1.5;
                            font-size: 11pt;
                            color: #1f2937;
                            width: 100%;
                          ">
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
                }}
                className={actionButtonClasses}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              align="start"
              sideOffset={5}
              className={cn(
                "w-48 p-3 bg-zinc-50 border-2 border-zinc-200 rounded-lg shadow-lg"
              )}
            >
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={downloadOptions.resume}
                    onCheckedChange={(checked) => 
                      setDownloadOptions(prev => ({ ...prev, resume: checked as boolean }))
                    }
                    className={cn(
                      "border-[#5b6949] data-[state=checked]:bg-[#5b6949] data-[state=checked]:border-[#5b6949]"
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">Resume</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={downloadOptions.coverLetter}
                    onCheckedChange={(checked) => 
                      setDownloadOptions(prev => ({ ...prev, coverLetter: checked as boolean }))
                    }
                    className={cn(
                      "border-[#5b6949] data-[state=checked]:bg-[#5b6949] data-[state=checked]:border-[#5b6949]"
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">Cover Letter</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox 
                    checked={downloadOptions.followUpEmail}
                    onCheckedChange={(checked) => 
                      setDownloadOptions(prev => ({ ...prev, followUpEmail: checked as boolean }))
                    }
                    className={cn(
                      "border-[#5b6949] data-[state=checked]:bg-[#5b6949] data-[state=checked]:border-[#5b6949]"
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">Follow-Up Email</span>
                </label>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className={actionButtonClasses}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
        </div>
      </div>

      {/* Translation Dialog */}
      <TranslationDialog
        isOpen={showTranslationDialog}
        onOpenChange={setShowTranslationDialog}
        targetLanguage={targetLanguage}
        currentLanguage={resume.current_language || 'en'}
        onConfirm={handleTranslate}
      />
    </div>
  );
} 