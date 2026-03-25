"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  Search,
  Building2,
  MapPin,
  Calendar,
  Trash2,
  ExternalLink,
  Heart,
  Briefcase,
  Filter,
  SortAsc,
  ArrowRight,
  DollarSign,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";

type Job = {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  companyLinkedinUrl?: string;
  companyWebsite?: string;
  companyDescription?: string;
  companySlogan?: string;
  location: string;
  postedAt: string;
  link: string;
  applyUrl?: string;
  salary?: string;
  salaryInfo?: string[];
  applicantsCount?: string;
  descriptionText?: string;
  descriptionHtml?: string;
  seniorityLevel?: string;
  employmentType?: string;
  jobFunction?: string;
  industries?: string;
  benefits?: string[];
};

export default function SavedJobsPage() {
  const { t } = useLocale();
  const { setIsLoading } = useLoading();
  const [savedJobs, setSavedJobs] = useState<{ id: string; job: Job }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const supabase = createClient();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("saved_jobs")
        .select("id, job, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load saved jobs:", error);
      } else {
        setSavedJobs(data || []);
      }

      setLoading(false);
    };

    fetchSavedJobs();
    setIsLoading(false);
  }, [setIsLoading]);

  const removeJob = async (id: string) => {
    const { error } = await supabase.from("saved_jobs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting job:", error);
      alert("Failed to remove job");
    } else {
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Extract unique companies and locations for dropdowns
  const companyOptions = Array.from(
    new Set(
      savedJobs
        .map((j) => j.job.companyName)
        .filter((name) => name !== undefined),
    ),
  );
  const locationOptions = Array.from(
    new Set(savedJobs.map((j) => j.job.location).filter((loc) => loc)),
  );

  // Filter + sort logic
  const filteredJobs = savedJobs
    .filter(
      ({ job }) =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        (job.companyName || "")
          .toLowerCase()
          .includes(filterCompany.toLowerCase()) &&
        job.location.toLowerCase().includes(filterLocation.toLowerCase()),
    )
    .sort((a, b) => {
      const titleA = a.job.title.toLowerCase();
      const titleB = b.job.title.toLowerCase();
      const dateA = new Date(a.job.postedAt).getTime();
      const dateB = new Date(b.job.postedAt).getTime();

      switch (sortBy) {
        case "az":
          return titleA.localeCompare(titleB);
        case "za":
          return titleB.localeCompare(titleA);
        case "oldest":
          return dateA - dateB;
        default:
          return dateB - dateA;
      }
    });

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60">
            <Bookmark className="w-12 h-12 text-[#5b6949]" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-zinc-900">
            {t("dashboard.savedJobsPage.noSavedJobs")}
          </h2>
          <p className="text-zinc-600 max-w-md">
            {t("dashboard.savedJobsPage.noSavedJobsDescription")}
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => (window.location.href = "/dashboard/search-jobs")}
          className={cn(
            "inline-flex items-center gap-2",
            "rounded-full text-gray-800 font-medium px-8 py-3",
            "transition-all duration-500",
            "bg-[#5b6949]",
            "text-white hover:shadow-xl hover:shadow-[#5b6949]/25",
            "hover:-translate-y-1 hover:scale-105",
          )}
        >
          <Briefcase className="w-5 h-5" />
          {t("dashboard.sidebar.searchJobs")}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7db_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-[#3d4832] p-8 sm:p-10">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(91,105,73,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(91,105,73,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5b6949]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#5b6949]/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5b6949]/20 border border-[#5b6949]/30 backdrop-blur-sm">
                <Heart className="w-3.5 h-3.5 text-[#8fa676]" />
                <span className="text-xs font-semibold text-[#8fa676] tracking-wide uppercase">
                  {t("dashboard.savedJobsPage.badge")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {t("dashboard.savedJobsPage.title")}
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
                {t("dashboard.savedJobsPage.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-[#8fa676]" />
                <span className="text-sm text-zinc-300 font-medium">
                  {savedJobs.length} {savedJobs.length !== 1 ? t("dashboard.savedJobsPage.savedJobs") : t("dashboard.savedJobsPage.savedJob")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#5b6949]/10 to-gray-500/10 border border-[#5b6949]/20">
              <div className="w-4 h-4 border-2 border-[#5b6949]/30 border-t-[#5b6949] rounded-full animate-spin"></div>
              <span className="text-zinc-700 font-medium">
                {t("dashboard.savedJobsPage.loadingJobs")}
              </span>
            </div>
          </div>
        ) : savedJobs.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="relative rounded-2xl bg-white border border-zinc-200/80 shadow-sm shadow-black/[0.03] p-6 sm:p-8">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-[#5b6949]/10 group-focus-within:bg-[#5b6949]/20 transition-colors">
                    <Search className="w-3.5 h-3.5 text-[#5b6949]" />
                  </div>
                  <Input
                    type="text"
                    placeholder={t("dashboard.savedJobsPage.searchPlaceholder")}
                    className="pl-12 h-12 text-zinc-800 bg-zinc-50/50 border-zinc-200 rounded-xl focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 focus:bg-white placeholder:text-zinc-400 transition-all"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-[#5b6949]" />
                      <span className="text-sm font-medium text-zinc-700">
                        {t("dashboard.searchJobsPage.company")}
                      </span>
                    </div>
                    <select
                      className="w-full p-3 h-12 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 transition-all duration-200"
                      value={filterCompany}
                      onChange={(e) => setFilterCompany(e.target.value)}
                    >
                      <option value="">{t("dashboard.savedJobsPage.allCompanies")}</option>
                      {companyOptions.map((company) => (
                        <option key={company} value={company}>
                          {company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[#5b6949]" />
                      <span className="text-sm font-medium text-zinc-700">
                        {t("dashboard.jobs.location")}
                      </span>
                    </div>
                    <select
                      className="w-full p-3 h-12 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 transition-all duration-200"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    >
                      <option value="">{t("dashboard.savedJobsPage.allLocations")}</option>
                      {locationOptions.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <SortAsc className="w-4 h-4 text-[#5b6949]" />
                      <span className="text-sm font-medium text-zinc-700">
                        {t("dashboard.searchJobsPage.sortBy")}
                      </span>
                    </div>
                    <select
                      className="w-full p-3 h-12 rounded-xl border border-zinc-200 bg-zinc-50/50 focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 transition-all duration-200"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">{t("dashboard.savedJobsPage.newestFirst")}</option>
                      <option value="oldest">{t("dashboard.savedJobsPage.oldestFirst")}</option>
                      <option value="az">{t("dashboard.savedJobsPage.titleAZ")}</option>
                      <option value="za">{t("dashboard.savedJobsPage.titleZA")}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-[#5b6949]" />
                <h2 className="text-lg font-bold text-zinc-900">
                  {filteredJobs.length} {filteredJobs.length !== 1 ? t("dashboard.savedJobsPage.savedJobs") : t("dashboard.savedJobsPage.savedJob")}
                  {(searchTitle || filterCompany || filterLocation) && (
                    <span className="text-zinc-500 font-normal ml-2">
                      {t("dashboard.savedJobsPage.matchingFilters")}
                    </span>
                  )}
                </h2>
              </div>
            </div>

            {/* Job Cards */}
            {filteredJobs.length > 0 ? (
              <div className="grid gap-3">
                {filteredJobs.map(({ id, job }) => (
                  <div
                    key={id}
                    className="group relative bg-white border border-zinc-200/80 rounded-xl hover:border-[#5b6949]/30 hover:shadow-lg hover:shadow-[#5b6949]/[0.04] transition-all duration-300 p-5 sm:p-6"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeJob(id)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-100/80 hover:bg-red-50 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Remove from saved jobs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        {job.companyLogo && (
                          <div className="flex-shrink-0">
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              className="w-12 h-12 object-contain rounded-lg border border-zinc-200"
                            />
                          </div>
                        )}

                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-[#5b6949]" />
                            <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-[#5b6949] transition-colors">
                              {job.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-zinc-600 mb-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{job.companyName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <span className="text-[#5b6949] font-medium">
                                  {job.salary}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-zinc-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Posted: {formatDate(job.postedAt)}</span>
                            </div>
                            {job.employmentType && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {job.employmentType}
                              </span>
                            )}
                            {job.seniorityLevel && (
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {job.seniorityLevel}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* External Link Icon */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <ExternalLink className="w-5 h-5 text-[#5b6949]" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200">
                  <Search className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-600 text-sm">
                    {t("dashboard.savedJobsPage.noJobsMatchFilters")}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
