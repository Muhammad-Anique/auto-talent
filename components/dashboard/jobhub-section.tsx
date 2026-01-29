"use client";

import {
  Trash2,
  Copy,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { MiniResumePreview } from "@/components/resume/shared/mini-resume-preview";
import { CreateResumeDialog } from "@/components/resume/management/dialogs/create-resume-dialog";
import { ApplicationKitCard } from "@/components/resume/management/cards/application-kit-card";
import {
  ResumeSortControls,
  type SortOption,
  type SortDirection,
} from "@/components/resume/management/resume-sort-controls";
import type { Profile, Resume } from "@/lib/types";
import { deleteResume, copyResume } from "@/utils/actions/resumes/actions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface JobHubSectionProps {
  type: "base" | "tailored";
  resumes: Resume[];
  profile: Profile;
  sortParam: string;
  directionParam: string;
  currentSort: SortOption;
  currentDirection: SortDirection;
  baseResumes?: Resume[]; // Only needed for tailored type
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
  const config = {
    base: {
      gradient: "from-[#5b6949] to-[#5b6949]/90",
      border: "border-[#5b6949]",
      bg: "bg-[#5b6949]",
      text: "text-[#5b6949]",
      icon: FileText,
      accent: {
        bg: "zinc-100",
        hover: "zinc-100/50",
      },
    },
    tailored: {
      gradient: "from-[#5b6949] to-[#5b6949]/90",
      border: "border-[#5b6949]",
      bg: "bg-[#5b6949]",
      text: "text-[#5b6949]",
      icon: Sparkles,
      accent: {
        bg: "zinc-100",
        hover: "zinc-100/50",
      },
    },
  }[type];

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 7,
  });

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedResumes = resumes.slice(startIndex, endIndex);

  function handlePageChange(page: number) {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }

  // Create Resume Card Component
  const CreateResumeCard = () => (
    <CreateResumeDialog
      type={type}
      profile={profile}
      {...(type === "tailored" && { baseResumes })}
    >
      <button
        className={cn(
          "w-full rounded-lg p-8",
          "relative overflow-hidden",
          "border-2 border-dashed transition-all duration-300",
          "group/new-resume flex flex-col items-center justify-center gap-4",
          "border-zinc-300 hover:border-zinc-400",
          "bg-zinc-50",
          "hover:shadow-md hover:-translate-y-1",
        )}
      >
        <div
          className={cn(
            "relative z-10 flex flex-col items-center",
            "transform transition-all duration-500",
            "group-hover/new-resume:scale-105",
          )}
        >
          <div
            className={cn(
              "h-12 w-12 rounded-xl",
              "flex items-center justify-center",
              "transform transition-all duration-300",
              "shadow-sm group-hover/new-resume:shadow-md",
              "bg-white",
              "group-hover/new-resume:scale-110",
            )}
          >
            <config.icon
              className={cn(
                "h-5 w-5 transition-all duration-300",
                "text-zinc-700",
                "group-hover/new-resume:scale-110",
              )}
            />
          </div>

          <span
            className={cn(
              "mt-4 text-sm font-medium",
              "transition-all duration-300",
              "text-zinc-700",
              "group-hover/new-resume:font-semibold",
            )}
          >
            Create {type === "base" ? "Base Resume" : "Application Kit"}
          </span>

          <span
            className={cn(
              "mt-2 text-xs",
              "transition-all duration-300 opacity-0",
              "text-zinc-600",
              "group-hover/new-resume:opacity-70",
            )}
          >
            Click to start
          </span>
        </div>
      </button>
    </CreateResumeDialog>
  );

  // Limit Reached Card Component
  const LimitReachedCard = () => (
    <Link
      href="/dashboard/subscription"
      className={cn(
        "group/limit block w-full",
        "cursor-pointer",
        "transition-all duration-300",
      )}
    >
      <div
        className={cn(
          "w-full rounded-lg p-8",
          "relative overflow-hidden",
          "border-2 border-dashed",
          "flex flex-col items-center justify-center gap-4",
          "border-zinc-300",
          "bg-zinc-50",
          "transition-all duration-300",
          "hover:shadow-md",
          "hover:border-zinc-400",
        )}
      >
        <div
          className={cn(
            "relative z-10 flex flex-col items-center",
            "transform transition-all duration-500",
            "group-hover/limit:scale-105",
          )}
        >
          <div
            className={cn(
              "h-12 w-12 rounded-xl",
              "flex items-center justify-center",
              "bg-white",
              "text-zinc-700",
              "shadow-md",
              "transition-all duration-300",
              "group-hover/limit:shadow-lg",
              "group-hover/limit:-translate-y-1",
            )}
          >
            <config.icon
              className={cn(
                "h-5 w-5",
                "transition-all duration-300",
                "group-hover/limit:scale-110",
              )}
            />
          </div>
          <span
            className={cn(
              "mt-4 text-sm font-medium",
              "text-zinc-700",
              "transition-all duration-300",
              "group-hover/limit:text-zinc-900",
            )}
          >
            {type === "base" ? "Base" : "Application Kit"} Limit Reached
          </span>
          <span
            className={cn(
              "mt-2 text-xs",
              "text-zinc-600",
              "underline underline-offset-4",
              "transition-all duration-300",
              "group-hover/limit:text-zinc-700",
            )}
          >
            Upgrade to create more
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative bg-zinc-50 p-6  !w-full border border-zinc-200 rounded-xl">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative mb-4 flex  flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2
            className={`text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-700`}
          >
            Application Kits
          </h2>
          <div className="flex items-center gap-2 mb-4 translate-x-4">
            {/* <ResumeSortControls 
              sortParam={sortParam}
              directionParam={directionParam}
              currentSort={currentSort}
              currentDirection={currentDirection}
            /> */}
          </div>
        </div>

        {/* Desktop Pagination (hidden on mobile) */}
        {resumes.length > pagination.itemsPerPage && (
          <div className="hidden md:flex w-full items-start justify-start -mt-4">
            <Pagination className="flex justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="h-8 w-8 p-0 text-gray-700 hover:text-foreground"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>

                {Array.from({
                  length: Math.ceil(resumes.length / pagination.itemsPerPage),
                }).map((_, index) => {
                  const pageNumber = index + 1;
                  const totalPages = Math.ceil(
                    resumes.length / pagination.itemsPerPage,
                  );

                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= pagination.currentPage - 1 &&
                      pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={cn(
                            "h-8 w-8 p-0",
                            "text-gray-700 hover:text-foreground",
                            pagination.currentPage === pageNumber &&
                              "font-medium text-foreground",
                          )}
                        >
                          {pageNumber}
                        </Button>
                      </PaginationItem>
                    );
                  }

                  if (
                    (pageNumber === 2 && pagination.currentPage > 3) ||
                    (pageNumber === totalPages - 1 &&
                      pagination.currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <span className="text-gray-700 px-2">...</span>
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage ===
                      Math.ceil(resumes.length / pagination.itemsPerPage)
                    }
                    className="h-8 w-8 p-0 text-gray-700 hover:text-foreground"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <div className="relative pb-6">
        {/* Mobile View - Full Width Cards */}
        <div className="md:hidden w-full space-y-6">
          {/* Mobile Create Button Row */}
          {canCreateMore ? (
            <div className="w-full">
              <CreateResumeCard />
            </div>
          ) : (
            <div className="w-full">
              <LimitReachedCard />
            </div>
          )}

          {/* Mobile Application Kit Cards */}
          {paginatedResumes.map((resume) => (
            <ApplicationKitCard key={resume.id} resume={resume} />
          ))}
        </div>

        {/* Desktop View - Full Width Cards */}
        <div className="hidden md:flex md:flex-col gap-6">
          {/* Create Button Row */}
          <div className="w-full">
            {canCreateMore ? (
              <div className="w-full">
                <CreateResumeCard />
              </div>
            ) : (
              <div className="w-full">
                <LimitReachedCard />
              </div>
            )}
          </div>

          {/* Application Kit Cards */}
          {paginatedResumes.map((resume) => (
            <ApplicationKitCard key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </div>
  );
}
