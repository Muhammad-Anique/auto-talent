'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ToolInvocation } from 'ai';
import {
  Square,
  RefreshCw,
  FileText,
  Mail,
  FileSignature,
  Languages,
  Sparkles,
  BarChart3,
  ChevronDown,
  Loader2,
  Plus,
  ArrowUp,
  Check,
  Paperclip,
  X,
  Search,
  BriefcaseBusiness,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MemoizedMarkdown } from '@/components/ui/memoized-markdown';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import pdfToText from 'react-pdftotext';
import type { ArtifactState } from './use-super-agent';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  error?: Error;
  artifacts: ArtifactState[];
  activeArtifactId: string | null;
  onSelectArtifact: (id: string) => void;
  onDismissArtifact?: () => void;
  onSubmit: (message: string) => void;
  onStop: () => void;
  onClear: () => void;
  className?: string;
}

const QUICK_ACTIONS = [
  { icon: FileText, label: 'Build a Resume', prompt: 'Create a professional resume for me using my profile data. Make it modern and ATS-friendly.' },
  { icon: FileSignature, label: 'Cover Letter', prompt: 'Write me a compelling cover letter. Ask me about the job first.' },
  { icon: Mail, label: 'Follow-Up Email', prompt: 'Draft a professional follow-up email to a hiring manager after an interview.' },
  { icon: Languages, label: 'Translate', prompt: 'Please translate my current document to another language. What language would you like?' },
  { icon: BarChart3, label: 'Score Resume', prompt: 'Analyze and score my most recent resume for ATS compatibility.' },
  { icon: Sparkles, label: 'Improve Resume', prompt: 'Review my latest resume and suggest improvements to make it more impactful.' },
  { icon: Search, label: 'Search Jobs', prompt: 'Search for jobs that match my profile and skills. Show me the best opportunities.' },
];

// Compact tool label
function getToolLabel(toolName: string, state: string): string {
  const doneLabels: Record<string, string> = {
    get_user_profile: 'Read profile',
    get_resumes: 'Fetched resumes',
    get_resume_detail: 'Loaded resume',
    get_cover_letters: 'Fetched cover letters',
    get_cover_letter_detail: 'Loaded cover letter',
    get_emails: 'Fetched emails',
    get_email_detail: 'Loaded email',
    get_saved_jobs: 'Checked saved jobs',
    get_interview_questions: 'Fetched questions',
    create_artifact: 'Created document',
    update_artifact: 'Updated document',
    translate_artifact: 'Translated',
    save_resume: 'Saved resume',
    save_cover_letter: 'Saved cover letter',
    save_email: 'Saved email',
    score_resume: 'Scored resume',
    import_linkedin_profile: 'Imported LinkedIn',
    extract_profile_from_text: 'Extracted profile',
    update_user_profile: 'Updated profile',
    search_jobs: 'Found jobs',
    save_job: 'Saved job',
  };
  const loadingLabels: Record<string, string> = {
    get_user_profile: 'Reading profile',
    get_resumes: 'Fetching resumes',
    get_resume_detail: 'Loading resume',
    get_cover_letters: 'Fetching cover letters',
    get_cover_letter_detail: 'Loading cover letter',
    get_emails: 'Fetching emails',
    get_email_detail: 'Loading email',
    get_saved_jobs: 'Checking saved jobs',
    get_interview_questions: 'Fetching questions',
    create_artifact: 'Creating document',
    update_artifact: 'Updating document',
    translate_artifact: 'Translating',
    save_resume: 'Saving resume',
    save_cover_letter: 'Saving cover letter',
    save_email: 'Saving email',
    score_resume: 'Scoring resume',
    import_linkedin_profile: 'Importing from LinkedIn...',
    extract_profile_from_text: 'Extracting profile data...',
    update_user_profile: 'Saving profile...',
    search_jobs: 'Searching jobs...',
    save_job: 'Saving job...',
  };
  return state === 'result'
    ? (doneLabels[toolName] || toolName)
    : (loadingLabels[toolName] || toolName);
}

