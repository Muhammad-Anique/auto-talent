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
  DollarSign,
  Users,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
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

const LOCATIONS = [
  { name: "United States", value: "103644278" },
  { name: "United Kingdom", value: "101165590" },
  { name: "Canada", value: "101174742" },
  { name: "Germany", value: "101282230" },
  { name: "France", value: "105015875" },
  { name: "Italy", value: "92000000" },
  { name: "Spain", value: "105646813" },
  { name: "Netherlands", value: "102890719" },
  { name: "Australia", value: "101452733" },
  { name: "India", value: "102713980" },
  { name: "Singapore", value: "102454443" },
  { name: "Japan", value: "101355337" },
];

const WORKPLACE_TYPES = [
  { name: "On-site", value: "1" },
  { name: "Remote", value: "2" },
  { name: "Hybrid", value: "3" },
];

const JOB_TYPES = [
  { name: "Full-time", value: "F" },
  { name: "Contract", value: "C" },
  { name: "Part-time", value: "P" },
  { name: "Temporary", value: "T" },
  { name: "Internship", value: "I" },
];

const EXPERIENCE_LEVELS = [
  { name: "Internship", value: "1" },
  { name: "Entry Level", value: "2" },
  { name: "Associate", value: "3" },
  { name: "Mid-Senior Level", value: "4" },
  { name: "Director", value: "5" },
  { name: "Executive", value: "6" },
];

const RECENCY_OPTIONS = [
  { name: "Any Time", value: "" },
  { name: "Past Hour", value: "r3600" },
  { name: "Past 24 Hours", value: "r86400" },
  { name: "Past Week", value: "r604800" },
  { name: "Past Month", value: "r2592000" },
];

const DISTANCE_OPTIONS = [
  { name: "Exact Location", value: "" },
  { name: "Within 10 miles", value: "10" },
  { name: "Within 25 miles", value: "25" },
  { name: "Within 50 miles", value: "50" },
  { name: "Within 100 miles", value: "100" },
];

const SORT_OPTIONS = [
  { name: "Most Recent", value: "DD" },
  { name: "Most Relevant", value: "R" },
];

