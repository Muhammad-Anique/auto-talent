'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Download,
  FileText,
  Copy,
  Maximize2,
  Minimize2,
  Eye,
  Pencil,
  RotateCcw,
  ChevronDown,
  Globe,
  Save,
  X,
  LayoutTemplate,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArtifactState } from './use-super-agent';

interface ArtifactPanelProps {
  artifact: ArtifactState | null;
  isLoading: boolean;
  onUpdateHtml: (html: string) => void;
  onRevertToVersion: (index: number) => void;
  onRequestSave?: () => void;
  onRequestTranslate?: (language: string) => void;
  onClose?: () => void;
  className?: string;
}

const CV_TEMPLATES = [
  { id: 'CV1', name: 'Dark Blue Sidebar', accent: '#2b3a4e', secondary: '#3d7c8c' },
  { id: 'CV2', name: 'Dark Red Sidebar', accent: '#7b2d2d', secondary: '#c0392b' },
  { id: 'CV3', name: 'Orange Accent', accent: '#e8722a', secondary: '#f0a500' },
  { id: 'CV4', name: 'Navy & White', accent: '#1a2b5e', secondary: '#3a5ea8' },
  { id: 'CV5', name: 'Layered Strip', accent: '#2d3748', secondary: '#4a9085' },
  { id: 'CV6', name: 'Dark Slate Sidebar', accent: '#2d3748', secondary: '#718096' },
  { id: 'CV7', name: 'Slate Header', accent: '#374151', secondary: '#6b7280' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ru', name: 'Russian' },
  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'th', name: 'Thai' },
];

