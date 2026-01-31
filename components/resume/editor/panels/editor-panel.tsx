"use client";

import { Resume, Profile, Job, DocumentSettings } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useRef } from "react";
import { cn } from "@/lib/utils";
import { ResumeEditorActions } from "../actions/resume-editor-actions";
import { TailoredJobAccordion } from "../../management/cards/tailored-job-card";
import { BasicInfoForm } from "../forms/basic-info-form";
import ChatBot from "../../assistant/chatbot";
import { CoverLetterPanel } from "./cover-letter-panel";
import { FollowUpEmailPanel } from "./follow-up-email-panel";
import {
  WorkExperienceForm,
  EducationForm,
  SkillsForm,
  ProjectsForm,
  DocumentSettingsForm,
} from "../dynamic-components";
import { ResumeEditorTabs } from "../header/resume-editor-tabs";
import ResumeScorePanel from "./resume-score-panel";
import { Edit3, Bot } from "lucide-react";

interface EditorPanelProps {
  resume: Resume;
  profile: Profile;
  job: Job | null;
  isLoadingJob: boolean;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
}

export function EditorPanel({
  resume,
  profile,
  job,
  isLoadingJob,
  onResumeChange,
}: EditorPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col sm:mr-4 bg-white  rounded-md border border-gray-200 relative h-full max-h-full">
      {/* Main Editor/Agent Tabs */}
      <Tabs
        defaultValue="editor"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="border-b border-zinc-200 bg-white">
          <TabsList className="w-full h-auto p-0 bg-transparent border-none grid grid-cols-2 gap-0">
            <TabsTrigger
              value="editor"
              className={cn(
                "relative h-12 rounded-none border-b-2 border-transparent",
                "data-[state=active]:border-[#5b6949] data-[state=active]:bg-zinc-50",
                "data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
                "transition-all duration-200 font-medium text-sm",
              )}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="agent"
              className={cn(
                "relative h-12 rounded-none border-b-2 border-transparent",
                "data-[state=active]:border-[#5b6949] data-[state=active]:bg-zinc-50",
                "data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
                "transition-all duration-200 font-medium text-sm",
              )}
            >
              <Bot className="h-4 w-4 mr-2" />
              Agent
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Editor Tab Content */}
        <TabsContent value="editor" className="flex-1 overflow-hidden mt-0">
          <div className="flex-1 flex flex-col overflow-scroll h-full">
            <ScrollArea className="flex-1 sm:pr-2" ref={scrollAreaRef}>
              <div className="relative pb-4">
                <div
                  className={cn(
                    "sticky top-0 z-20 bg-white border-b border-zinc-200",
                    resume.is_base_resume ? "bg-zinc-50" : "bg-white",
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <ResumeEditorActions onResumeChange={onResumeChange} />
                  </div>
                </div>

                {/* Tailored Job Accordion */}
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="basic"
                  className="mt-6"
                >
                  <TailoredJobAccordion
                    resume={resume}
                    job={job}
                    isLoading={isLoadingJob}
                  />
                </Accordion>

                {/* Tabs */}
                <Tabs defaultValue="basic" className="mb-4">
                  <ResumeEditorTabs />

                  {/* Basic Info Form */}
                  <TabsContent value="basic">
                    <BasicInfoForm profile={profile} />
                  </TabsContent>

                  {/* Work Experience Form */}
                  <TabsContent value="work">
                    <Suspense
                      fallback={
                        <div className="space-y-4 animate-pulse">
                          <div className="h-8 bg-muted w-1/3" />
                          <div className="h-24 bg-muted" />
                          <div className="h-24 bg-muted" />
                        </div>
                      }
                    >
                      <WorkExperienceForm
                        experiences={resume.work_experience}
                        onChange={(experiences) =>
                          onResumeChange("work_experience", experiences)
                        }
                        profile={profile}
                        targetRole={resume.target_role}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Projects Form */}
                  <TabsContent value="projects">
                    <Suspense
                      fallback={
                        <div className="space-y-4 animate-pulse">
                          <div className="h-8 bg-muted w-1/3" />
                          <div className="h-24 bg-muted" />
                        </div>
                      }
                    >
                      <ProjectsForm
                        projects={resume.projects}
                        onChange={(projects) =>
                          onResumeChange("projects", projects)
                        }
                        profile={profile}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Education Form */}
                  <TabsContent value="education">
                    <Suspense
                      fallback={
                        <div className="space-y-4 animate-pulse">
                          <div className="h-8 bg-muted w-1/3" />
                          <div className="h-24 bg-muted" />
                        </div>
                      }
                    >
                      <EducationForm
                        education={resume.education}
                        onChange={(education) =>
                          onResumeChange("education", education)
                        }
                        profile={profile}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Skills Form */}
                  <TabsContent value="skills">
                    <Suspense
                      fallback={
                        <div className="space-y-4 animate-pulse">
                          <div className="h-8 bg-muted w-1/3" />
                          <div className="h-24 bg-muted" />
                        </div>
                      }
                    >
                      <SkillsForm
                        skills={resume.skills}
                        onChange={(skills) => onResumeChange("skills", skills)}
                        profile={profile}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Document Settings Form */}
                  <TabsContent value="settings">
                    <Suspense
                      fallback={
                        <div className="space-y-4 animate-pulse">
                          <div className="h-8 bg-muted w-1/3" />
                          <div className="h-24 bg-muted" />
                        </div>
                      }
                    >
                      <DocumentSettingsForm
                        documentSettings={resume.document_settings!}
                        onChange={(
                          _field: "document_settings",
                          value: DocumentSettings,
                        ) => {
                          onResumeChange("document_settings", value);
                        }}
                      />
                    </Suspense>
                  </TabsContent>

                  {/* Cover Letter Form */}
                  <TabsContent value="cover-letter">
                    <CoverLetterPanel resume={resume} job={job} />
                  </TabsContent>

                  {/* Follow Up Email Form */}
                  <TabsContent value="follow-up-email">
                    <FollowUpEmailPanel resume={resume} job={job} />
                  </TabsContent>

                  {/* Resume Score Form */}
                  <TabsContent value="resume-score">
                    <ResumeScorePanel resume={resume} />
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Agent Tab Content */}
        <TabsContent value="agent" className="flex-1 overflow-hidden mt-0">
          <div className="h-full flex flex-col">
            <ChatBot
              resume={resume}
              onResumeChange={onResumeChange}
              job={job}
              isAgentMode={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
