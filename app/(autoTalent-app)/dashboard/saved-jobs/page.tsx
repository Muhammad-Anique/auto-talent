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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
            No saved jobs yet
          </h2>
          <p className="text-zinc-600 max-w-md">
            Start building your job collection by saving interesting positions
            from your search results
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
          Search Jobs
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60",
              )}
            >
              <Bookmark className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">
                Saved Jobs
              </h1>
              <p className="text-zinc-600 text-sm mt-1">
                Your collection of interesting job opportunities
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#5b6949]/10 to-gray-500/10 border border-[#5b6949]/20">
              <div className="w-4 h-4 border-2 border-[#5b6949]/30 border-t-[#5b6949] rounded-full animate-spin"></div>
              <span className="text-zinc-700 font-medium">
                Loading your saved jobs...
              </span>
            </div>
          </div>
        ) : savedJobs.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Search and Filters */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search job titles..."
                    className="pl-10 h-12 text-gray-800 bg-white/80 border-zinc-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20"
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
                        Company
                      </span>
                    </div>
                    <select
                      className="w-full p-3 h-12 rounded-lg border border-zinc-200 bg-white/80 focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20 transition-all duration-200"
                      value={filterCompany}
                      onChange={(e) => setFilterCompany(e.target.value)}
                    >
                      <option value="">All Companies</option>
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
                        Location
                      </span>
                    </div>
                    <select
                      className="w-full p-3 h-12 rounded-lg border border-zinc-200 bg-white/80 focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20 transition-all duration-200"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    >
                      <option value="">All Locations</option>
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
                        Sort By
                      </span>
                    </div>
                    <select
                      className="w-full p-3 h-12 rounded-lg border border-zinc-200 bg-white/80 focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20 transition-all duration-200"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="az">Title A–Z</option>
                      <option value="za">Title Z–A</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900">
                {filteredJobs.length} saved job
                {filteredJobs.length !== 1 ? "s" : ""}
                {(searchTitle || filterCompany || filterLocation) && (
                  <span className="text-zinc-600 font-normal ml-2">
                    matching your filters
                  </span>
                )}
              </h2>
            </div>

            {/* Job Cards */}
            {filteredJobs.length > 0 ? (
              <div className="grid gap-4">
                {filteredJobs.map(({ id, job }) => (
                  <Card
                    key={id}
                    className="group relative bg-white/80 backdrop-blur-sm border-white/40 shadow-sm hover:shadow-lg transition-all duration-300 p-6"
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
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 border border-zinc-200">
                  <Search className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-600 text-sm">
                    No jobs match your current filters
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
