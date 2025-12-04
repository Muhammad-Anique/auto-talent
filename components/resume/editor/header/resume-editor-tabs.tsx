'use client';

import { User, Briefcase, FolderGit2, GraduationCap, Wrench, LayoutTemplate } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeEditorTabs() {
  return (
    <>
      {/* Enhanced second row with Resume Score and Cover Letter */}
      <div className="my-2">
        <TabsList className="h-full w-full relative bg-zinc-50/80 backdrop-blur-xl border border-zinc-200 rounded-xl overflow-hidden grid grid-cols-2 gap-0.5 p-0.5 shadow-lg">
          {/* Resume Score */}
          <TabsTrigger 
            value="resume-score" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold relative transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
              data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
              data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
          >
            <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
              <svg className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="relative text-sm whitespace-nowrap">
              Resume Score
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
            </span>
          </TabsTrigger>

          {/* Cover Letter */}
          <TabsTrigger 
            value="cover-letter" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold relative transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
              data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
              data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
          >
            <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
              <svg className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span className="relative text-sm whitespace-nowrap">
              Cover Letter
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="follow-up-email" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold relative transition-all duration-300
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
              data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
              data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
          >
            <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
              <svg className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span className="relative text-sm whitespace-nowrap">
              Follow Up Email
              <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsList className="h-full w-full relative bg-zinc-50/80 backdrop-blur-xl border border-zinc-200 rounded-xl overflow-hidden grid grid-cols-3 @[500px]:grid-cols-6 gap-0.5 p-0.5 shadow-lg">
        {/* Basic Info Tab */}
        <TabsTrigger 
          value="basic" 
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
            data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
            data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
        >
          <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
            <User className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Basic Info
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Work Tab */}
        <TabsTrigger 
          value="work" 
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
            data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
            data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
        >
          <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
            <Briefcase className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Work
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Projects Tab */}
        <TabsTrigger 
          value="projects" 
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
            data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
            data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
        >
          <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
            <FolderGit2 className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Projects
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Education Tab */}
        <TabsTrigger 
          value="education" 
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
            data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
            data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
        >
          <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
            <GraduationCap className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Education
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Skills Tab */}
        <TabsTrigger 
          value="skills" 
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5b6949]/90 data-[state=active]:to-[#5b6949]/70
            data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border-[#5b6949]/40
            data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
        >
          <div className="p-1 rounded-lg bg-[#5b6949]/10 group-data-[state=active]:bg-[#5b6949] transition-transform duration-300 group-data-[state=active]:scale-110">
            <Wrench className="h-4 w-4 text-[#5b6949] group-data-[state=active]:text-white transition-colors" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Skills
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-[#5b6949] scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>

        {/* Settings Tab */}
        <TabsTrigger 
          value="settings" 
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg font-semibold relative transition-all duration-300
            data-[state=active]:bg-gradient-to-r data-[state=active]:from-zinc-400/80 data-[state=active]:to-zinc-300/80
            data-[state=active]:text-zinc-800 data-[state=active]:shadow-lg data-[state=active]:border-zinc-400/40
            data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-[#5b6949] hover:bg-zinc-100/80"
        >
          <div className="p-1 rounded-lg bg-zinc-200 group-data-[state=active]:bg-zinc-400 transition-transform duration-300 group-data-[state=active]:scale-110">
            <LayoutTemplate className="h-4 w-4 text-zinc-600 group-data-[state=active]:text-zinc-800 transition-colors" />
          </div>
          <span className="relative text-xs whitespace-nowrap">
            Layout
            <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-zinc-400 scale-x-0 transition-transform duration-300 group-data-[state=active]:scale-x-100"></div>
          </span>
        </TabsTrigger>
      </TabsList>
    </>
  );
} 