export default function JobsPage() {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [geoId, setGeoId] = useState("103644278"); // Default to US
  const [distance, setDistance] = useState("");
  const [workplaceType, setWorkplaceType] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string[]>([]);
  const [recency, setRecency] = useState("");
  const [easyApply, setEasyApply] = useState(false);
  const [under10Applicants, setUnder10Applicants] = useState(false);
  const [sortBy, setSortBy] = useState("DD");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { setIsLoading } = useLoading();

  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  // Dropdown states
  const [showGeoDropdown, setShowGeoDropdown] = useState(false);
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [showRecencyDropdown, setShowRecencyDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const geoRef = useRef<HTMLDivElement>(null);
  const distanceRef = useRef<HTMLDivElement>(null);
  const recencyRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (geoRef.current && !geoRef.current.contains(event.target as Node)) {
        setShowGeoDropdown(false);
      }
      if (
        distanceRef.current &&
        !distanceRef.current.contains(event.target as Node)
      ) {
        setShowDistanceDropdown(false);
      }
      if (
        recencyRef.current &&
        !recencyRef.current.contains(event.target as Node)
      ) {
        setShowRecencyDropdown(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e?: React.FormEvent, loadMore = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);

    const currentPage = loadMore ? pageNum + 1 : 0;

    try {
      const res = await fetch("/api/apify/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords,
          location,
          geoId,
          distance: distance ? parseInt(distance) : undefined,
          workplaceType: workplaceType.length > 0 ? workplaceType : undefined,
          jobType: jobType.length > 0 ? jobType : undefined,
          experienceLevel:
            experienceLevel.length > 0 ? experienceLevel : undefined,
          recency: recency || undefined,
          easyApply,
          under10Applicants,
          sortBy,
          pageNum: currentPage,
          count: 100, // Apify minimum
        }),
      });

      const data = await res.json();

      if (data.success) {
        const jobList = data.data ?? [];
        console.log("Fetched jobs:", jobList);

        if (loadMore) {
          setJobs((prev) => [...prev, ...jobList]);
        } else {
          setJobs(jobList);
        }

        setPageNum(currentPage);
        setHasMore(data.pagination?.hasMore ?? false);
      } else {
        console.error("Error:", data.error);
        if (!loadMore) setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      if (!loadMore) setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    handleSearch(undefined, true);
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
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const toggleArrayValue = (
    arr: string[],
    setArr: (val: string[]) => void,
    value: string
  ) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const getSelectedGeoName = () => {
    const loc = LOCATIONS.find((l) => l.value === geoId);
    return loc?.name || "United States";
  };

  const getSelectedDistanceName = () => {
    const dist = DISTANCE_OPTIONS.find((d) => d.value === distance);
    return dist?.name || "Exact Location";
  };

  const getSelectedRecencyName = () => {
    const rec = RECENCY_OPTIONS.find((r) => r.value === recency);
    return rec?.name || "Any Time";
  };

  const getSelectedSortName = () => {
    const sort = SORT_OPTIONS.find((s) => s.value === sortBy);
    return sort?.name || "Most Recent";
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (workplaceType.length > 0) count++;
    if (jobType.length > 0) count++;
    if (experienceLevel.length > 0) count++;
    if (recency) count++;
    if (easyApply) count++;
    if (under10Applicants) count++;
    if (distance) count++;
    return count;
  };

  const toggleJobExpanded = (jobId: string) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
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
              Advanced LinkedIn Job Search
            </h1>
            <p className="text-gray-600 mt-2">
              Search with powerful filters powered by Apify
            </p>
          </div>
        </div>

        {/* Search Form */}
        <div className="relative rounded-2xl backdrop-blur-xl bg-white/60 border border-gray-200/50 shadow-xl">
          <form onSubmit={handleSearch} className="p-6 space-y-6">
            {/* Main Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Keywords Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Job title, keywords (e.g., React Developer)"
                  className="pl-10 h-12 text-gray-800 bg-white/80 border-gray-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  required
                />
              </div>

              {/* Location Input */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="City, state, or country (optional)"
                  className="pl-10 h-12 text-gray-800 bg-white/80 border-gray-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Filters Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* GeoID Dropdown */}
              <div className="relative" ref={geoRef}>
                <button
                  type="button"
                  onClick={() => setShowGeoDropdown(!showGeoDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50",
                    showGeoDropdown && "border-[#5b6949] ring-2 ring-[#5b6949]/20"
                  )}
                >
                  <span className="text-sm text-gray-700 truncate">
                    {getSelectedGeoName()}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                {showGeoDropdown && (
                  <div className="absolute z-[200] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => {
                          setGeoId(loc.value);
                          setShowGeoDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm",
                          geoId === loc.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium"
                        )}
                      >
                        {loc.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Distance Dropdown */}
              <div className="relative" ref={distanceRef}>
                <button
                  type="button"
                  onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50",
                    showDistanceDropdown &&
                      "border-[#5b6949] ring-2 ring-[#5b6949]/20"
                  )}
                >
                  <span className="text-sm text-gray-700 truncate">
                    {getSelectedDistanceName()}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                {showDistanceDropdown && (
                  <div className="absolute z-[200] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {DISTANCE_OPTIONS.map((dist) => (
                      <button
                        key={dist.value}
                        type="button"
                        onClick={() => {
                          setDistance(dist.value);
                          setShowDistanceDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm",
                          distance === dist.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium"
                        )}
                      >
                        {dist.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Recency Dropdown */}
              <div className="relative" ref={recencyRef}>
                <button
                  type="button"
                  onClick={() => setShowRecencyDropdown(!showRecencyDropdown)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50",
                    showRecencyDropdown &&
                      "border-[#5b6949] ring-2 ring-[#5b6949]/20"
                  )}
                >
                  <span className="text-sm text-gray-700 truncate">
                    {getSelectedRecencyName()}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                {showRecencyDropdown && (
                  <div className="absolute z-[200] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {RECENCY_OPTIONS.map((rec) => (
                      <button
                        key={rec.value}
                        type="button"
                        onClick={() => {
                          setRecency(rec.value);
                          setShowRecencyDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm",
                          recency === rec.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium"
                        )}
                      >
                        {rec.name}
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
                    "w-full flex items-center justify-between p-3 h-12 rounded-lg border transition-all",
                    "bg-white/80 border-gray-200 hover:border-[#5b6949]/50",
                    showSortDropdown &&
                      "border-[#5b6949] ring-2 ring-[#5b6949]/20"
                  )}
                >
                  <span className="text-sm text-gray-700 truncate">
                    {getSelectedSortName()}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                  <div className="absolute z-[200] top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {SORT_OPTIONS.map((sort) => (
                      <button
                        key={sort.value}
                        type="button"
                        onClick={() => {
                          setSortBy(sort.value);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm",
                          sortBy === sort.value &&
                            "bg-[#5b6949]/10 text-[#5b6949] font-medium"
                        )}
                      >
                        {sort.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-[#5b6949] hover:text-[#4a573a] font-medium transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-[#5b6949] text-white rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="space-y-6 pt-4 border-t border-gray-200">
                {/* Workplace Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Workplace Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WORKPLACE_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          toggleArrayValue(
                            workplaceType,
                            setWorkplaceType,
                            type.value
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          workplaceType.includes(type.value)
                            ? "bg-[#5b6949] text-white border-[#5b6949]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#5b6949]/50"
                        )}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Job Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          toggleArrayValue(jobType, setJobType, type.value)
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          jobType.includes(type.value)
                            ? "bg-[#5b6949] text-white border-[#5b6949]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#5b6949]/50"
                        )}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Experience Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          toggleArrayValue(
                            experienceLevel,
                            setExperienceLevel,
                            level.value
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          experienceLevel.includes(level.value)
                            ? "bg-[#5b6949] text-white border-[#5b6949]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#5b6949]/50"
                        )}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Special Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEasyApply(!easyApply)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                        easyApply
                          ? "bg-[#5b6949] text-white border-[#5b6949]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#5b6949]/50"
                      )}
                    >
                      <Zap className="w-4 h-4" />
                      Easy Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnder10Applicants(!under10Applicants)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                        under10Applicants
                          ? "bg-[#5b6949] text-white border-[#5b6949]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#5b6949]/50"
                      )}
                    >
                      <Users className="w-4 h-4" />
                      Under 10 Applicants
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                {getActiveFiltersCount() > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setWorkplaceType([]);
                      setJobType([]);
                      setExperienceLevel([]);
                      setRecency("");
                      setEasyApply(false);
                      setUnder10Applicants(false);
                      setDistance("");
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Search Button */}
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 text-gray-800 font-medium",
                "bg-[#5b6949]",
                "text-white hover:shadow-lg hover:shadow-[#5b6949]/25",
                "transition-all duration-500 hover:-translate-y-0.5",
                "disabled:opacity-50 disabled:cursor-not-allowed"
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
        {loading && pageNum === 0 && (
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

        {jobs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Found {jobs.length} job{jobs.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => {
                const isExpanded = expandedJobs.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="relative block bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 group"
                  >
                    {/* Save Button */}
                    <button
                      onClick={() => saveJob(job)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100/80 hover:bg-[#5b6949]/10 transition-colors z-10"
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

                    <div className="flex items-start gap-4 mb-4">
                      {job.companyLogo && (
                        <div className="flex-shrink-0">
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="w-12 h-12 object-contain rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-[#5b6949]" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2 flex-wrap">
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
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.applicantsCount && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span className="font-medium text-[#5b6949]">
                                {job.applicantsCount} applicants
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
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
                    </div>

                    {/* Expandable Details Section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {/* Job Description */}
                        {job.descriptionHtml && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              Job Description
                            </h4>
                            <div
                              className="text-sm text-gray-700 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: job.descriptionHtml,
                              }}
                            />
                          </div>
                        )}

                        {/* Additional Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Company Info */}
                          {(job.companyDescription ||
                            job.companySlogan ||
                            job.companyWebsite) && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-900">
                                About {job.companyName}
                              </h4>
                              {job.companySlogan && (
                                <p className="text-sm text-gray-600 italic">
                                  {job.companySlogan}
                                </p>
                              )}
                              {job.companyDescription && (
                                <p className="text-sm text-gray-700">
                                  {job.companyDescription}
                                </p>
                              )}
                              {job.companyWebsite && (
                                <a
                                  href={job.companyWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-sm text-[#5b6949] hover:underline"
                                >
                                  <Globe className="w-4 h-4" />
                                  Visit Company Website
                                </a>
                              )}
                            </div>
                          )}

                          {/* Job Details */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-900">
                              Job Details
                            </h4>
                            {job.jobFunction && (
                              <div className="text-sm">
                                <span className="text-gray-600">
                                  Function:{" "}
                                </span>
                                <span className="text-gray-900">
                                  {job.jobFunction}
                                </span>
                              </div>
                            )}
                            {job.industries && (
                              <div className="text-sm">
                                <span className="text-gray-600">
                                  Industries:{" "}
                                </span>
                                <span className="text-gray-900">
                                  {job.industries}
                                </span>
                              </div>
                            )}
                            {job.benefits && job.benefits.length > 0 && (
                              <div>
                                <span className="text-sm text-gray-600">
                                  Benefits:{" "}
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {job.benefits.map((benefit, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded"
                                    >
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Links */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Link
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-4 py-2 bg-[#5b6949] text-white rounded-lg hover:bg-[#4a573a] transition-colors text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View on LinkedIn
                          </Link>
                          {job.applyUrl && (
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-4 py-2 bg-white border-2 border-[#5b6949] text-[#5b6949] rounded-lg hover:bg-[#5b6949] hover:text-white transition-colors text-sm font-medium"
                            >
                              <Zap className="w-4 h-4" />
                              Apply Now
                            </a>
                          )}
                          {job.companyLinkedinUrl && (
                            <a
                              href={job.companyLinkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              <Building2 className="w-4 h-4" />
                              Company Page
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Toggle Button */}
                    <button
                      onClick={() => toggleJobExpanded(job.id)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-[#5b6949] hover:text-[#4a573a] transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show More Details
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={cn(
                    "px-8 h-12 font-medium",
                    "bg-white text-[#5b6949] border-2 border-[#5b6949]",
                    "hover:bg-[#5b6949] hover:text-white",
                    "transition-all duration-300"
                  )}
                >
                  Load More Jobs
                </Button>
              </div>
            )}

            {loading && pageNum > 0 && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[#5b6949] rounded-full animate-spin"></div>
                  <span>Loading more jobs...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
