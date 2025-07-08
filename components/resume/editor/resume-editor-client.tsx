'use client';

import React from 'react';
import { Resume, Profile, Job } from "@/lib/types";
import { useState, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ResumeContext, resumeReducer } from './resume-editor-context';
import { createClient } from "@/utils/supabase/client";
import { EditorLayout } from "./layout/EditorLayout";
import { EditorPanel } from './panels/editor-panel';
import { PreviewPanel } from './panels/preview-panel';
import { UnsavedChangesDialog } from './dialogs/unsaved-changes-dialog';
import { generate } from "@/utils/actions/cover-letter/actions";
import { readStreamableValue } from 'ai/rsc';

interface ResumeEditorClientProps {
  initialResume: Resume;
  profile: Profile;
}

export function ResumeEditorClient({
  initialResume,
  profile,
}: ResumeEditorClientProps) {
  const router = useRouter();
  const [state, dispatch] = useReducer(resumeReducer, {
    resume: initialResume,
    isSaving: false,
    isDeleting: false,
    hasUnsavedChanges: false
  });

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const debouncedResume = useDebouncedValue(state.resume, 1000);
  const [job, setJob] = useState<Job | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const hasAttemptedCoverLetter = useRef(false);
  const hasAttemptedFollowUp = useRef(false);

  // Single job fetching effect
  useEffect(() => {
    async function fetchJob() {
      if (!state.resume.job_id) {
        setJob(null);
        return;
      }

      try {
        setIsLoadingJob(true);
        const supabase = createClient();
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', state.resume.job_id)
          .single();

        if (error) {
          void error
          setJob(null);
          return;
        }

        setJob(jobData);
      } catch {
        setJob(null);
      } finally {
        setIsLoadingJob(false);
      }
    }
    fetchJob();
  }, [state.resume.job_id]);

  // Add useEffect for automatic cover letter generation
  useEffect(() => {
    const hasCoverLetterContent = state.resume.cover_letter?.content && 
      typeof state.resume.cover_letter.content === 'string' && 
      state.resume.cover_letter.content.length > 150;

    if (job && !hasCoverLetterContent && !isGeneratingCoverLetter && !hasAttemptedCoverLetter.current) {
      hasAttemptedCoverLetter.current = true;
      setIsGeneratingCoverLetter(true);
      
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

      // Prompt
      const prompt = `IMPORTANT: Write the entire cover letter in the same language as the job description below. Detect the language automatically.
Write a professional cover letter for the following job using my resume information:
      ${JSON.stringify(job)}
      
      ${JSON.stringify(state.resume)}
      
      Today's date is ${new Date().toLocaleDateString()}.

      Please use my contact information in the letter:
      Full Name: ${state.resume.first_name} ${state.resume.last_name}
      Email: ${state.resume.email}
      ${state.resume.phone_number ? `Phone: ${state.resume.phone_number}` : ''}
      ${state.resume.linkedin_url ? `LinkedIn: ${state.resume.linkedin_url}` : ''}
      ${state.resume.github_url ? `GitHub: ${state.resume.github_url}` : ''}
      
      The cover letter should be 300 words or less.`;

      // Call The Model
      generate(prompt, {
        model: selectedModel || '',
        apiKeys
      }).then(async ({ output }: { output: any }) => {
        let generatedContent = '';
        for await (const delta of readStreamableValue(output)) {
          generatedContent += delta;
          // Update resume context directly
          dispatch({ 
            type: 'UPDATE_FIELD',
            field: 'cover_letter',
            value: {
              content: generatedContent,
            }
          });
        }
        // Set has_cover_letter to true after generation
        dispatch({
          type: 'UPDATE_FIELD',
          field: 'has_cover_letter',
          value: true
        });
      }).catch((error: Error) => {
        console.error('Generation error:', error);
      }).finally(() => {
        setIsGeneratingCoverLetter(false);
      });
    }
  }, [job, state.resume.id]);

  // Add useEffect for automatic follow-up email generation
  useEffect(() => {
    const hasFollowUpContent = state.resume.follow_up_email?.content && 
      typeof state.resume.follow_up_email.content === 'string' && 
      state.resume.follow_up_email.content.length > 150;

    if (job && !hasFollowUpContent && !isGeneratingFollowUp && !hasAttemptedFollowUp.current) {
      hasAttemptedFollowUp.current = true;
      setIsGeneratingFollowUp(true);
      
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

      // Prompt
      const prompt = `IMPORTANT: Write the entire follow up email in the same language as the job description below. Detect the language automatically.
Write a professional Follow Up Email with a proper header and subject for the following job using my resume information:
      ${JSON.stringify(job)}
      
      ${JSON.stringify(state.resume)}
      
      Today's date is ${new Date().toLocaleDateString()}.

      Please use my contact information in the letter:
      Full Name: ${state.resume.first_name} ${state.resume.last_name}
      Email: ${state.resume.email}
      ${state.resume.phone_number ? `Phone: ${state.resume.phone_number}` : ''}
      ${state.resume.linkedin_url ? `LinkedIn: ${state.resume.linkedin_url}` : ''}
      ${state.resume.github_url ? `GitHub: ${state.resume.github_url}` : ''}
      
      The email should be 300 words or less.`;

      // Call The Model
      generate(prompt, {
        model: selectedModel || '',
        apiKeys
      }).then(async ({ output }: { output: any }) => {
        let generatedContent = '';
        for await (const delta of readStreamableValue(output)) {
          generatedContent += delta;
          // Update resume context directly
          dispatch({ 
            type: 'UPDATE_FIELD',
            field: 'follow_up_email',
            value: {
              content: generatedContent,
            }
          });
        }
        // Set has_follow_up_email to true after generation
        dispatch({
          type: 'UPDATE_FIELD',
          field: 'has_follow_up_email',
          value: true
        });
      }).catch((error: Error) => {
        console.error('Generation error:', error);
      }).finally(() => {
        setIsGeneratingFollowUp(false);
      });
    }
  }, [job, state.resume.id]);

  const updateField = <K extends keyof Resume>(field: K, value: Resume[K]) => {
    
    if (field === 'document_settings') {
      // Ensure we're passing a valid DocumentSettings object
      if (typeof value === 'object' && value !== null) {
        dispatch({ type: 'UPDATE_FIELD', field, value });
      } else {
        console.error('Invalid document settings:', value);
      }
    } else {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    }
  };

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(state.resume) !== JSON.stringify(initialResume);
    dispatch({ type: 'SET_HAS_CHANGES', value: hasChanges });
  }, [state.resume, initialResume]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);



  // Editor Panel
  const editorPanel = (
    <EditorPanel
      resume={state.resume}
      profile={profile}
      job={job}
      isLoadingJob={isLoadingJob}
      onResumeChange={updateField}
    />
  );

  // Preview Panel
  const previewPanel = (width: number) => (
    <PreviewPanel
      resume={debouncedResume}
      onResumeChange={updateField}
      width={width}
    />
  );

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        isOpen={showExitDialog}
        onOpenChange={setShowExitDialog}
        // pendingNavigation={pendingNavigation}
        onConfirm={() => {
          if (pendingNavigation) {
            router.push(pendingNavigation);
          }
          setShowExitDialog(false);
          setPendingNavigation(null);
        }}
      />

      {/* Editor Layout */}
      <EditorLayout
        isBaseResume={state.resume.is_base_resume}
        editorPanel={editorPanel}
        previewPanel={previewPanel}
      />
    </ResumeContext.Provider>
  );
} 