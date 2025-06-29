'use client';

import { Profile } from "@/lib/types";
import { User, Briefcase, GraduationCap, Code, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  return (
    <div className="group relative ">
      {/* Animated background gradient */}
      <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-700 " />
      <div className="relative bg-gradient-to-br from-white/60 to-white/30   backdrop-blur-xl border-b border-white/40 border-b-[#5b6949]/20 transition-all duration-500 group-hover:border-b-[#5b6949]/20 ">
        <div className="px-4 sm:px-6 py-5">
          {/* Main container - stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6  mx-auto">
            {/* Left section with avatar, name and stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
              {/* Avatar and Name group */}
            
              {/* Stats Row - hidden on mobile, visible on sm and up */}
              <div className="hidden sm:flex items-center gap-3">
                {[
                  { 
                    icon: Briefcase, 
                    label: "Experience", 
                    count: profile.work_experience.length,
                    colors: {
                      bg: "from-[#ffffff]/10 to-zinc-400/10",
                      text: "text-white",
                        iconBg: "bg-zinc-800",
                      border: "border-zinc-200"
                    }
                  },
                  { 
                    icon: GraduationCap, 
                    label: "Education", 
                    count: profile.education.length,
                    colors: {
                      bg: "from-[#ffffff]/10 to-zinc-400/10",
                      text: "text-white",
                        iconBg: "bg-zinc-800",
                      border: "border-zinc-200"
                    }
                  },
                  { 
                    icon: Code, 
                    label: "Projects", 
                    count: profile.projects.length,
                    colors: {
                      bg: "from-[#ffffff]/10 to-zinc-400/10",
                      text: "text-white",
                      iconBg: "bg-zinc-800",
                      border: "border-zinc-200"
                    }
                  },
                ].map((stat) => (
                  <div 
                    key={stat.label} 
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-1 rounded-lg",
                      "bg-gradient-to-r border backdrop-blur-sm",
                      "transition-all duration-500 hover:shadow-sm",
                      "hover:-translate-y-0.5 ",
                      stat.colors.bg,
                      stat.colors.border
                    )}
                  >
                    <div className={cn(
                      "p-1 rounded-full transition-transform duration-300",
                      stat.colors.iconBg,
                      "group-hover:scale-100"
                    )}>
                      <stat.icon className={cn("h-3 w-3", stat.colors.text)} />
                    </div>
                    <span className="text-sm whitespace-nowrap">
                      <span className="font-semibold text-[#5b6949]">{stat.count}</span>
                      <span className="text-muted-foreground ml-1.5">{stat.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Edit Button with enhanced styling */}

              <div className="md:flex items-center gap-4 translate-x-4 hidden ">
                {/* Enhanced Avatar Circle */}
                <div className="shrink-0 size-8 rounded-full bg-gradient-to-br from-zinc-300  p-[2px] shadow-xl group-hover:shadow-[#5b6949]/25 transition-all duration-500">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-white to-zinc-200 p-1.5 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#5b6949]" />
                  </div>
                </div>
               
                {/* <h3 className="text-lg font-semibold bg-gradient-to-r from-[#5b6949] via-[#ffffff] to-[#5b6949] bg-clip-text text-transparent whitespace-nowrap">
                  {profile.first_name} {profile.last_name}
                </h3> */}
              </div>
            <Link href="/dashboard/profile" className="shrink-0">  
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-800 hover:border-zinc-200 hover:text-white transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md shadow-sm"
              >
                <span className="flex items-center gap-2 bg-zinc-800 rounded-full size-5 flex-shrink-0 justify-center ">
                  <Pencil className="size-1 scale-75 text-white" />
                </span>
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 