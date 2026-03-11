'use client';

import { Profile } from "@/lib/types";
import { Briefcase, GraduationCap, Code, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  const stats = [
    {
      icon: Briefcase,
      label: "Experience",
      count: profile.work_experience.length,
    },
    {
      icon: GraduationCap,
      label: "Education",
      count: profile.education.length,
    },
    {
      icon: Code,
      label: "Projects",
      count: profile.projects.length,
    },
  ];

  return (
    <div className="relative bg-white border-b border-zinc-200">
      <div className="relative px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mx-auto">
          {/* Stats */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                  "bg-zinc-50 border border-zinc-200",
                  "transition-all duration-200 hover:border-[#5b6949]/30",
                  "shrink-0"
                )}
              >
                <div className="p-1 rounded-md bg-[#5b6949]/10">
                  <stat.icon className="h-3 w-3 text-[#5b6949]" />
                </div>
                <span className="text-sm whitespace-nowrap">
                  <span className="font-bold text-zinc-900">{stat.count}</span>
                  <span className="text-zinc-500 ml-1.5">{stat.label}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Edit Profile Button */}
          <Link href="/dashboard/profile" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full sm:w-auto",
                "bg-white border-zinc-200 text-zinc-700",
                "hover:bg-[#5b6949] hover:text-white hover:border-[#5b6949]",
                "transition-all duration-200",
                "rounded-lg font-medium text-sm",
              )}
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
