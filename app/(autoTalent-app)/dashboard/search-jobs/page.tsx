"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useLoading } from "../../../../context/LoadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Briefcase,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  location: string;
  postAt: string;
  url: string;
  company: {
    name: string;
    logo?: string;
  };
};

const LOCATIONS = [
  { name: "Italy", value: "92000000" },
  { name: "United States", value: "103644278" },
  { name: "United Kingdom", value: "101165590" },
  { name: "Germany", value: "101282230" },
  { name: "France", value: "105015875" },
  { name: "Spain", value: "105646813" },
  { name: "Netherlands", value: "102890719" },
  { name: "Canada", value: "101174742" },
  { name: "Australia", value: "101452733" },
  { name: "Japan", value: "101355337" },
];

const DATE_OPTIONS = [
  { name: "Any Time", value: "anyTime" },
  { name: "Past Week", value: "pastWeek" },
  { name: "Past Month", value: "pastMonth" },
];

const SORT_OPTIONS = [
  { name: "Most Relevant", value: "mostRelevant" },
  { name: "Most Recent", value: "mostRecent" },
];

export default function JobsPage() {
  const [keywords, setKeywords] = useState("");
  const [locationId, setLocationId] = useState("92000000"); // Default to Italy
  const [datePosted, setDatePosted] = useState("anyTime");
  const [sort, setSort] = useState("mostRelevant");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { setIsLoading } = useLoading();

  const [searched, setSearched] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    // Fetch saved jobs for current user
    const fetchSavedJobs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job")
        .eq("user_id", userId);

      if (data) {
        const savedIds = data.map((entry) => entry.job.id);
        setSavedJobs(savedIds);
      }
    };

    fetchSavedJobs();
    setIsLoading(false);
  }, [setIsLoading]);

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/linkedin/job?keywords=${encodeURIComponent(
          keywords,
        )}&locationId=${locationId}&datePosted=${datePosted}&sort=${sort}`,
      );
      const data = await res.json();

      const jobList = data?.data?.data ?? [];
      console.log("Fetched jobs:", jobList);
      setJobs(jobList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (job: Job) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      alert("Please log in to save jobs.");
      return;
    }

    if (savedJobs.includes(job.id)) {
      return;
    }

    const { error } = await supabase.from("saved_jobs").insert({
      user_id: userId,
      job: job,
    });

    if (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job.");
    } else {
      setSavedJobs((prev) => [...prev, job.id]);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  const getSelectedLocationName = () => {
    const location = LOCATIONS.find((loc) => loc.value === locationId);
    return location?.name || "Italy";
  };

  const getSelectedDateName = () => {
    const date = DATE_OPTIONS.find((date) => date.value === datePosted);
    return date?.name || "Any Time";
  };

  const getSelectedSortName = () => {
    const sortOption = SORT_OPTIONS.find((option) => option.value === sort);
    return sortOption?.name || "Most Relevant";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#5b6949]/10 to-gray-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-500/10 to-[#5b6949]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-6xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60">
              <Briefcase className="w-12 h-12 text-[#5b6949]" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#5b6949]">
              Search LinkedIn Jobs
            </h1>
            <p className="text-gray-600 mt-2">
              Find your next career opportunity with AI-powered job search
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="relative rounded-2xl  backdrop-blur-xl bg-white/60 border border-gray-200/50 shadow-xl">
          <form onSubmit={handleSearch} className="p-6 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Enter job keywords (e.g., React, Python, Product Manager)"
                className="pl-10 h-12 text-gray-800 bg-white/80 border-gray-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                required
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Dropdown */}
              <div className="relative" ref={locationRef}>
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all duration-200",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50 focus:border-[#5b6949]",
                    showLocationDropdown &&
                      "border-[#5b6949] ring-2 ring-[#5b6949]/20",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {getSelectedLocationName()}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showLocationDropdown && (
                  <div className="absolute z-[200] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {LOCATIONS.map((location) => (
                      <button
                        key={location.value}
                        type="button"
                        onClick={() => {
                          setLocationId(location.value);
                          setShowLocationDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                          locationId === location.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium",
                        )}
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Posted Dropdown */}
              <div className="relative" ref={dateRef}>
                <button
                  type="button"
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all duration-200",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50 focus:border-[#5b6949]",
                    showDateDropdown &&
                      "border-[#5b6949] ring-2 ring-[#5b6949]/20",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {getSelectedDateName()}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showDateDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {DATE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setDatePosted(option.value);
                          setShowDateDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                          datePosted === option.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium",
                        )}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all duration-200",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50 focus:border-[#5b6949]",
                    showSortDropdown &&
                      "border-[#5b6949] ring-2 ring-[#5b6949]/20",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {getSelectedSortName()}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showSortDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSort(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                          sort === option.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium",
                        )}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 text-gray-800 font-medium",
                "bg-[#5b6949]",
                "text-white hover:shadow-lg hover:shadow-[#5b6949]/25",
                "transition-all duration-500 hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Jobs
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#5b6949]/10 to-gray-500/10 border border-[#5b6949]/20">
              <div className="w-4 h-4 border-2 border-[#5b6949]/30 border-t-[#5b6949] rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">
                Searching for jobs...
              </span>
            </div>
          </div>
        )}

        {!loading && searched && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200">
              <span className="text-red-600 font-medium">
                No jobs found. Try adjusting your search criteria.
              </span>
            </div>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="relative block bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group"
                >
                  {/* Save Button */}
                  <button
                    onClick={() => saveJob(job)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100/80 hover:bg-[#5b6949]/10 transition-colors"
                    title={
                      savedJobs.includes(job.id) ? "Job saved" : "Save job"
                    }
                  >
                    {savedJobs.includes(job.id) ? (
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  <Link
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-start gap-4">
                      {job.company?.logo && (
                        <div className="flex-shrink-0">
                          <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-12 h-12 object-contain rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-[#5b6949]" />
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#5b6949] transition-colors">
                            {job.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>Posted: {formatDate(job.postAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
