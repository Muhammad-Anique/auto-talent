'use client';

import { User, Briefcase, FolderGit2, GraduationCap, Wrench, LayoutTemplate } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function ResumeEditorTabs() {
  return (
    <>
      {/* Enhanced second row with Resume Score and Cover Letter */}
      <div className="my-3">
        <TabsList className="h-auto w-full bg-white border border-zinc-200 overflow-hidden grid grid-cols-3 gap-0 p-0">
          {/* Resume Score */}
          <TabsTrigger
            value="resume-score"
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-3 font-medium relative transition-all duration-200",
              "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
              "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
              "border-r border-zinc-200"
            )}
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span className="text-sm whitespace-nowrap">Resume Score</span>
          </TabsTrigger>

          {/* Cover Letter */}
          <TabsTrigger
            value="cover-letter"
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-3 font-medium relative transition-all duration-200",
              "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
              "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
              "border-r border-zinc-200"
            )}
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <span className="text-sm whitespace-nowrap">Cover Letter</span>
          </TabsTrigger>

          {/* Follow Up Email */}
          <TabsTrigger
            value="follow-up-email"
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-3 font-medium relative transition-all duration-200",
              "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
              "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50"
            )}
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <span className="text-sm whitespace-nowrap">Follow Up</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsList className="h-auto w-full bg-white border border-zinc-200 overflow-hidden grid grid-cols-3 @[500px]:grid-cols-6 gap-0 p-0">
        {/* Basic Info Tab */}
        <TabsTrigger
          value="basic"
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-2.5 font-medium relative transition-all duration-200",
            "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
            "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
            "border-r border-zinc-200"
          )}
        >
          <User className="h-4 w-4" />
          <span className="text-xs whitespace-nowrap">Basic</span>
        </TabsTrigger>

        {/* Work Tab */}
        <TabsTrigger
          value="work"
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-2.5 font-medium relative transition-all duration-200",
            "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
            "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
            "border-r border-zinc-200"
          )}
        >
          <Briefcase className="h-4 w-4" />
          <span className="text-xs whitespace-nowrap">Work</span>
        </TabsTrigger>

        {/* Projects Tab */}
        <TabsTrigger
          value="projects"
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-2.5 font-medium relative transition-all duration-200",
            "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
            "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
            "border-r border-zinc-200"
          )}
        >
          <FolderGit2 className="h-4 w-4" />
          <span className="text-xs whitespace-nowrap">Projects</span>
        </TabsTrigger>

        {/* Education Tab */}
        <TabsTrigger
          value="education"
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-2.5 font-medium relative transition-all duration-200",
            "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
            "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
            "border-r border-zinc-200"
          )}
        >
          <GraduationCap className="h-4 w-4" />
          <span className="text-xs whitespace-nowrap">Education</span>
        </TabsTrigger>

        {/* Skills Tab */}
        <TabsTrigger
          value="skills"
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-2.5 font-medium relative transition-all duration-200",
            "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
            "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50",
            "border-r border-zinc-200"
          )}
        >
          <Wrench className="h-4 w-4" />
          <span className="text-xs whitespace-nowrap">Skills</span>
        </TabsTrigger>

        {/* Settings Tab */}
        <TabsTrigger
          value="settings"
          className={cn(
            "flex items-center justify-center gap-1.5 px-2 py-2.5 font-medium relative transition-all duration-200",
            "data-[state=active]:bg-[#5b6949] data-[state=active]:text-white",
            "data-[state=inactive]:text-zinc-600 data-[state=inactive]:hover:text-[#5b6949] data-[state=inactive]:hover:bg-zinc-50"
          )}
        >
          <LayoutTemplate className="h-4 w-4" />
          <span className="text-xs whitespace-nowrap">Layout</span>
        </TabsTrigger>
      </TabsList>
    </>
  );
} 