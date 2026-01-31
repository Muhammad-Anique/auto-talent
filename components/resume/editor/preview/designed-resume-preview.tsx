"use client";

import { Resume } from "@/lib/types";
import { useState, useEffect, useMemo, useRef } from 'react';
import { getTemplateById, getDefaultTemplate } from '@/lib/cv-templates/template-registry';

interface DesignedResumePreviewProps {
  resume: Resume;
  templateId?: string;
  containerWidth: number;
}

/**
 * DesignedResumePreview Component
 *
 * Renders HTML/CSS templates with user resume data
 * Provides a preview of the designed resume template
 */
export function DesignedResumePreview({
  resume,
  templateId,
  containerWidth
}: DesignedResumePreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate HTML content from template
  useEffect(() => {
    const template = templateId
      ? getTemplateById(templateId) || getDefaultTemplate()
      : getDefaultTemplate();

    const generatedHTML = template.generateHTML(resume);
    setHtmlContent(generatedHTML);
  }, [resume, templateId]);

  // Calculate scale to fit the resume in the container
  const scale = useMemo(() => {
    // A4 size is 8.5in x 11in at 96 DPI = 816px x 1056px
    const resumeWidth = 816;
    return containerWidth / resumeWidth;
  }, [containerWidth]);

  // Update iframe content when HTML changes
  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [htmlContent]);

  // Loading state
  if (!htmlContent) {
    return (
      <div className="w-full aspect-[8.5/11] bg-white shadow-lg p-8">
        <div className="space-y-0 animate-pulse">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 w-1/3 mx-auto" />
            <div className="flex justify-center gap-4">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-zinc-400 p-2 flex justify-center items-start overflow-auto">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '816px',
          height: '1056px',
        }}
      >
        <iframe
          ref={iframeRef}
          title="Resume Preview"
          className="w-full h-full bg-white shadow-xl border-0"
          style={{
            width: '816px',
            height: '1056px',
          }}
        />
      </div>
    </div>
  );
}
