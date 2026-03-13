import { getDashboardData } from "@/utils/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MiniResumePreview } from "@/components/resume/shared/mini-resume-preview";
import { ResumeSortControls } from "@/components/resume/management/resume-sort-controls";
import type {
  SortOption,
  SortDirection,
} from "@/components/resume/management/resume-sort-controls";
import IsLoadingFalseforDashboard from "@/components/dashboard/isLoadingFalseforDashboard";
import { CreateBaseResumeDialog } from "@/components/resume/management/dialogs/create-base-resume-dialog";
import { CreateTailoredResumeDialog } from "@/components/resume/management/dialogs/create-tailored-resume-dialog";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Plus, Sparkles, Target } from "lucide-react";

const RESUMES_PER_PAGE = 12;

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function ResumesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const { baseResumes, tailoredResumes, profile } = await getDashboardData();

  const currentPage = Number(params.page) || 1;
  const sort = (params.sort as SortOption) || "createdAt";
  const direction = (params.direction as SortDirection) || "desc";

  // Sort function
  const sortResumes = (resumes: typeof baseResumes) => {
    return resumes.sort((a, b) => {
      const modifier = direction === "asc" ? 1 : -1;
      switch (sort) {
        case "name":
          return modifier * a.name.localeCompare(b.name);
        case "jobTitle":
          return (
            modifier * (a.target_role?.localeCompare(b.target_role || "") || 0)
          );
        case "createdAt":
        default:
          return (
            modifier *
            (new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime())
          );
      }
    });
  };

  // Sort both arrays separately
  const sortedBaseResumes = sortResumes([...baseResumes]);
  const sortedTailoredResumes = sortResumes([...tailoredResumes]);

  // Check if user has any resumes
  const hasResumes = baseResumes.length > 0 || tailoredResumes.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <IsLoadingFalseforDashboard />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#5b6949]/10 to-gray-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-500/10 to-[#5b6949]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 space-y-8 relative z-10">
        {/* Header with controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60",
              )}
            >
              <Mail className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">
                My Resumes
              </h1>
              <p className="text-zinc-600 text-sm mt-1">
                Manage all your resumes in one place
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {hasResumes && (
              <Suspense>
                <ResumeSortControls />
              </Suspense>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!hasResumes ? (
          <div className="flex flex-col items-center h-[calc(100vh-200px)] justify-center py-20 px-6">
            <div className="text-center space-y-6">
              {/* Simple Icon */}
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-[#5b6949]/10 to-gray-500/10 border border-[#5b6949]/20">
                  <FileText className="w-12 h-12 text-[#5b6949]" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  No resumes created yet
                </h2>
                <p className="text-gray-600 max-w-md">
                  Start building your professional profile by creating your
                  first resume
                </p>
              </div>

              {/* Button */}
              {profile ? (
                <CreateBaseResumeDialog profile={profile}>
                  <Button
                    size="lg"
                    className={cn(
                      "inline-flex items-center gap-2",
                      "rounded-full text-gray-800 font-medium px-8 py-3",
                      "transition-all duration-500",
                      "bg-[#5b6949]",
                      "text-white hover:shadow-xl hover:shadow-[#5b6949]/25",
                      "hover:-translate-y-1 hover:scale-105",
                    )}
                  >
                    <Plus className="w-5 h-5" />
                    Create Base Resume
                  </Button>
                </CreateBaseResumeDialog>
              ) : (
                <Link href="/dashboard/resume-builder">
                  <Button
                    size="lg"
                    className={cn(
                      "inline-flex items-center gap-2",
                      "rounded-full text-gray-800 font-medium px-8 py-3",
                      "transition-all duration-500",
                      "bg-[#5b6949]",
                      "text-white hover:shadow-xl hover:shadow-[#5b6949]/25",
                      "hover:-translate-y-1 hover:scale-105",
                    )}
                  >
                    <Plus className="w-5 h-5" />
                    Create Base Resume
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Base Resumes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-100 border border-zinc-200">
                    <FileText className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-900">
                      Base Resumes
                    </h2>
                    <p className="text-sm text-zinc-600">
                      {sortedBaseResumes.length} resume
                      {sortedBaseResumes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {profile ? (
                  <CreateBaseResumeDialog profile={profile}>
                    <Button
                      className={cn(
                        "inline-flex items-center justify-center gap-2",
                        "rounded-full text-sm font-medium",
                        "transition-all duration-300",
                        "bg-zinc-900 hover:bg-zinc-800",
                        "text-white hover:shadow-lg",
                        "h-10 px-6",
                      )}
                    >
                      <Plus className="w-4 h-4" />
                      Create Base Resume
                    </Button>
                  </CreateBaseResumeDialog>
                ) : (
                  <Link href="/dashboard/resume-builder">
                    <Button
                      className={cn(
                        "inline-flex items-center justify-center gap-2",
                        "rounded-full text-sm font-medium",
                        "transition-all duration-300",
                        "bg-zinc-900 hover:bg-zinc-800",
                        "text-white hover:shadow-lg",
                        "h-10 px-6",
                      )}
                    >
                      <Plus className="w-4 h-4" />
                      Create Base Resume
                    </Button>
                  </Link>
                )}
              </div>

              {sortedBaseResumes.length > 0 ? (
                <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/60 border border-gray-200/50 shadow-xl">
                  <Suspense fallback={<ResumesLoadingSkeleton />}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                      {sortedBaseResumes.map((resume) => (
                        <Link
                          href={`/dashboard/resumes/${resume.id}`}
                          key={resume.id}
                        >
                          <MiniResumePreview
                            name={resume.name}
                            type="base"
                            target_role={resume.target_role}
                            updatedAt={resume.updated_at}
                            className="hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg"
                          />
                        </Link>
                      ))}
                    </div>
                  </Suspense>
                </div>
              ) : (
                <div className="text-center py-12 px-6 rounded-2xl bg-white/60 border border-gray-200/50">
                  <p className="text-zinc-500">
                    No base resumes yet. Create one to get started!
                  </p>
                </div>
              )}
            </div>

            {/* Application Kits Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#5b6949]/10 border border-[#5b6949]/20">
                    <Sparkles className="w-5 h-5 text-[#5b6949]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-900">
                      Application Kits
                    </h2>
                    <p className="text-sm text-zinc-600">
                      {sortedTailoredResumes.length} application kit
                      {sortedTailoredResumes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                {profile && sortedBaseResumes.length > 0 && (
                  <CreateTailoredResumeDialog
                    profile={profile}
                    baseResumes={sortedBaseResumes}
                  >
                    <Button
                      className={cn(
                        "inline-flex items-center justify-center gap-2",
                        "rounded-full text-sm font-medium",
                        "transition-all duration-300",
                        "bg-[#5b6949] hover:bg-[#5b6949]",
                        "text-white hover:shadow-lg hover:shadow-emerald-500/20",
                        "h-10 px-6",
                      )}
                    >
                      <Plus className="w-4 h-4" />
                      Create Application Kit
                    </Button>
                  </CreateTailoredResumeDialog>
                )}
              </div>

              {sortedTailoredResumes.length > 0 ? (
                <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-zinc-50/80 to-zinc-100 border border-[#5b6949]/50 shadow-xl">
                  <Suspense fallback={<ResumesLoadingSkeleton />}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                      {sortedTailoredResumes.map((resume) => (
                        <Link
                          href={`/dashboard/resumes/${resume.id}`}
                          key={resume.id}
                        >
                          <MiniResumePreview
                            name={resume.name}
                            type="tailored"
                            target_role={resume.target_role}
                            updatedAt={resume.updated_at}
                            className="hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg border-emerald-200"
                          />
                        </Link>
                      ))}
                    </div>
                  </Suspense>
                </div>
              ) : (
                <div className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-green-50/60 border border-emerald-200/50">
                  <p className="text-[#5b6949]">
                    No application kits yet.{" "}
                    {sortedBaseResumes.length === 0
                      ? "Create a base resume first!"
                      : "Create one from your base resumes!"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ResumesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          className="w-full aspect-[8.5/11] rounded-lg bg-gradient-to-r from-gray-200/50 to-gray-100/50"
        />
      ))}
    </div>
  );
}