export default function ArtifactPanel({
  artifact,
  isLoading,
  onUpdateHtml,
  onRevertToVersion,
  onRequestSave,
  onRequestTranslate,
  onClose,
  className,
}: ArtifactPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editHtml, setEditHtml] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);

  // Sync edit content when artifact changes
  useEffect(() => {
    if (artifact) {
      setEditHtml(artifact.html);
    }
  }, [artifact?.html]);

  // Update iframe content
  useEffect(() => {
    if (iframeRef.current && artifact && mode === 'preview') {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(artifact.html);
        doc.close();
      }
    }
  }, [artifact?.html, mode]);

  const handleSaveEdit = useCallback(() => {
    onUpdateHtml(editHtml);
    setMode('preview');
  }, [editHtml, onUpdateHtml]);

  const handleCopyHtml = useCallback(() => {
    if (artifact) {
      navigator.clipboard.writeText(artifact.html);
    }
  }, [artifact]);

  const handleSwitchTemplate = useCallback(async (templateId: string) => {
    if (!artifact?.resumeId) return;
    setIsSwitchingTemplate(true);
    setShowTemplates(false);
    try {
      const res = await fetch('/api/super-agent/render-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, resumeId: artifact.resumeId }),
      });
      const data = await res.json();
      if (data.html) {
        onUpdateHtml(data.html);
      }
    } catch (err) {
      console.error('Template switch error:', err);
    } finally {
      setIsSwitchingTemplate(false);
    }
  }, [artifact?.resumeId, onUpdateHtml]);

  const handleDownloadPdf = useCallback(async () => {
    if (!artifact) return;
    const html2pdf = (await import('html2pdf.js')).default;

    const html = artifact.html;

    // Extract <style> blocks and @import rules from the full HTML document
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    const styles = styleMatches.map(s => s).join('\n');

    // Extract <body> inner content, fallback to everything if no body tag
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : html;

    // Build a self-contained container in the current document
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = '210mm';
    wrapper.style.background = 'white';
    wrapper.style.zIndex = '-1';

    // Inject the extracted styles + body content together
    wrapper.innerHTML = styles + bodyContent;

    document.body.appendChild(wrapper);

    // Load Google Fonts that were in @import rules
    const fontImports = html.match(/@import\s+url\(['"]?(https:\/\/fonts\.googleapis\.com[^'")\s]+)['"]?\)/g) || [];
    const fontLoadPromises = fontImports.map(imp => {
      const urlMatch = imp.match(/url\(['"]?(https:\/\/[^'")\s]+)['"]?\)/);
      if (!urlMatch) return Promise.resolve();
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = urlMatch[1];
      document.head.appendChild(link);
      return new Promise<void>((resolve) => {
        link.onload = () => resolve();
        link.onerror = () => resolve();
        setTimeout(resolve, 3000); // timeout fallback
      });
    });

    await Promise.all(fontLoadPromises);

    // Wait for images to load + fonts to render
    const images = wrapper.querySelectorAll('img');
    const imgPromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 3000);
      });
    });
    await Promise.all(imgPromises);

    // Extra delay for font rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      await html2pdf()
        .set({
          margin: 0,
          filename: `${artifact.title.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(wrapper)
        .save();
    } finally {
      document.body.removeChild(wrapper);
      // Clean up injected font links
      fontImports.forEach(imp => {
        const urlMatch = imp.match(/url\(['"]?(https:\/\/[^'")\s]+)['"]?\)/);
        if (!urlMatch) return;
        const links = document.head.querySelectorAll(`link[href="${urlMatch[1]}"]`);
        links.forEach(l => l.remove());
      });
    }
  }, [artifact]);

  // Empty state
  if (!artifact && !isLoading) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-full bg-zinc-50/50', className)}>
        <div className="text-center space-y-4 p-8">
          <div className="inline-flex p-5 bg-[#5b6949]/10 rounded-2xl">
            <FileText className="h-12 w-12 text-[#5b6949]" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-800">Artifact Preview</h3>
          <p className="text-sm text-zinc-500 max-w-xs">
            Ask the agent to create a resume, cover letter, or email. The document will appear here as an interactive preview.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && !artifact) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-full bg-zinc-50/50', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Generating artifact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-white',
      isFullscreen && 'fixed inset-0 z-50',
      className,
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-200 bg-zinc-50 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText className="h-3.5 w-3.5 text-[#5b6949] shrink-0" />
          <span className="text-xs font-medium text-zinc-700 truncate">{artifact?.title}</span>
          <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-full shrink-0">
            {artifact?.type.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* View/Edit toggle */}
          <button
            onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}
            className={cn(
              'p-1.5 rounded-md text-xs transition-colors',
              mode === 'edit'
                ? 'bg-[#5b6949] text-white'
                : 'text-zinc-500 hover:bg-zinc-100'
            )}
            title={mode === 'preview' ? 'Edit HTML' : 'Preview'}
          >
            {mode === 'preview' ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
              title="Translate"
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
            {showLanguages && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-zinc-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors"
                    onClick={() => {
                      onRequestTranslate?.(lang.name);
                      setShowLanguages(false);
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Template switcher (resume only) */}
          {artifact?.type === 'resume' && (
            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                disabled={isSwitchingTemplate}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  showTemplates ? 'bg-[#5b6949] text-white' : 'text-zinc-500 hover:bg-zinc-100',
                  isSwitchingTemplate && 'opacity-50 cursor-not-allowed'
                )}
                title="Switch resume template"
              >
                {isSwitchingTemplate ? (
                  <div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LayoutTemplate className="h-3.5 w-3.5" />
                )}
              </button>
              {showTemplates && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 p-2">
                  <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide px-2 mb-1.5">
                    Resume Templates
                  </div>
                  {!artifact.resumeId && (
                    <div className="px-2 py-1.5 text-[11px] text-zinc-500 bg-amber-50 border border-amber-100 rounded-lg mb-1.5">
                      Save your resume first to enable template switching.
                    </div>
                  )}
                  <div className="space-y-1">
                    {CV_TEMPLATES.map(tpl => (
                      <button
                        key={tpl.id}
                        disabled={!artifact.resumeId}
                        onClick={() => handleSwitchTemplate(tpl.id)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors text-left',
                          artifact.resumeId
                            ? 'hover:bg-zinc-50 cursor-pointer'
                            : 'opacity-40 cursor-not-allowed'
                        )}
                      >
                        <div className="flex gap-0.5 shrink-0">
                          <div className="w-3 h-4 rounded-sm" style={{ background: tpl.accent }} />
                          <div className="w-1.5 h-4 rounded-sm" style={{ background: tpl.secondary }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px] font-medium text-zinc-700">{tpl.id}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{tpl.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Version history */}
          {artifact && artifact.versions.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowVersions(!showVersions)}
                className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
                title="Version history"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              {showVersions && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-zinc-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {artifact.versions.map((v, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0"
                      onClick={() => {
                        onRevertToVersion(i);
                        setShowVersions(false);
                      }}
                    >
                      <div className="font-medium text-zinc-700">v{i + 1} — {v.title}</div>
                      <div className="text-zinc-400">{v.timestamp.toLocaleTimeString()}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="w-px h-4 bg-zinc-200 mx-1" />

          {/* Copy */}
          <button
            onClick={handleCopyHtml}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
            title="Copy HTML"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPdf}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
            title="Download PDF"
          >
            <Download className="h-3.5 w-3.5" />
          </button>

          {/* Save */}
          {onRequestSave && (
            <button
              onClick={onRequestSave}
              className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
              title="Save to database"
            >
              <Save className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Close / Dismiss artifact */}
          {onClose && (
            <button
              onClick={() => { setIsFullscreen(false); onClose(); }}
              className="p-1.5 rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Close artifact"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {mode === 'preview' ? (
          <div className="h-full overflow-auto bg-zinc-100 p-4 flex justify-center">
            <div className="bg-white shadow-xl rounded-sm" style={{ width: '210mm', minHeight: '297mm' }}>
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                style={{ minHeight: '297mm' }}
                sandbox="allow-same-origin"
                title="Artifact Preview"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <textarea
              ref={editorRef}
              value={editHtml}
              onChange={(e) => setEditHtml(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-xs leading-relaxed text-zinc-700 bg-zinc-900 text-green-400 resize-none focus:outline-none"
              spellCheck={false}
            />
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-zinc-200 bg-zinc-50">
              <button
                onClick={() => {
                  setEditHtml(artifact?.html || '');
                  setMode('preview');
                }}
                className="px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 text-xs bg-[#5b6949] text-white rounded-md hover:bg-[#5b6949]/90 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-zinc-600">Updating...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
