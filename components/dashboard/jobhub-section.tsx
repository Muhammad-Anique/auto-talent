"use client";

import {
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Layers,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateResumeDialog } from "@/components/resume/management/dialogs/create-resume-dialog";
import { ApplicationKitCard } from "@/components/resume/management/cards/application-kit-card";
import {
  type SortOption,
  type SortDirection,
} from "@/components/resume/management/resume-sort-controls";
import type { Profile, Resume } from "@/lib/types";
import { useState } from "react";

interface JobHubSectionProps {
  type: "base" | "tailored";
  resumes: Resume[];
  profile: Profile;
  sortParam: string;
  directionParam: string;
  currentSort: SortOption;
  currentDirection: SortDirection;
  baseResumes?: Resume[];
  canCreateMore?: boolean;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export function JobHubSection({
  type,
  resumes,
  profile,
  sortParam,
  directionParam,
  currentSort,
  currentDirection,
  baseResumes = [],
  canCreateMore,
}: JobHubSectionProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 9,
  });

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedResumes = resumes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resumes.length / pagination.itemsPerPage);

  function handlePageChange(page: number) {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }

  // Create Resume Card
  const CreateResumeCard = () => (
    <CreateResumeDialog
      type={type}
      profile={profile}
      {...(type === "tailored" && { baseResumes })}
    >
      <button
        className={cn(
          "w-full h-full rounded-2xl",
          "relative overflow-hidden",
          "border-2 border-dashed border-zinc-200 hover:border-[#5b6949]/40",
          "group/create flex flex-col items-center justify-center",
          "bg-white hover:bg-[#5b6949]/[0.03]",
          "transition-all duration-300 ease-out",
          "hover:shadow-lg hover:shadow-zinc-200/60",
          "hover:-translate-y-0.5",
          "py-12",
        )}
      >
        <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover/create:scale-105">
          <div
            className={cn(
              "h-14 w-14 rounded-2xl",
              "flex items-center justify-center",
              "bg-zinc-50 border border-zinc-200",
              "group-hover/create:bg-[#5b6949]/10 group-hover/create:border-[#5b6949]/20",
              "transition-all duration-300",
            )}
          >
            <Plus
              className={cn(
                "h-6 w-6 text-zinc-300",
                "group-hover/create:text-[#5b6949]",
                "transition-colors duration-300",
              )}
            />
          </div>

          <span
            className={cn(
              "mt-4 text-sm font-semibold",
              "text-zinc-400 group-hover/create:text-[#5b6949]",
              "transition-colors duration-300",
            )}
          >
            New Application Kit
          </span>
          <span
            className={cn(
              "mt-1 text-xs text-zinc-300",
              "group-hover/create:text-zinc-400",
              "transition-colors duration-300",
            )}
          >
            Resume + Cover Letter + Follow-up
          </span>
        </div>
      </button>
    </CreateResumeDialog>
  );

  // Limit Reached Card
  const LimitReachedCard = () => (
    <Link href="/dashboard/subscription" className="block h-full">
      <div
        className={cn(
          "w-full h-full rounded-2xl py-12",
          "border-2 border-dashed border-zinc-200 hover:border-zinc-300",
          "flex flex-col items-center justify-center",
          "bg-white hover:bg-zinc-50",
          "transition-all duration-300 ease-out",
          "hover:shadow-lg hover:shadow-zinc-200/60",
          "hover:-translate-y-0.5",
          "group/limit",
        )}
      >
        <div className="flex flex-col items-center transition-transform duration-300 group-hover/limit:scale-105">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-zinc-50 border border-zinc-200">
            <Layers className="h-6 w-6 text-zinc-300" />
          </div>
          <span className="mt-4 text-sm font-semibold text-zinc-400">
            Limit Reached
          </span>
          <span className="mt-1 text-xs text-zinc-300 underline underline-offset-4 group-hover/limit:text-[#5b6949] transition-colors">
            Upgrade to create more
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 rounded-full bg-[#5b6949]" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            Application Kits
          </h2>
          {resumes.length > 0 && (
            <span className="flex items-center justify-center px-2 py-0.5 text-[11px] font-bold bg-[#5b6949]/10 text-[#5b6949] rounded-full">
              {resumes.length}
            </span>
          )}
        </div>

        {/* Pagination controls */}
        {resumes.length > pagination.itemsPerPage && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-700 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-xs font-medium text-zinc-400 px-2">
              {pagination.currentPage} / {totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages}
              className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-700 rounded-lg"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create / Limit card */}
        {canCreateMore ? <CreateResumeCard /> : <LimitReachedCard />}

        {/* Application Kit Cards */}
        {paginatedResumes.map((resume) => (
          <ApplicationKitCard key={resume.id} resume={resume} />
        ))}
      </div>

      {/* Empty state */}
      {resumes.length === 0 && (
        <div className="text-center py-10 col-span-full">
          <p className="text-sm text-zinc-400">
            No application kits yet. Create one to get started.
          </p>
        </div>
      )}
    </div>
  );
}
