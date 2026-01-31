'use client';


import React, { useEffect, useCallback, useState } from 'react';
import { useChat } from 'ai/react';
import { Card } from "@/components/ui/card";
import { Bot, Trash2, Pencil, ChevronDown, RefreshCw } from "lucide-react";
import { Education, Project, Resume, Skill, WorkExperience, Job } from '@/lib/types';
import { Message } from 'ai';
import { cn } from '@/lib/utils';
import { ToolInvocation } from 'ai';
import { MemoizedMarkdown } from '@/components/ui/memoized-markdown';
import { Suggestion } from './suggestions';
import { SuggestionSkeleton } from './suggestion-skeleton';
import ChatInput from './chat-input';
import { LoadingDots } from '@/components/ui/loading-dots';
import { ApiKey } from '@/utils/ai-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { WholeResumeSuggestion } from './suggestions';
import { QuickSuggestions } from './quick-suggestions';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApiKeyErrorAlert } from '@/components/ui/api-key-error-alert';
import { Textarea } from '@/components/ui/textarea';




const LOCAL_STORAGE_KEY = 'Auto Talent-api-keys';
const MODEL_STORAGE_KEY = 'Auto Talent-default-model';

interface ChatBotProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[typeof field]) => void;
  job?: Job | null;
  isAgentMode?: boolean;
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <button
        className={cn(
          "absolute z-50 rounded-full p-2",
          "bg-white/80 hover:bg-white",
          "border border-zinc-200/60 hover:border-zinc-300/60",
          "shadow-lg shadow-zinc-500/5 hover:shadow-zinc-500/10",
          "transition-all duration-300",
          "left-[50%] translate-x-[-50%] bottom-4"
        )}
        onClick={() => scrollToBottom()}
      >
        <ChevronDown className="h-4 w-4 text-zinc-600" />
      </button>
    )
  );
}

