"use client";

import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
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
import { PaywallModal } from "@/components/ui/paywall-modal";
import { useLocale } from "@/components/providers/locale-provider";

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
  const { t } = useLocale();
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 9,
  });
  const [paywallOpen, setPaywallOpen] = useState(false);

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

  // Shared card button UI
  const CreateCardButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-full rounded-2xl",
        "relative overflow-hidden",
        "border-2 border-dashed border-zinc-200 hover:border-[#5b6949]/40",
        "group/create flex flex-col items-center justify-center",
        "bg-white hover:bg-[#5b6949]/3",
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
          {t("dashboard.applicationKits.newKit")}
        </span>
        <span
          className={cn(
            "mt-1 text-xs text-zinc-300",
            "group-hover/create:text-zinc-400",
            "transition-colors duration-300",
          )}
        >
          {t("dashboard.applicationKits.kitDescription")}
        </span>
      </div>
    </button>
  );

  // Create card — always shown, opens paywall if at limit
  const CreateResumeCard = () =>
    canCreateMore ? (
      <CreateResumeDialog
        type={type}
        profile={profile}
        {...(type === "tailored" && { baseResumes })}
      >
        <CreateCardButton />
      </CreateResumeDialog>
    ) : (
      <>
        <CreateCardButton onClick={() => setPaywallOpen(true)} />
        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          feature="Application Kits"
          limitMessage="You've reached your free plan limit for Application Kits. Upgrade to Pro for unlimited tailored resumes, cover letters, and more."
        />
      </>
    );

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-7 w-1 rounded-full bg-[#5b6949]" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">
            {t("dashboard.applicationKits.title")}
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
        {/* Create card — always visible, paywall shown if limit reached */}
        <CreateResumeCard />

        {/* Application Kit Cards */}
        {paginatedResumes.map((resume) => (
          <ApplicationKitCard key={resume.id} resume={resume} />
        ))}
      </div>

      {/* Empty state */}
      {resumes.length === 0 && (
        <div className="text-center py-10 col-span-full">
          <p className="text-sm text-zinc-400">
            {t("dashboard.applicationKits.noKits")}
          </p>
        </div>
      )}
    </div>
  );
}
