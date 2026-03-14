'use client';

import { Resume } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useResumeContext } from "../resume-editor-context";
import { updateResume } from "@/utils/actions/resumes/actions";
import { useState } from "react";
import { LanguageSelector } from './language-selector';
import { DesignedTemplateSelector } from './designed-template-selector';
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
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslationDialog, setShowTranslationDialog] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<TranslationLanguage>('en');

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

  return (
    <div className="px-2 py-3 @container">
      <div className="space-y-3">
        {/* Language and Template Selector Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1">
            <LanguageSelector
              currentLanguage={resume.current_language || 'en'}
              onLanguageSelect={(lang) => {
                setTargetLanguage(lang);
                setShowTranslationDialog(true);
              }}
              disabled={isTranslating || isSaving}
            />
            {isTranslating && (
              <Loader2 className="h-4 w-4 animate-spin text-[#5b6949] flex-shrink-0" />
            )}
          </div>

          {/* Template Selector */}
          <DesignedTemplateSelector
            currentTemplateId={resume.designed_template_id || 'CV1'}
            onTemplateSelect={(templateId) => {
              onResumeChange('designed_template_id', templateId);
              toast({
                title: "Template updated",
                description: "Your resume template has been changed successfully.",
              });
            }}
            disabled={isSaving}
          />
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