// Artifact type to icon + card styles
function getArtifactMeta(type: string) {
  switch (type) {
    case 'resume': return {
      icon: FileText,
      label: 'Resume',
      headerBg: 'bg-gradient-to-br from-[#3d5233] to-[#5b6949]',
      cardBg: 'linear-gradient(135deg, #f0f4ec 0%, #e8ede3 100%)',
      badge: 'bg-white/20 text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      line: 'bg-white/50',
      cta: 'bg-[#5b6949]/10 text-[#5b6949] hover:bg-[#5b6949]/20',
    };
    case 'cover_letter': return {
      icon: FileSignature,
      label: 'Cover Letter',
      headerBg: 'bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]',
      cardBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      badge: 'bg-white/20 text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      line: 'bg-white/50',
      cta: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    };
    case 'email': return {
      icon: Mail,
      label: 'Email',
      headerBg: 'bg-gradient-to-br from-[#92400e] to-[#f59e0b]',
      cardBg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      badge: 'bg-white/20 text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      line: 'bg-white/50',
      cta: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
    };
    default: return {
      icon: FileText,
      label: 'Document',
      headerBg: 'bg-gradient-to-br from-zinc-600 to-zinc-400',
      cardBg: 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)',
      badge: 'bg-white/20 text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      line: 'bg-white/50',
      cta: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
    };
  }
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <button
      className="absolute z-50 rounded-full p-1.5 bg-white/90 hover:bg-white border border-zinc-200 shadow-md left-1/2 -translate-x-1/2 bottom-2 transition-all"
      onClick={() => scrollToBottom()}
    >
      <ChevronDown className="h-3.5 w-3.5 text-[#5b6949]" />
    </button>
  );
}

// Rotating thinking phrases
const THINKING_PHASES = [
  'Thinking',
  'Analyzing',
  'Retrieving data',
  'Processing',
  'Crafting response',
  'Reasoning',
  'Generating',
];

function useThinkingPhase(isActive: boolean) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!isActive) { setPhase(0); return; }
    const interval = setInterval(() => {
      setPhase(p => (p + 1) % THINKING_PHASES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isActive]);
  return THINKING_PHASES[phase];
}