export default function ChatBot({ resume, onResumeChange, job, isAgentMode = false }: ChatBotProps) {
  const router = useRouter();
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [apiKeys, setApiKeys] = React.useState<ApiKey[]>([]);
  const [defaultModel, setDefaultModel] = React.useState<string>('gpt-4o-mini');
  const [originalResume, setOriginalResume] = React.useState<Resume | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  // Load settings from local storage
  useEffect(() => {
    const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    
    if (storedKeys) {
      try {
        setApiKeys(JSON.parse(storedKeys));
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    }

    if (storedModel) {
      setDefaultModel(storedModel);
    }
  }, []);

  const config = {
    model: defaultModel,
    apiKeys,
  };
  
  const { messages, error, append, isLoading, addToolResult, stop, setMessages } = useChat({
    api: '/api/chat',
    body: {
      target_role: resume.target_role,
      resume: resume,
      config,
      job: job,
    },
    maxSteps: 5,
    onResponse() {
 
      setIsInitialLoading(false);
    },
    onError() {
      setIsInitialLoading(false);
    },
    async onToolCall({ toolCall }) {
      // setIsStreaming(false);
      
      if (toolCall.toolName === 'getResume') {
        const params = toolCall.args as { sections: string[] };
        
        const personalInfo = {
          first_name: resume.first_name,
          last_name: resume.last_name,
          email: resume.email,
          phone_number: resume.phone_number,
          location: resume.location,
          website: resume.website,
          linkedin_url: resume.linkedin_url,
          github_url: resume.github_url,
        };

        const sectionMap = {
          personal_info: personalInfo,
          work_experience: resume.work_experience,
          education: resume.education,
          skills: resume.skills,
          projects: resume.projects,
        };

        const result = params.sections.includes('all')
          ? { ...sectionMap, target_role: resume.target_role }
          : params.sections.reduce((acc, section) => ({
              ...acc,
              [section]: sectionMap[section as keyof typeof sectionMap]
            }), {});
        
        addToolResult({ toolCallId: toolCall.toolCallId, result });
        console.log('Tool call READ RESUME result:', result);
        return result;
      }

      if (toolCall.toolName === 'suggest_work_experience_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_project_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_skill_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_education_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'modifyWholeResume') {
        const updates = toolCall.args as {
          basic_info?: Partial<{
            first_name: string;
            last_name: string;
            email: string;
            phone_number: string;
            location: string;
            website: string;
            linkedin_url: string;
            github_url: string;
          }>;
          work_experience?: WorkExperience[];
          education?: Education[];
          skills?: Skill[];
          projects?: Project[];
        };
        
        // Store the current resume state before applying updates
        setOriginalResume({ ...resume });
        
        // Apply updates as before
        if (updates.basic_info) {
          Object.entries(updates.basic_info).forEach(([key, value]) => {
            if (value !== undefined) {
              onResumeChange(key as keyof Resume, value);
            }
          });
        }

        const sections = {
          work_experience: updates.work_experience,
          education: updates.education,
          skills: updates.skills,
          projects: updates.projects,
        };

        Object.entries(sections).forEach(([key, value]) => {
          if (value !== undefined) {
            onResumeChange(key as keyof Resume, value);
          }
        });

        return (
          <div key={toolCall.toolCallId} className="mt-2 w-[90%]">
            <WholeResumeSuggestion
              onReject={() => {
                // Restore the original resume state
                if (originalResume) {
                  // Restore basic info
                  Object.keys(originalResume).forEach((key) => {
                    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                      onResumeChange(key as keyof Resume, originalResume[key as keyof Resume]);
                    }
                  });
                  
                  // Clear the stored original state
                  setOriginalResume(null);
                }
              }}
            />
          </div>
        );
      }
    },
    onFinish() {
      setIsInitialLoading(false);
    },
    // onResponse(response) {
    //   setIsStreaming(true);
    // },
  });

  // Memoize the submit handler
  const handleSubmit = useCallback((message: string) => {
  
    
    setIsInitialLoading(true);
    append({ 
      content: message.replace(/\s+$/, ''), // Extra safety: trim trailing whitespace
      role: 'user' 
    });
    
    
    setAccordionValue("chat");
  }, [append]);

  // Add delete handler
  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  // Add edit handler
  const handleEdit = (id: string, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  // Add save handler
  const handleSaveEdit = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, content: editContent }
        : message
    ));
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setOriginalResume(null);
    setEditingMessageId(null);
    setEditContent("");
  }, [setMessages]);

  // Agent mode - full screen chat interface
  if (isAgentMode) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#5b6949] text-white rounded-xl">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">AI Assistant</h2>
              <p className="text-sm text-zinc-500">Powered by Advanced AI</p>
            </div>
          </div>
          <Button
            onClick={handleClearChat}
            disabled={messages.length === 0}
            variant="ghost"
            size="sm"
            className="text-zinc-600 hover:text-[#5b6949] hover:bg-zinc-50 h-9 px-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>

        {/* Messages Area */}
        <StickToBottom className="flex-1 overflow-hidden relative" resize="smooth" initial="smooth">
          <StickToBottom.Content className="flex flex-col px-6 py-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full space-y-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-5 bg-[#5b6949]/10 text-[#5b6949] mx-auto rounded-2xl">
                      <Bot className="h-14 w-14" />
                    </div>
                    <h3 className="text-3xl font-semibold text-zinc-900">How can I help you today?</h3>
                    <p className="text-base text-zinc-500">Ask me anything about your resume or get suggestions for improvement</p>
                  </div>
                  <QuickSuggestions onSuggestionClick={handleSubmit} />
                </div>
              </div>
            ) : (
              <>
                {messages.map((m: Message, index) => (
                  <React.Fragment key={index}>
                    {/* Regular Message Content */}
                    {m.content && (
                      <div className="mb-6">
                        <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={cn(
                            "max-w-[85%] px-5 py-4 text-base relative group rounded-2xl",
                            m.role === 'user' ? [
                              "bg-[#5b6949]",
                              "text-white",
                              "ml-auto"
                            ] : [
                              "bg-zinc-50",
                              "border border-zinc-200"
                            ]
                          )}>
                            {editingMessageId === m.id ? (
                              <div className="flex flex-col gap-3">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className={cn(
                                    "w-full min-h-[120px] p-4 text-base",
                                    "bg-white rounded-xl",
                                    "border border-zinc-200 focus:border-[#5b6949]",
                                    "focus:outline-none focus:ring-2 focus:ring-[#5b6949]/20"
                                  )}
                                />
                                <button
                                  onClick={() => handleSaveEdit(m.id)}
                                  className="self-end px-5 py-2.5 text-sm bg-[#5b6949] text-white hover:bg-[#5b6949]/90 transition-colors rounded-lg font-medium"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <MemoizedMarkdown id={m.id} content={m.content} />
                            )}

                            {/* Message Actions */}
                            <div className="absolute -bottom-6 left-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDelete(m.id)}
                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                aria-label="Delete message"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleEdit(m.id, m.content)}
                                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                aria-label="Edit message"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tool Invocations */}
                    {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                      const { toolName, toolCallId, state, args } = toolInvocation;
                      switch (state) {
                        case 'partial-call':
                        case 'call':
                          return (
                            <div key={toolCallId} className="mb-6">
                              <div className="flex justify-start">
                                {toolName === 'getResume' ? (
                                  <div className="px-5 py-4 text-base bg-zinc-50 border border-zinc-200 rounded-2xl">
                                    Reading Resume...
                                  </div>
                                ) : toolName === 'modifyWholeResume' ? (
                                  <div className="px-5 py-4 text-base bg-zinc-50 border border-zinc-200 rounded-2xl">
                                    Preparing resume modifications...
                                  </div>
                                ) : toolName.startsWith('suggest_') ? (
                                  <SuggestionSkeleton />
                                ) : null}
                              </div>
                            </div>
                          );

                        case 'result':
                          const toolConfig = {
                            suggest_work_experience_improvement: {
                              type: 'work_experience' as const,
                              field: 'work_experience',
                              content: 'improved_experience',
                            },
                            suggest_project_improvement: {
                              type: 'project' as const,
                              field: 'projects',
                              content: 'improved_project',
                            },
                            suggest_skill_improvement: {
                              type: 'skill' as const,
                              field: 'skills',
                              content: 'improved_skill',
                            },
                            suggest_education_improvement: {
                              type: 'education' as const,
                              field: 'education',
                              content: 'improved_education',
                            },
                            modifyWholeResume: {
                              type: 'whole_resume' as const,
                              field: 'all',
                              content: null,
                            },
                          } as const;
                          const config = toolConfig[toolName as keyof typeof toolConfig];

                          if (!config) return null;

                          if (toolName === 'getResume') {
                            return (
                              <div key={toolCallId} className="mb-6">
                                <div className="flex justify-start">
                                  <div className="px-5 py-4 text-base bg-zinc-50 border border-zinc-200 rounded-2xl">
                                    {args.message}
                                    <p>Read Resume ✅</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          if (config.type === 'whole_resume') {
                            if (!originalResume) {
                              setOriginalResume({ ...resume });
                            }

                            return (
                              <div key={toolCallId} className="mb-6">
                                <WholeResumeSuggestion
                                  onReject={() => {
                                    if (originalResume) {
                                      Object.keys(originalResume).forEach((key) => {
                                        if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                                          onResumeChange(key as keyof Resume, originalResume[key as keyof Resume]);
                                        }
                                      });
                                      setOriginalResume(null);
                                    }
                                  }}
                                />
                              </div>
                            );
                          }

                          return (
                            <div key={toolCallId} className="mb-6">
                              <Suggestion
                                type={config.type}
                                content={args[config.content]}
                                currentContent={resume[config.field][args.index]}
                                onAccept={() => onResumeChange(config.field,
                                  resume[config.field].map((item: WorkExperience | Education | Project | Skill, i: number) =>
                                    i === args.index ? args[config.content] : item
                                  )
                                )}
                                onReject={() => {}}
                              />
                            </div>
                          );

                        default:
                          return null;
                      }
                    })}

                    {/* Loading Indicator */}
                    {((isInitialLoading && index === messages.length - 1 && m.role === 'user') ||
                      (isLoading && index === messages.length - 1 && m.role === 'assistant')) && (
                      <div className="mb-6">
                        <div className="flex justify-start">
                          <div className="px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
                            <LoadingDots className="text-zinc-600" />
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}

            {error && (
              error.message === "Rate limit exceeded. Try again later." ? (
                <div className="p-4 text-sm bg-red-50 border border-red-200 text-red-700">
                  <p>You&apos;ve used all your available messages. Please try again after:</p>
                  <p className="font-medium mt-2">
                    {new Date(Date.now() + 5 * 60 * 60 * 1000).toLocaleString()}
                  </p>
                </div>
              ) : (
                <ApiKeyErrorAlert error={error} router={router} />
              )
            )}
          </StickToBottom.Content>

          <ScrollToBottom />
        </StickToBottom>

        {/* Input Area */}
        <div className="border-t border-zinc-200 bg-white px-6 py-4">
          <ChatInput
            isLoading={isLoading}
            onSubmit={handleSubmit}
            onStop={stop}
          />
        </div>
      </div>
    );
  }

  // Original accordion mode
  return (
    <Card className={cn(
      "flex flex-col w-full h-full mx-auto",
      "bg-white",
      "border-0",
      "transition-colors duration-200",
      "overflow-hidden",
      "relative"
    )}>


      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
        className="relative z-10 "
      >
        <AccordionItem value="chat" className="border-none py-0 my-0">

          {/* Accordion Trigger */}
          <div className="relative">
            <AccordionTrigger className={cn(
              "px-3 py-3",
              "hover:no-underline",
              "group",
              "transition-colors duration-200",
              "data-[state=open]:border-b border-zinc-200",
              "bg-zinc-50 hover:bg-zinc-100"
            )}>
              <div className="flex items-center w-full">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-[#5b6949]" />
                  <Logo className="text-sm" asLink={false} />
                </div>
              </div>
            </AccordionTrigger>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  className={cn(
                    "absolute right-8 top-1/2 -translate-y-1/2",
                    "px-3 py-1.5 h-auto",
                    "bg-white text-[#5b6949] border border-[#5b6949]",
                    "hover:bg-[#5b6949] hover:text-white",
                    "transition-colors duration-200",
                    "disabled:opacity-50",
                    "flex items-center gap-2",
                    (accordionValue !== "chat" || isAlertOpen) && "hidden",
                  )}
                  disabled={messages.length === 0}
                  aria-label="Clear chat history"
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span className="text-xs font-medium">Clear Chat</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={cn(
                "bg-white/95 backdrop-blur-xl",
                "border-zinc-200/60",
                "shadow-lg shadow-zinc-500/5"
              )}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Chat History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all messages and reset the chat. This action can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={cn(
                    "border-zinc-200/60",
                    "hover:bg-zinc-50/50",
                    "hover:text-[#5b6949]"
                  )}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearChat}
                    className={cn(
                      "bg-[#5b6949] text-white",
                      "hover:bg-[#5b6949]/90",
                      "focus:ring-[#5b6949]"
                    )}
                  >
                    Clear Chat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Accordion Content */}
          <AccordionContent className="space-y-4">
            <StickToBottom className="h-[60vh] px-4 relative custom-scrollbar" resize="smooth" initial="smooth">
              <StickToBottom.Content className="flex flex-col custom-scrollbar">
                {messages.length === 0 ? (
                  <QuickSuggestions onSuggestionClick={handleSubmit} />
                ) : (
                  <>
                    {/* Messages */}
                    {messages.map((m: Message, index) => (
                      <React.Fragment key={index}>

                        {/* Regular Message Content */}
                        {m.content && (
                          <div className="my-2">
                            <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={cn(
                                "px-4 py-2 max-w-[90%] text-sm relative group items-center",
                                m.role === 'user' ? [
                                  "bg-[#5b6949]",
                                  "text-white",
                                  "ml-auto pb-0"
                                ] : [
                                  "bg-zinc-50",
                                  "border border-zinc-200",
                                  "pb-0"
                                ]
                              )}>

                                {/* Edit Message */}
                                {editingMessageId === m.id ? (
                                  <div className="flex flex-col gap-2">
                                    <Textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className={cn(
                                        "w-full min-h-[100px] p-2",
                                        "bg-white",
                                        m.role === 'user'
                                          ? "text-[#5b6949] placeholder-zinc-400"
                                          : "text-gray-900 placeholder-gray-400",
                                        "border border-zinc-200 focus:border-[#5b6949]",
                                        "focus:outline-none focus:ring-1 focus:ring-[#5b6949]"
                                      )}
                                    />
                                    <button
                                      onClick={() => handleSaveEdit(m.id)}
                                      className={cn(
                                        "self-end px-3 py-1.5 text-xs h-auto",
                                        "bg-[#5b6949] text-white",
                                        "hover:bg-[#5b6949]/90",
                                        "transition-colors duration-200"
                                      )}
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <MemoizedMarkdown id={m.id} content={m.content} />
                                )}

                                {/* Message Actions */}
                                <div className="absolute -bottom-4 left-2 flex gap-2">
                                  <button
                                    onClick={() => handleDelete(m.id)}
                                    className={cn(
                                      "transition-colors duration-200",
                                      m.role === 'user' 
                                        ? "text-[#5b6949]/60 hover:text-[#5b6949]"
                                        : "text-zinc-400/60 hover:text-zinc-500",
                                    )}
                                    aria-label="Delete message"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(m.id, m.content)}
                                    className={cn(
                                      "transition-colors duration-200",
                                      m.role === 'user' 
                                        ? "text-[#5b6949]/60 hover:text-[#5b6949]"
                                        : "text-zinc-400/60 hover:text-zinc-500",
                                    )}
                                    aria-label="Edit message"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Tool Invocations as Separate Bubbles */}
                        {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                          const { toolName, toolCallId, state, args } = toolInvocation;
                          switch (state) {
                            case 'partial-call':
                            case 'call':
                              return (
                                <div key={toolCallId} className="mt-2 max-w-[90%]">
                                  <div className="flex justify-start max-w-[90%]">
                                    {toolName === 'getResume' ? (
                                      <div className={cn(
                                        "px-4 py-2 max-w-[90%] text-sm",
                                        "bg-zinc-50 border border-zinc-200"
                                      )}>
                                        Reading Resume...
                                      </div>
                                    ) : toolName === 'modifyWholeResume' ? (
                                      <div className={cn(
                                        "w-full px-4 py-2",
                                        "bg-zinc-50 border border-zinc-200"
                                      )}>
                                        Preparing resume modifications...
                                      </div>
                                    ) : toolName.startsWith('suggest_') ? (
                                      <SuggestionSkeleton />
                                    ) : null}
                                    {toolName === 'displayWeather' ? (
                                      <div>Loading weather...</div>
                                    ) : null}
                                  </div>
                                </div>
                              );

                            case 'result':
                              // Map tool names to resume sections and handle suggestions
                              const toolConfig = {
                                suggest_work_experience_improvement: {
                                  type: 'work_experience' as const,
                                  field: 'work_experience',
                                  content: 'improved_experience',
                                },
                                suggest_project_improvement: {
                                  type: 'project' as const,
                                  field: 'projects',
                                  content: 'improved_project',
                                },
                                suggest_skill_improvement: {
                                  type: 'skill' as const,
                                  field: 'skills',
                                  content: 'improved_skill',
                                },
                                suggest_education_improvement: {
                                  type: 'education' as const,
                                  field: 'education',
                                  content: 'improved_education',
                                },
                                modifyWholeResume: {
                                  type: 'whole_resume' as const,
                                  field: 'all',
                                  content: null,
                                },
                              } as const;
                              const config = toolConfig[toolName as keyof typeof toolConfig];

                              if (!config) return null;

                              // Handle specific tool results
                              if (toolName === 'getResume') {
                                return (
                                  <div key={toolCallId} className="mt-2 w-[90%]">
                                    <div className="flex justify-start">
                                      <div className={cn(
                                        "px-4 py-2 max-w-[90%] text-sm",
                                        "bg-zinc-50 border border-zinc-200"
                                      )}>
                                        {args.message}
                                        <p>Read Resume ✅</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              if (config.type === 'whole_resume') {
                                // Store original state before applying updates
                                if (!originalResume) {
                                  setOriginalResume({ ...resume });
                                }

                                return (
                                  <div key={toolCallId} className="mt-2 w-[90%]">
                                    <WholeResumeSuggestion
                                      onReject={() => {
                                        if (originalResume) {
                                          Object.keys(originalResume).forEach((key) => {
                                            if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                                              onResumeChange(key as keyof Resume, originalResume[key as keyof Resume]);
                                            }
                                          });
                                          setOriginalResume(null);
                                        }
                                      }}
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div key={toolCallId} className="mt-2 w-[90%]">
                                  <div className="">
                                    <Suggestion
                                      type={config.type}
                                      content={args[config.content]}
                                      currentContent={resume[config.field][args.index]}
                                      onAccept={() => onResumeChange(config.field, 
                                        resume[config.field].map((item: WorkExperience | Education | Project | Skill, i: number) => 
                                          i === args.index ? args[config.content] : item
                                        )
                                      )}
                                      onReject={() => {}}
                                    />
                                  </div>
                                </div>
                              );

                            default:
                              return null;
                          }
                        })}


                        {/* Loading Dots Message - Modified condition */}
                        {((isInitialLoading && index === messages.length - 1 && m.role === 'user') ||
                          (isLoading && index === messages.length - 1 && m.role === 'assistant')) && (
                          <div className="mt-2">
                            <div className="flex justify-start">
                              <div className={cn(
                                "px-4 py-2.5 min-w-[60px]",
                                "bg-zinc-50",
                                "border border-zinc-200"
                              )}>
                                <LoadingDots className="text-zinc-600" />
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
              
                {error && (
                  error.message === "Rate limit exceeded. Try again later." ? (
                    <div className={cn(
                      "p-4 text-sm",
                      "bg-red-50 border border-red-200",
                      "text-red-700"
                    )}>
                      <p>You&apos;ve used all your available messages. Please try again after:</p>
                      <p className="font-medium mt-2">
                        {new Date(Date.now() + 5 * 60 * 60 * 1000).toLocaleString()} {/* 5 hours from now */}
                      </p>
                    </div>
                  ) : (
                    <ApiKeyErrorAlert 
                      error={error} 
                      router={router} 
                    />
                  )
                )}
              </StickToBottom.Content>

              <ScrollToBottom />
            </StickToBottom>
            
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Input Bar */}
      <ChatInput
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </Card>
  );
}