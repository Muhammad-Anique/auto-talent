import { redirect } from "next/navigation";
import { countResumes } from "@/utils/actions/resumes/actions";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfileRow } from "@/components/dashboard/profile-row";
import { WelcomeDialog } from "@/components/dashboard/welcome-dialog";
import { getGreeting } from "@/lib/utils";
import { ApiKeyAlert } from "@/components/dashboard/api-key-alert";
import {
  type SortOption,
  type SortDirection,
} from "@/components/resume/management/resume-sort-controls";
import type { Resume } from "@/lib/types";
import { ResumesSection } from "@/components/dashboard/resumes-section";
import { createClient } from "@/utils/supabase/server";
import { getDashboardData } from "@/utils/actions";
import { getSubscriptionStatus } from "@/utils/actions/subscriptions/actions";
import { PLANS } from "@/lib/stripe";

import IsLoadingFalseforDashboard from "@/components/dashboard/isLoadingFalseforDashboard";
import { JobHubSection } from "@/components/dashboard/jobhub-section";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;
  void userId;

  // Check if user is coming from confirmation
  const params = await searchParams;
  const isNewSignup = params?.type === "signup" && params?.token_hash;

  // Fetch dashboard data and handle authentication
  let data;
  try {
    data = await getDashboardData();
    if (!data.profile) {
      redirect("/auth/login");
    }
  } catch {
    // Redirect to login if error occurs
    redirect("/auth/login");
  }

  const {
    profile,
    baseResumes: unsortedBaseResumes,
    tailoredResumes: unsortedTailoredResumes,
  } = data;

  // Get sort parameters for both sections
  const baseSort = (params.baseSort as SortOption) || "createdAt";
  const baseDirection = (params.baseDirection as SortDirection) || "asc";
  const tailoredSort = (params.tailoredSort as SortOption) || "createdAt";
  const tailoredDirection =
    (params.tailoredDirection as SortDirection) || "asc";

  // Sort function
  function sortResumes(
    resumes: Resume[],
    sort: SortOption,
    direction: SortDirection,
  ) {
    return [...resumes].sort((a, b) => {
      const modifier = direction === "asc" ? 1 : -1;
      switch (sort) {
        case "name":
          return modifier * a.name.localeCompare(b.name);
        case "jobTitle":
          return (
            modifier *
            ((a.target_role || "").localeCompare(b.target_role || "") || 0)
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
  }

  // Sort both resume lists
  const baseResumes = sortResumes(unsortedBaseResumes, baseSort, baseDirection);
  const tailoredResumes = sortResumes(
    unsortedTailoredResumes,
    tailoredSort,
    tailoredDirection,
  );

  // Get real subscription status
  const subscription = await getSubscriptionStatus();
  const isProPlan = subscription.plan === "pro" || subscription.plan === "lifetime";

  // Count resumes for base and tailored sections
  const baseResumesCount = await countResumes("base");
  const tailoredResumesCount = await countResumes("tailored");

  // Free plan limits: 1 CV download, 1 cover letter, 10 job applications
  const canCreateBase = isProPlan || baseResumesCount < 2;
  const canCreateTailored = isProPlan || tailoredResumesCount < 4;

  // Display a friendly message if no profile exists
  if (!profile) {
    return (
      <main className="min-h-screen p-6 md:p-8 lg:p-10 relative flex items-center justify-center bg-[#fafaf9]">
        <Card className="max-w-md w-full p-8 bg-white border-zinc-200 shadow-sm rounded-2xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto">
              <User className="w-7 h-7 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Profile Not Found
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              We couldn&apos;t find your profile information. Please contact
              support for assistance.
            </p>
            <Button className="w-full bg-[#5b6949] text-white hover:bg-[#4a573a] rounded-xl h-11 font-semibold shadow-sm shadow-[#5b6949]/20">
              Contact Support
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] relative sm:pb-12 pb-40">
      <IsLoadingFalseforDashboard />
      <WelcomeDialog isOpen={!!isNewSignup} />

      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7db_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <ProfileRow profile={profile} />

        <div className="sm:pl-0 sm:container sm:max-none px-4 lg:px-8 md:px-8 sm:px-6 pt-6">
          {/* API Key Alert */}
          {!isProPlan && <ApiKeyAlert />}

          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
              {getGreeting()}, {profile.first_name}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Welcome to your job hub dashboard
            </p>
          </div>

          {/* Application Kits Section */}
          <JobHubSection
            type="tailored"
            resumes={tailoredResumes}
            profile={profile}
            sortParam="tailoredSort"
            directionParam="tailoredDirection"
            currentSort={tailoredSort}
            currentDirection={tailoredDirection}
            baseResumes={baseResumes}
            canCreateMore={canCreateTailored}
          />
        </div>
      </div>
    </main>
  );
}