export default function ChatPanel({
  messages,
  isLoading,
  error,
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  onSubmit,
  onStop,
  onClear,
  className,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ name: string; text: string } | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thinkingPhase = useThinkingPhase(isLoading);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if ((!trimmed && !attachedFile) || isLoading) return;

    let messageText = trimmed;

    if (attachedFile) {
      const filePrefix = `[ATTACHED FILE: ${attachedFile.name}]\n\nExtracted text from the uploaded file:\n\n${attachedFile.text}`;
      messageText = messageText
        ? `${filePrefix}\n\nUser message: ${messageText}`
        : `${filePrefix}\n\nPlease extract my profile data from this resume and show me what you found.`;
      setAttachedFile(null);
    }

    onSubmit(messageText);
    setInput('');
  }, [input, isLoading, onSubmit, attachedFile]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      let extractedText = '';

      if (file.type === 'application/pdf') {
        extractedText = await pdfToText(file);
      } else if (file.type.startsWith('image/')) {
        // Use GPT-4o vision to extract text from image
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/super-agent/extract-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        const result = await res.json();
        if (result.success && result.text) {
          extractedText = result.text;
        } else {
          extractedText = `[Failed to extract text from image: ${result.error || 'Unknown error'}. Please paste the resume text manually instead.]`;
        }
      } else if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else {
        extractedText = await file.text();
      }

      if (extractedText.trim()) {
        setAttachedFile({ name: file.name, text: extractedText });
      }
    } catch (err) {
      console.error('File extraction error:', err);
      setAttachedFile({
        name: file.name,
        text: `[Failed to extract text from ${file.name}. The file may be scanned/image-based. Please paste the resume text manually instead.]`,
      });
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const hasMessages = messages.length > 0;

  // Hidden file input
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.txt,.doc,.docx,image/*"
      className="hidden"
      onChange={handleFileSelect}
    />
  );

  // File card rendered inside the input box
  const AttachedFileCard = () => {
    if (isExtracting) {
      return (
        <div className="flex items-center gap-3 px-1 pb-2 mb-2 border-b border-zinc-100">
          <div className="flex items-center gap-2.5 flex-1 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <div className="p-1.5 bg-zinc-200 rounded-lg animate-pulse shrink-0">
              <FileText className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-zinc-500">Reading file...</div>
              <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                Extracting text
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (!attachedFile) return null;
    return (
      <div className="flex items-center gap-3 px-1 pb-2 mb-1 border-b border-zinc-100">
        <div className="flex items-center gap-2.5 flex-1 p-2.5 bg-[#5b6949]/5 rounded-xl border border-[#5b6949]/15">
          <div className="p-1.5 bg-[#5b6949]/10 rounded-lg shrink-0">
            <FileText className="h-4 w-4 text-[#5b6949]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-zinc-700 truncate">{attachedFile.name}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Ready to send</div>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 hover:bg-[#5b6949]/10 rounded-lg transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
          </button>
        </div>
      </div>
    );
  };

  // ─── EMPTY STATE ─────────────
  if (!hasMessages) {
    return (
      <div className={cn('flex flex-col h-full bg-white', className)}>
        {fileInput}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {/* Logo / brand mark */}
          <div className="inline-flex p-3 bg-[#5b6949]/10 rounded-2xl mb-5">
            <BriefcaseBusiness className="h-7 w-7 text-[#5b6949]" />
          </div>
          <h2 className="text-2xl font-semibold text-zinc-800 mb-1">How can I help you?</h2>
          <p className="text-sm text-zinc-400 mb-8">Your AI career assistant — resumes, cover letters, job search & more</p>

          {/* Input bar */}
          <div className="w-full max-w-2xl">
            <div className="flex flex-col border border-zinc-200 rounded-2xl px-4 pt-3 pb-2.5 bg-white shadow-sm focus-within:border-[#5b6949]/40 focus-within:shadow-md transition-all">
              {/* Attached file card inside input */}
              <AttachedFileCard />

              {/* Textarea + buttons row */}
              <div className="flex items-end gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  className="h-5 w-5 text-[#5b6949]/50 shrink-0 mb-0.5 cursor-pointer hover:text-[#5b6949] transition-colors disabled:opacity-50"
                  title="Attach resume (PDF, image, or text)"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={attachedFile ? 'Add a message or press Enter to send...' : 'Type a message...'}
                  className="flex-1 min-h-6 max-h-40 resize-none text-sm text-zinc-800 placeholder:text-zinc-400 bg-transparent outline-none leading-relaxed"
                  rows={1}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() && !attachedFile}
                  className={cn(
                    'p-1.5 rounded-full transition-colors shrink-0 mb-0.5',
                    (input.trim() || attachedFile)
                      ? 'bg-[#5b6949] text-white hover:bg-[#4a5a3b]'
                      : 'bg-zinc-200 text-zinc-400'
                  )}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick action pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onSubmit(action.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-zinc-600 bg-white hover:bg-[#5b6949]/5 hover:text-[#5b6949] hover:border-[#5b6949]/30 rounded-full border border-zinc-200 transition-all"
                >
                  <action.icon className="h-3.5 w-3.5 text-[#5b6949]" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── CONVERSATION STATE ────────────────────────────────
  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {fileInput}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#5b6949] animate-pulse" />
          <span className="text-xs font-medium text-zinc-600">AI Agent</span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2 py-1 text-[11px] text-zinc-400 hover:text-[#5b6949] rounded-md transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <StickToBottom className="flex-1 overflow-hidden relative" resize="smooth" initial="smooth">
        <StickToBottom.Content className="flex flex-col py-4 max-w-2xl mx-auto w-full px-4">
          {messages.map((m, index) => (
            <React.Fragment key={m.id || index}>
              {/* Message */}
              {m.content && (
                <div className="mb-3">
                  <div className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={cn(
                      'max-w-[85%] text-[13px] leading-relaxed',
                      m.role === 'user'
                        ? 'bg-[#5b6949] text-white px-3.5 py-2 rounded-2xl rounded-br-sm'
                        : 'text-zinc-700'
                    )}>
                      {m.role === 'user' && m.content.startsWith('[ATTACHED FILE') ? (
                        (() => {
                          const fileNameMatch = m.content.match(/\[ATTACHED FILE:\s*(.+?)\]/);
                          const fileName = fileNameMatch?.[1] || 'Resume';
                          const userMsg = m.content.match(/User message:\s*([\s\S]+)/)?.[1]?.trim();
                          return (
                            <div className="space-y-2">
                              <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3 border border-white/15">
                                <div className="p-2 bg-white/15 rounded-lg shrink-0">
                                  <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[13px] font-medium text-white truncate">{fileName}</div>
                                  <div className="text-[11px] text-white/60 mt-0.5">Resume uploaded for extraction</div>
                                </div>
                                <Paperclip className="h-3.5 w-3.5 text-white/40 shrink-0 mt-1" />
                              </div>
                              {userMsg && <p className="text-[13px] text-white">{userMsg}</p>}
                            </div>
                          );
                        })()
                      ) : (
                        <MemoizedMarkdown id={m.id} content={m.content} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tool calls */}
              {m.toolInvocations && m.toolInvocations.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {m.toolInvocations.map((tool: ToolInvocation) => {
                    if (tool.toolName === 'create_artifact' || tool.toolName === 'update_artifact' || tool.toolName === 'translate_artifact') {
                      return null;
                    }
                    return (
                      <div
                        key={tool.toolCallId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#5b6949] bg-[#5b6949]/5 border border-[#5b6949]/15 rounded-full"
                      >
                        {tool.state === 'result' ? (
                          <Check className="h-3 w-3 text-[#5b6949]" />
                        ) : (
                          <Loader2 className="h-3 w-3 animate-spin text-[#5b6949]/60" />
                        )}
                        <span>{getToolLabel(tool.toolName, tool.state)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Artifact file cards */}
              {m.toolInvocations?.map((tool: ToolInvocation) => {
                if (tool.toolName !== 'create_artifact' || tool.state !== 'result') return null;
                const result = tool.result as { type?: string; title?: string; artifact_id?: string } | undefined;
                if (!result?.artifact_id) return null;
                const art = artifacts.find(a => a.id === result.artifact_id);
                if (!art) return null;
                const meta = getArtifactMeta(art.type);
                const Icon = meta.icon;
                const isActive = art.id === activeArtifactId;

                return (
                  <div key={tool.toolCallId + '-card'} className="mb-4">
                    <button
                      onClick={() => onSelectArtifact(art.id)}
                      className={cn(
                        'group w-64 rounded-2xl border overflow-hidden text-left transition-all duration-200',
                        isActive
                          ? 'border-transparent shadow-lg scale-[1.01]'
                          : 'border-zinc-200 hover:shadow-lg hover:scale-[1.01] hover:border-transparent'
                      )}
                      style={{ background: meta.cardBg }}
                    >
                      {/* Top accent strip + icon */}
                      <div className={cn('px-4 pt-4 pb-3', meta.headerBg)}>
                        <div className="flex items-center justify-between mb-3">
                          <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide', meta.badge)}>
                            <Icon className="h-3 w-3" />
                            {meta.label}
                            {art.language !== 'en' && ` · ${art.language.toUpperCase()}`}
                          </div>
                          <div className={cn('p-1.5 rounded-full', meta.iconBg)}>
                            <ArrowUp className={cn('h-3 w-3 rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5', meta.iconColor)} />
                          </div>
                        </div>
                        {/* Mini doc lines */}
                        <div className="space-y-1.5">
                          <div className={cn('h-1.5 rounded-full w-4/5', meta.line)} />
                          <div className={cn('h-1 rounded-full w-3/5 opacity-60', meta.line)} />
                          <div className={cn('h-1 rounded-full w-2/3 opacity-40', meta.line)} />
                        </div>
                      </div>

                      {/* Bottom info row */}
                      <div className="px-4 py-2.5 bg-white/90 backdrop-blur-sm flex items-center justify-between border-t border-white/20">
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="text-[13px] font-semibold text-zinc-800 truncate leading-tight">{art.title}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">Click to open</div>
                        </div>
                        <div className={cn('shrink-0 text-[10px] font-medium px-2 py-1 rounded-lg transition-colors', meta.cta)}>
                          Open
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* Thinking indicator */}
              {isLoading && index === messages.length - 1 &&
                (m.role === 'user' || (m.role === 'assistant' && !m.content && !m.toolInvocations?.length)) && (
                <div className="mb-3">
                  <div className="flex items-center gap-2.5 py-2">
                    <div className="relative h-5 w-5 shrink-0">
                      <div className="absolute inset-0 rounded-full border-2 border-[#5b6949]/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-[#5b6949] border-t-transparent animate-spin" />
                    </div>
                    <span className="text-[13px] text-[#5b6949]/70 animate-pulse">{thinkingPhase}...</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
              {error.message}
            </div>
          )}
        </StickToBottom.Content>
        <ScrollToBottom />
      </StickToBottom>

      {/* Input bar / Thinking bar */}
      <div className="border-t border-zinc-100 shrink-0">
        <div className="max-w-2xl mx-auto w-full px-4 py-2.5">
          {isLoading ? (
            /* ── Thinking bar with abort ── */
            <div className="flex items-center justify-between border border-[#5b6949]/20 rounded-2xl px-4 py-2.5 bg-[#5b6949]/5">
              <div className="flex items-center gap-2.5">
                <div className="relative h-4 w-4 shrink-0">
                  <div className="absolute inset-0 rounded-full border-2 border-[#5b6949]/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#5b6949] border-t-transparent animate-spin" />
                </div>
                <span className="text-[13px] text-[#5b6949] font-medium animate-pulse">{thinkingPhase}...</span>
              </div>
              <button
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200 text-zinc-600 text-[12px] font-medium rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <Square className="h-3 w-3" />
                Stop
              </button>
            </div>
          ) : (
            /* ── Normal input bar — file card inside ── */
            <div className="flex flex-col border border-zinc-200 rounded-2xl px-3.5 pt-2.5 pb-2 bg-white focus-within:border-[#5b6949]/40 focus-within:shadow-sm transition-all">
              <AttachedFileCard />
              <div className="flex items-end gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  className="p-0.5 text-[#5b6949]/50 hover:text-[#5b6949] transition-colors shrink-0 mb-0.5 disabled:opacity-50"
                  title="Attach resume (PDF, image, or text)"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={attachedFile ? 'Add a message or press Enter to send...' : 'Type a message...'}
                  className="flex-1 min-h-6 max-h-28 resize-none text-[13px] text-zinc-800 placeholder:text-zinc-400 bg-transparent outline-none leading-relaxed"
                  rows={1}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() && !attachedFile}
                  className={cn(
                    'p-1.5 rounded-full transition-colors shrink-0',
                    (input.trim() || attachedFile)
                      ? 'bg-[#5b6949] text-white hover:bg-[#4a5a3b]'
                      : 'bg-zinc-200 text-zinc-400'
                  )}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
