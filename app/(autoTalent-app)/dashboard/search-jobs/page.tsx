"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  Wifi,
  Radar,
  Database,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkCanPerformAction, recordUsage } from "@/utils/actions/subscriptions/usage";
import { PaywallModal } from "@/components/ui/paywall-modal";
import { useLocale } from "@/components/providers/locale-provider";

// --- Cache utilities ---
const CACHE_KEY = "job_search_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface CachedSearch {
  params: string; // JSON stringified search params
  jobs: Job[];
  timestamp: number;
  hasMore: boolean;
  pageNum: number;
}

function getCacheKey(params: Record<string, unknown>): string {
  const sorted = Object.keys(params).sort().reduce((acc, key) => {
    if (params[key] !== undefined && params[key] !== "" && params[key] !== false) {
      acc[key] = params[key];
    }
    return acc;
  }, {} as Record<string, unknown>);
  return JSON.stringify(sorted);
}

function saveToCache(paramsKey: string, jobs: Job[], hasMore: boolean, pageNum: number) {
  try {
    const cache: CachedSearch = {
      params: paramsKey,
      jobs,
      timestamp: Date.now(),
      hasMore,
      pageNum,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

function loadFromCache(paramsKey?: string): CachedSearch | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: CachedSearch = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    if (paramsKey && cache.params !== paramsKey) return null;
    return cache;
  } catch {
    return null;
  }
}

// --- Search stages ---
const SEARCH_STAGES = [
  { id: "connecting", labelKey: "stageConnecting", icon: Wifi, duration: 2000 },
  { id: "scanning", labelKey: "stageScanning", icon: Radar, duration: 8000 },
  { id: "retrieving", labelKey: "stageRetrieving", icon: Database, duration: 15000 },
  { id: "processing", labelKey: "stageProcessing", icon: Loader2, duration: 5000 },
] as const;

type SearchStage = typeof SEARCH_STAGES[number]["id"] | "done";

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
  { name: "Algeria", value: "104514572" },
  { name: "Argentina", value: "100446943" },
  { name: "Australia", value: "101452733" },
  { name: "Austria", value: "103883259" },
  { name: "Bahrain", value: "106536815" },
  { name: "Belgium", value: "100565514" },
  { name: "Brazil", value: "106057199" },
  { name: "Bulgaria", value: "105333783" },
  { name: "Canada", value: "101174742" },
  { name: "Chile", value: "104621616" },
  { name: "China", value: "102890883" },
  { name: "Colombia", value: "100876405" },
  { name: "Croatia", value: "104688944" },
  { name: "Cyprus", value: "106268007" },
  { name: "Czech Republic", value: "104508036" },
  { name: "Denmark", value: "104514075" },
  { name: "Egypt", value: "106155005" },
  { name: "Estonia", value: "102974008" },
  { name: "Finland", value: "100456013" },
  { name: "France", value: "105015875" },
  { name: "Germany", value: "101282230" },
  { name: "Greece", value: "104677530" },
  { name: "Hong Kong", value: "103291313" },
  { name: "Hungary", value: "100288700" },
  { name: "Iceland", value: "105238872" },
  { name: "India", value: "102713980" },
  { name: "Indonesia", value: "102478259" },
  { name: "Iraq", value: "103844144" },
  { name: "Ireland", value: "104738515" },
  { name: "Israel", value: "101620260" },
  { name: "Italy", value: "103350119" },
  { name: "Japan", value: "101355337" },
  { name: "Jordan", value: "102134353" },
  { name: "Kenya", value: "100878354" },
  { name: "Kuwait", value: "103775171" },
  { name: "Latvia", value: "104341318" },
  { name: "Lebanon", value: "101834488" },
  { name: "Lithuania", value: "101464403" },
  { name: "Luxembourg", value: "104042105" },
  { name: "Malaysia", value: "106808692" },
  { name: "Malta", value: "101728296" },
  { name: "Mexico", value: "103323778" },
  { name: "Morocco", value: "102787409" },
  { name: "Netherlands", value: "102890719" },
  { name: "New Zealand", value: "105490917" },
  { name: "Nigeria", value: "105365761" },
  { name: "Norway", value: "103819153" },
  { name: "Oman", value: "102067001" },
  { name: "Pakistan", value: "101022442" },
  { name: "Philippines", value: "103121230" },
  { name: "Poland", value: "105072130" },
  { name: "Portugal", value: "100364837" },
  { name: "Qatar", value: "104111396" },
  { name: "Romania", value: "106670623" },
  { name: "Saudi Arabia", value: "100459316" },
  { name: "Serbia", value: "101855366" },
  { name: "Singapore", value: "102454443" },
  { name: "Slovakia", value: "103119917" },
  { name: "Slovenia", value: "106137034" },
  { name: "South Africa", value: "104035573" },
  { name: "South Korea", value: "105149562" },
  { name: "Spain", value: "105646813" },
  { name: "Sweden", value: "105117694" },
  { name: "Switzerland", value: "106693272" },
  { name: "Taiwan", value: "104187078" },
  { name: "Thailand", value: "105146118" },
  { name: "Tunisia", value: "102477973" },
  { name: "Turkey", value: "102105699" },
  { name: "Ukraine", value: "102264497" },
  { name: "United Arab Emirates", value: "104305776" },
  { name: "United Kingdom", value: "101165590" },
  { name: "United States", value: "103644278" },
  { name: "Vietnam", value: "104195383" },
];

// Popular job titles for autocomplete
const JOB_TITLE_SUGGESTIONS = [
  // Engineering & Tech
  "Software Engineer",
  "Software Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Engineer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cloud Engineer",
  "Cloud Architect",
  "Solutions Architect",
  "Site Reliability Engineer",
  "QA Engineer",
  "Test Engineer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "JavaScript Developer",
  "TypeScript Developer",
  "Golang Developer",
  "Rust Developer",
  "C++ Developer",
  ".NET Developer",
  "PHP Developer",
  "Ruby Developer",
  "Blockchain Developer",
  "Security Engineer",
  "Cybersecurity Analyst",
  "Network Engineer",
  "Systems Engineer",
  "Database Administrator",
  "System Administrator",
  "IT Support",
  "IT Manager",
  "Technical Lead",
  "Engineering Manager",
  "CTO",
  "VP of Engineering",

  // Product & Design
  "Product Manager",
  "Product Owner",
  "Project Manager",
  "Program Manager",
  "Scrum Master",
  "Agile Coach",
  "UX Designer",
  "UI Designer",
  "UX/UI Designer",
  "Product Designer",
  "Graphic Designer",
  "Visual Designer",
  "Interaction Designer",
  "UX Researcher",
  "Design Lead",
  "Creative Director",
  "Art Director",

  // Marketing & Sales
  "Marketing Manager",
  "Digital Marketing Manager",
  "Content Marketing Manager",
  "SEO Specialist",
  "SEO Manager",
  "Social Media Manager",
  "Content Writer",
  "Copywriter",
  "Brand Manager",
  "Marketing Analyst",
  "Growth Manager",
  "Growth Hacker",
  "Performance Marketing",
  "Email Marketing",
  "Sales Manager",
  "Sales Representative",
  "Account Executive",
  "Business Development",
  "Account Manager",
  "Sales Director",
  "VP of Sales",
  "Customer Success Manager",
  "Customer Support",

  // Business & Operations
  "Business Analyst",
  "Operations Manager",
  "Strategy Consultant",
  "Management Consultant",
  "Financial Analyst",
  "Accountant",
  "Finance Manager",
  "CFO",
  "Controller",
  "HR Manager",
  "HR Business Partner",
  "Recruiter",
  "Talent Acquisition",
  "People Operations",
  "Office Manager",
  "Executive Assistant",
  "Administrative Assistant",
  "Legal Counsel",
  "Compliance Officer",
  "CEO",
  "COO",

  // Healthcare
  "Nurse",
  "Registered Nurse",
  "Physician",
  "Doctor",
  "Pharmacist",
  "Physical Therapist",
  "Medical Assistant",
  "Healthcare Administrator",
  "Clinical Research",
  "Biomedical Engineer",

  // Others
  "Teacher",
  "Professor",
  "Research Scientist",
  "Consultant",
  "Analyst",
  "Manager",
  "Director",
  "Intern",
  "Entry Level",
  "Remote",
];

// Popular cities for autocomplete
const CITY_SUGGESTIONS = [
  // USA
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "San Jose, CA",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Chicago, IL",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Dallas, TX",
  "Houston, TX",
  "Phoenix, AZ",
  "San Diego, CA",
  "Portland, OR",
  "Washington, DC",
  "Philadelphia, PA",
  "Minneapolis, MN",
  "Detroit, MI",
  "Raleigh, NC",
  "Nashville, TN",
  "Salt Lake City, UT",

  // UK
  "London, UK",
  "Manchester, UK",
  "Birmingham, UK",
  "Edinburgh, UK",
  "Glasgow, UK",
  "Bristol, UK",
  "Leeds, UK",
  "Liverpool, UK",
  "Cambridge, UK",
  "Oxford, UK",

  // Europe
  "Berlin, Germany",
  "Munich, Germany",
  "Frankfurt, Germany",
  "Hamburg, Germany",
  "Cologne, Germany",
  "Paris, France",
  "Lyon, France",
  "Marseille, France",
  "Amsterdam, Netherlands",
  "Rotterdam, Netherlands",
  "Brussels, Belgium",
  "Zurich, Switzerland",
  "Geneva, Switzerland",
  "Vienna, Austria",
  "Dublin, Ireland",
  "Milan, Italy",
  "Rome, Italy",
  "Madrid, Spain",
  "Barcelona, Spain",
  "Lisbon, Portugal",
  "Stockholm, Sweden",
  "Copenhagen, Denmark",
  "Oslo, Norway",
  "Helsinki, Finland",
  "Warsaw, Poland",
  "Prague, Czech Republic",
  "Budapest, Hungary",
  "Bucharest, Romania",
  "Athens, Greece",

  // Middle East & Arab
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Riyadh, Saudi Arabia",
  "Jeddah, Saudi Arabia",
  "Doha, Qatar",
  "Kuwait City, Kuwait",
  "Manama, Bahrain",
  "Muscat, Oman",
  "Amman, Jordan",
  "Beirut, Lebanon",
  "Cairo, Egypt",
  "Alexandria, Egypt",
  "Casablanca, Morocco",
  "Tunis, Tunisia",
  "Tel Aviv, Israel",
  "Istanbul, Turkey",
  "Ankara, Turkey",

  // Asia Pacific
  "Singapore",
  "Tokyo, Japan",
  "Osaka, Japan",
  "Seoul, South Korea",
  "Hong Kong",
  "Taipei, Taiwan",
  "Beijing, China",
  "Shanghai, China",
  "Shenzhen, China",
  "Bangalore, India",
  "Mumbai, India",
  "Delhi, India",
  "Hyderabad, India",
  "Chennai, India",
  "Pune, India",
  "Kuala Lumpur, Malaysia",
  "Jakarta, Indonesia",
  "Bangkok, Thailand",
  "Ho Chi Minh City, Vietnam",
  "Manila, Philippines",
  "Sydney, Australia",
  "Melbourne, Australia",
  "Brisbane, Australia",
  "Perth, Australia",
  "Auckland, New Zealand",

  // Latin America
  "São Paulo, Brazil",
  "Rio de Janeiro, Brazil",
  "Mexico City, Mexico",
  "Buenos Aires, Argentina",
  "Santiago, Chile",
  "Bogotá, Colombia",

  // Africa
  "Johannesburg, South Africa",
  "Cape Town, South Africa",
  "Lagos, Nigeria",
  "Nairobi, Kenya",

  // Canada
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada",
  "Calgary, Canada",
  "Ottawa, Canada",
];

const WORKPLACE_TYPES = [
  { nameKey: "onSite", value: "1" },
  { nameKey: "remote", value: "2" },
  { nameKey: "hybrid", value: "3" },
];

const JOB_TYPES = [
  { nameKey: "fullTime", value: "F" },
  { nameKey: "contract", value: "C" },
  { nameKey: "partTime", value: "P" },
  { nameKey: "temporary", value: "T" },
  { nameKey: "internship", value: "I" },
];

const EXPERIENCE_LEVELS = [
  { nameKey: "internship", value: "1" },
  { nameKey: "entryLevel", value: "2" },
  { nameKey: "associate", value: "3" },
  { nameKey: "midSeniorLevel", value: "4" },
  { nameKey: "director", value: "5" },
  { nameKey: "executive", value: "6" },
];

const RECENCY_OPTIONS = [
  { nameKey: "anyTime", value: "" },
  { nameKey: "pastHour", value: "r3600" },
  { nameKey: "past24Hours", value: "r86400" },
  { nameKey: "pastWeek", value: "r604800" },
  { nameKey: "pastMonth", value: "r2592000" },
];

const DISTANCE_OPTIONS = [
  { nameKey: "exactLocation", value: "" },
  { nameKey: "within10Miles", value: "10" },
  { nameKey: "within25Miles", value: "25" },
  { nameKey: "within50Miles", value: "50" },
  { nameKey: "within100Miles", value: "100" },
];

const SORT_OPTIONS = [
  { nameKey: "mostRecent", value: "DD" },
  { nameKey: "mostRelevant", value: "R" },
];

export default function JobsPage() {
  const { t } = useLocale();
  const tr = (key: string) => t(`dashboard.searchJobsPage.${key}`);
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

  // Autocomplete states
  const [showKeywordsSuggestions, setShowKeywordsSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const keywordsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Filtered suggestions based on input
  const filteredJobTitles = useMemo(() => {
    if (!keywords.trim() || keywords.length < 2) return [];
    const searchLower = keywords.toLowerCase();
    return JOB_TITLE_SUGGESTIONS
      .filter(title => title.toLowerCase().includes(searchLower))
      .slice(0, 8);
  }, [keywords]);

  const filteredCities = useMemo(() => {
    if (!location.trim() || location.length < 2) return [];
    const searchLower = location.toLowerCase();
    return CITY_SUGGESTIONS
      .filter(city => city.toLowerCase().includes(searchLower))
      .slice(0, 8);
  }, [location]);

  // Search progress tracking
  const [searchStage, setSearchStage] = useState<SearchStage>("connecting");
  const [searchElapsed, setSearchElapsed] = useState(0);
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [cachedResultsShown, setCachedResultsShown] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

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

  // Restore cached results on mount
  useEffect(() => {
    const cached = loadFromCache();
    if (cached && cached.jobs.length > 0) {
      setJobs(cached.jobs);
      setHasMore(cached.hasMore);
      setPageNum(cached.pageNum);
      setSearched(true);
      setCachedResultsShown(true);
    }
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data } = await supabase
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
      // Close autocomplete dropdowns
      if (keywordsRef.current && !keywordsRef.current.contains(event.target as Node)) {
        setShowKeywordsSuggestions(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Progress stage simulation
  const startProgressStages = useCallback(() => {
    setSearchStage("connecting");
    setSearchElapsed(0);

    // Elapsed timer (ticks every second)
    elapsedTimerRef.current = setInterval(() => {
      setSearchElapsed((prev) => prev + 1);
    }, 1000);

    // Stage progression
    let cumulativeDelay = 0;
    const timers: NodeJS.Timeout[] = [];

    SEARCH_STAGES.forEach((stage, idx) => {
      if (idx === 0) return; // already set to "connecting"
      cumulativeDelay += SEARCH_STAGES[idx - 1].duration;
      const timer = setTimeout(() => {
        setSearchStage(stage.id);
      }, cumulativeDelay);
      timers.push(timer);
    });

    stageTimerRef.current = timers[0]; // store for cleanup
    return timers;
  }, []);

  const stopProgressStages = useCallback((timers?: NodeJS.Timeout[]) => {
    setSearchStage("done");
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    if (timers) timers.forEach((t) => clearTimeout(t));
  }, []);

  const getSearchParams = useCallback(() => ({
    keywords,
    location,
    geoId,
    distance: distance ? parseInt(distance) : undefined,
    workplaceType: workplaceType.length > 0 ? workplaceType : undefined,
    jobType: jobType.length > 0 ? jobType : undefined,
    experienceLevel: experienceLevel.length > 0 ? experienceLevel : undefined,
    recency: recency || undefined,
    easyApply,
    under10Applicants,
    sortBy,
  }), [keywords, location, geoId, distance, workplaceType, jobType, experienceLevel, recency, easyApply, under10Applicants, sortBy]);

  const handleSearch = async (e?: React.FormEvent, loadMore = false) => {
    if (e) e.preventDefault();
    setSearched(true);

    const currentPage = loadMore ? pageNum + 1 : 0;
    const isNewSearch = !loadMore;
    const params = getSearchParams();
    const paramsKey = getCacheKey({ ...params, pageNum: 0 });

    // For new searches, check cache first
    if (isNewSearch) {
      const cached = loadFromCache(paramsKey);
      if (cached && cached.jobs.length > 0) {
        setJobs(cached.jobs);
        setHasMore(cached.hasMore);
        setPageNum(cached.pageNum);
        setCachedResultsShown(true);
        return; // Use cache, skip API call
      }
    }

    // Check job search credit (skip for cache hits and load-more)
    if (isNewSearch) {
      const creditCheck = await checkCanPerformAction('job_search');
      if (!creditCheck.allowed) {
        setShowPaywall(true);
        return;
      }
      await recordUsage('job_search');
    }

    setLoading(true);
    setCachedResultsShown(false);

    // Start progress stages for new searches (not load more)
    let progressTimers: NodeJS.Timeout[] | undefined;
    if (isNewSearch) {
      progressTimers = startProgressStages();
    }

    try {
      const res = await fetch("/api/apify/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          pageNum: currentPage,
          count: 100,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const jobList = data.data ?? [];

        if (loadMore) {
          const merged = [...jobs, ...jobList];
          setJobs(merged);
          setPageNum(currentPage);
          setHasMore(data.pagination?.hasMore ?? false);
          // Update cache with merged results
          saveToCache(paramsKey, merged, data.pagination?.hasMore ?? false, currentPage);
        } else {
          setJobs(jobList);
          setPageNum(currentPage);
          setHasMore(data.pagination?.hasMore ?? false);
          // Cache new results
          saveToCache(paramsKey, jobList, data.pagination?.hasMore ?? false, currentPage);
        }
      } else {
        console.error("Error:", data.error);
        if (!loadMore) setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      if (!loadMore) setJobs([]);
    } finally {
      if (isNewSearch) stopProgressStages(progressTimers);
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
      alert(tr('pleaseLogIn'));
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
      alert(tr('failedToSave'));
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
    return dist?.nameKey ? tr(dist.nameKey) : tr('exactLocation');
  };

  const getSelectedRecencyName = () => {
    const rec = RECENCY_OPTIONS.find((r) => r.value === recency);
    return rec?.nameKey ? tr(rec.nameKey) : tr('anyTime');
  };

  const getSelectedSortName = () => {
    const sort = SORT_OPTIONS.find((s) => s.value === sortBy);
    return sort?.nameKey ? tr(sort.nameKey) : tr('mostRecent');
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

  // Reusable dropdown button component
  const DropdownSelector = ({
    label,
    value,
    isOpen,
    onToggle,
    options,
    onSelect,
    selectedValue,
    dropdownRef,
    translateOptions = false,
  }: {
    label: string;
    value: string;
    isOpen: boolean;
    onToggle: () => void;
    options: { name?: string; nameKey?: string; value: string }[];
    onSelect: (value: string) => void;
    selectedValue: string;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    translateOptions?: boolean;
  }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 h-11 rounded-xl border text-sm transition-all duration-200",
          "bg-white hover:bg-zinc-50",
          isOpen
            ? "border-[#5b6949] ring-2 ring-[#5b6949]/10 shadow-sm"
            : "border-zinc-200 hover:border-zinc-300"
        )}
      >
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 leading-none mb-0.5">
            {label}
          </span>
          <span className="text-zinc-800 font-medium truncate">{value}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="absolute z-[200] top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl shadow-black/5 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl",
                selectedValue === opt.value
                  ? "bg-[#5b6949]/10 text-[#5b6949] font-semibold"
                  : "text-zinc-700 hover:bg-zinc-50"
              )}
            >
              {translateOptions && opt.nameKey ? tr(opt.nameKey) : opt.name}
            </button>
          ))}
        </div>
      )}
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
          {/* Glow orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5b6949]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#5b6949]/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5b6949]/20 border border-[#5b6949]/30 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#8fa676]" />
                <span className="text-xs font-semibold text-[#8fa676] tracking-wide uppercase">
                  {tr('badge')}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {tr('title')}
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
                {tr('subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-[#8fa676]" />
                <span className="text-sm text-zinc-300 font-medium">
                  {loading ? tr('searching') : jobs.length > 0 ? `${jobs.length} ${tr('results')}` : tr('readyToSearch')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form Card */}
        <div className="relative rounded-2xl bg-white border border-zinc-200/80 shadow-sm shadow-black/[0.03]">
          <form onSubmit={handleSearch} className="p-6 sm:p-8 space-y-6">
            {/* Main Search Row */}
            <div className="flex flex-col md:flex-row gap-3">
              {/* Keywords with Autocomplete */}
              <div className="relative flex-1" ref={keywordsRef}>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-[#5b6949]/10 group-focus-within:bg-[#5b6949]/20 transition-colors z-10">
                    <Search className="w-3.5 h-3.5 text-[#5b6949]" />
                  </div>
                  <Input
                    type="text"
                    placeholder={tr('keywordsPlaceholder')}
                    className="pl-12 h-12 text-zinc-800 bg-zinc-50/50 border-zinc-200 rounded-xl focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 focus:bg-white placeholder:text-zinc-400 transition-all"
                    value={keywords}
                    onChange={(e) => {
                      setKeywords(e.target.value);
                      setShowKeywordsSuggestions(e.target.value.length >= 2);
                    }}
                    onFocus={() => setShowKeywordsSuggestions(keywords.length >= 2 && filteredJobTitles.length > 0)}
                    required
                    autoComplete="off"
                  />
                </div>
                {/* Keywords Suggestions Dropdown */}
                {showKeywordsSuggestions && filteredJobTitles.length > 0 && (
                  <div className="absolute z-[200] top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl shadow-black/5 max-h-64 overflow-y-auto">
                    <div className="py-1">
                      {filteredJobTitles.map((title, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setKeywords(title);
                            setShowKeywordsSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-[#5b6949]/5 hover:text-[#5b6949] transition-colors flex items-center gap-3"
                        >
                          <Briefcase className="w-4 h-4 text-zinc-400" />
                          <span>{title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location with Autocomplete */}
              <div className="relative flex-1" ref={locationRef}>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-[#5b6949]/10 group-focus-within:bg-[#5b6949]/20 transition-colors z-10">
                    <MapPin className="w-3.5 h-3.5 text-[#5b6949]" />
                  </div>
                  <Input
                    type="text"
                    placeholder={tr('locationPlaceholder')}
                    className="pl-12 h-12 text-zinc-800 bg-zinc-50/50 border-zinc-200 rounded-xl focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 focus:bg-white placeholder:text-zinc-400 transition-all"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setShowLocationSuggestions(e.target.value.length >= 2);
                    }}
                    onFocus={() => setShowLocationSuggestions(location.length >= 2 && filteredCities.length > 0)}
                    autoComplete="off"
                  />
                </div>
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && filteredCities.length > 0 && (
                  <div className="absolute z-[200] top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl shadow-black/5 max-h-64 overflow-y-auto">
                    <div className="py-1">
                      {filteredCities.map((city, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setLocation(city);
                            setShowLocationSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-[#5b6949]/5 hover:text-[#5b6949] transition-colors flex items-center gap-3"
                        >
                          <MapPin className="w-4 h-4 text-zinc-400" />
                          <span>{city}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button - visible on md+ */}
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "h-12 px-8 font-semibold rounded-xl whitespace-nowrap hidden md:flex",
                  "bg-[#5b6949] text-white shadow-md shadow-[#5b6949]/20",
                  "hover:bg-[#4a573a] hover:shadow-lg hover:shadow-[#5b6949]/25",
                  "active:scale-[0.98] transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                )}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {tr('searching')}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    {tr('search')}
                  </div>
                )}
              </Button>
            </div>

            {/* Quick Filter Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DropdownSelector
                label={tr('region')}
                value={getSelectedGeoName()}
                isOpen={showGeoDropdown}
                onToggle={() => setShowGeoDropdown(!showGeoDropdown)}
                options={LOCATIONS}
                onSelect={(val) => {
                  setGeoId(val);
                  setShowGeoDropdown(false);
                }}
                selectedValue={geoId}
                dropdownRef={geoRef}
              />
              <DropdownSelector
                label={tr('distance')}
                value={getSelectedDistanceName()}
                isOpen={showDistanceDropdown}
                onToggle={() =>
                  setShowDistanceDropdown(!showDistanceDropdown)
                }
                options={DISTANCE_OPTIONS}
                onSelect={(val) => {
                  setDistance(val);
                  setShowDistanceDropdown(false);
                }}
                selectedValue={distance}
                dropdownRef={distanceRef}
                translateOptions={true}
              />
              <DropdownSelector
                label={tr('posted')}
                value={getSelectedRecencyName()}
                isOpen={showRecencyDropdown}
                onToggle={() =>
                  setShowRecencyDropdown(!showRecencyDropdown)
                }
                options={RECENCY_OPTIONS}
                onSelect={(val) => {
                  setRecency(val);
                  setShowRecencyDropdown(false);
                }}
                selectedValue={recency}
                dropdownRef={recencyRef}
                translateOptions={true}
              />
              <DropdownSelector
                label={tr('sortBy')}
                value={getSelectedSortName()}
                isOpen={showSortDropdown}
                onToggle={() => setShowSortDropdown(!showSortDropdown)}
                options={SORT_OPTIONS}
                onSelect={(val) => {
                  setSortBy(val);
                  setShowSortDropdown(false);
                }}
                selectedValue={sortBy}
                dropdownRef={sortRef}
                translateOptions={true}
              />
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 py-2 text-sm font-semibold text-zinc-500 hover:text-[#5b6949] transition-colors group"
              >
                <SlidersHorizontal className="w-4 h-4 group-hover:text-[#5b6949] transition-colors" />
                <span>{tr('advancedFilters')}</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-[#5b6949] text-white rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    showFilters && "rotate-180"
                  )}
                />
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="space-y-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                {/* Workplace Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    {tr('workplaceType')}
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
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                          workplaceType.includes(type.value)
                            ? "bg-[#5b6949] text-white border-[#5b6949] shadow-sm shadow-[#5b6949]/20"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-[#5b6949]/40 hover:text-[#5b6949]"
                        )}
                      >
                        {tr(type.nameKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    {tr('jobType')}
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
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                          jobType.includes(type.value)
                            ? "bg-[#5b6949] text-white border-[#5b6949] shadow-sm shadow-[#5b6949]/20"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-[#5b6949]/40 hover:text-[#5b6949]"
                        )}
                      >
                        {tr(type.nameKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    {tr('experienceLevel')}
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
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                          experienceLevel.includes(level.value)
                            ? "bg-[#5b6949] text-white border-[#5b6949] shadow-sm shadow-[#5b6949]/20"
                            : "bg-white text-zinc-600 border-zinc-200 hover:border-[#5b6949]/40 hover:text-[#5b6949]"
                        )}
                      >
                        {tr(level.nameKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Filters */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    {tr('specialFilters')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEasyApply(!easyApply)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        easyApply
                          ? "bg-[#5b6949] text-white border-[#5b6949] shadow-sm shadow-[#5b6949]/20"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-[#5b6949]/40 hover:text-[#5b6949]"
                      )}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {tr('easyApply')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnder10Applicants(!under10Applicants)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        under10Applicants
                          ? "bg-[#5b6949] text-white border-[#5b6949] shadow-sm shadow-[#5b6949]/20"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-[#5b6949]/40 hover:text-[#5b6949]"
                      )}
                    >
                      <Users className="w-3.5 h-3.5" />
                      {tr('under10Applicants')}
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
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    {tr('clearAllFilters')}
                  </button>
                )}
              </div>
            )}

            {/* Mobile Search Button */}
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 font-semibold rounded-xl md:hidden",
                "bg-[#5b6949] text-white shadow-md shadow-[#5b6949]/20",
                "hover:bg-[#4a573a] hover:shadow-lg hover:shadow-[#5b6949]/25",
                "active:scale-[0.98] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tr('searching')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {tr('searchJobs')}
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Loading State — Multi-Stage Progress */}
        {loading && pageNum === 0 && (
          <div className="relative rounded-2xl bg-white border border-zinc-200/80 shadow-sm overflow-hidden">
            {/* Top progress bar */}
            <div className="h-1 bg-zinc-100">
              <div
                className="h-full bg-gradient-to-r from-[#5b6949] to-[#8fa676] transition-all duration-1000 ease-out"
                style={{
                  width: searchStage === "connecting" ? "10%" :
                         searchStage === "scanning" ? "35%" :
                         searchStage === "retrieving" ? "65%" :
                         searchStage === "processing" ? "85%" : "100%"
                }}
              />
            </div>

            <div className="px-8 py-10">
              {/* Elapsed time */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#5b6949] animate-pulse" />
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{tr('searchingLinkedIn')}</span>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {Math.floor(searchElapsed / 60)}:{(searchElapsed % 60).toString().padStart(2, "0")}
                </span>
              </div>

              {/* Stage indicators */}
              <div className="space-y-4">
                {SEARCH_STAGES.map((stage, idx) => {
                  const stageIdx = SEARCH_STAGES.findIndex((s) => s.id === searchStage);
                  const isActive = stage.id === searchStage;
                  const isComplete = idx < stageIdx || searchStage === "done";
                  const isPending = idx > stageIdx && searchStage !== "done";
                  const StageIcon = stage.icon;

                  return (
                    <div
                      key={stage.id}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500",
                        isActive && "bg-[#5b6949]/5 border border-[#5b6949]/15",
                        isComplete && "opacity-60",
                        isPending && "opacity-30"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500",
                        isActive && "bg-[#5b6949] shadow-md shadow-[#5b6949]/20",
                        isComplete && "bg-[#5b6949]/20",
                        isPending && "bg-zinc-100"
                      )}>
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-[#5b6949]" />
                        ) : isActive ? (
                          <StageIcon className="w-4 h-4 text-white animate-pulse" />
                        ) : (
                          <StageIcon className="w-4 h-4 text-zinc-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-semibold transition-colors duration-300",
                          isActive ? "text-zinc-800" : isComplete ? "text-zinc-500" : "text-zinc-300"
                        )}>
                          {tr(stage.labelKey)}
                        </p>
                        {isActive && (
                          <div className="mt-1.5 flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-[#5b6949] animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-1 h-1 rounded-full bg-[#5b6949] animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-1 h-1 rounded-full bg-[#5b6949] animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        )}
                      </div>
                      {isComplete && (
                        <span className="text-[10px] font-bold text-[#5b6949] uppercase tracking-wider">{tr('done')}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tip message */}
              <div className="mt-8 flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <Sparkles className="w-3.5 h-3.5 text-[#5b6949] flex-shrink-0" />
                <p className="text-xs text-zinc-400">
                  {searchElapsed < 15 ? tr('loadingTip1') :
                   searchElapsed < 45 ? tr('loadingTip2') :
                   searchElapsed < 90 ? tr('loadingTip3') :
                   tr('loadingTip4')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && searched && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-zinc-300" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-zinc-700 font-semibold">{tr('noJobsFound')}</p>
              <p className="text-zinc-400 text-sm">
                {tr('tryAdjusting')}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {jobs.length > 0 && (
          <div className="space-y-5">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-[#5b6949]" />
                <h2 className="text-lg font-bold text-zinc-900">
                  {jobs.length} {jobs.length !== 1 ? tr('results') : tr('result')}
                </h2>
                {cachedResultsShown && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#5b6949] bg-[#5b6949]/10 rounded-full">
                    <Clock className="w-3 h-3" />
                    {tr('cached')}
                  </span>
                )}
              </div>
              {cachedResultsShown && (
                <button
                  onClick={() => {
                    setCachedResultsShown(false);
                    localStorage.removeItem(CACHE_KEY);
                    setLoading(true);
                    setSearched(true);
                    const params = getSearchParams();
                    const paramsKey = getCacheKey({ ...params, pageNum: 0 });
                    const progressTimers = startProgressStages();
                    fetch("/api/apify/jobs", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...params, pageNum: 0, count: 100 }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success) {
                          const jobList = data.data ?? [];
                          setJobs(jobList);
                          setPageNum(0);
                          setHasMore(data.pagination?.hasMore ?? false);
                          saveToCache(paramsKey, jobList, data.pagination?.hasMore ?? false, 0);
                        }
                      })
                      .finally(() => {
                        stopProgressStages(progressTimers);
                        setLoading(false);
                      });
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#5b6949] transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  {tr('refresh')}
                </button>
              )}
            </div>

            {/* Job Cards */}
            <div className="grid gap-3">
              {jobs.map((job, idx) => {
                const isExpanded = expandedJobs.has(job.id);
                const isSaved = savedJobs.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="group relative bg-white border border-zinc-200/80 rounded-xl hover:border-[#5b6949]/30 hover:shadow-lg hover:shadow-[#5b6949]/[0.04] transition-all duration-300"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    {/* Left accent bar */}
                    <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-transparent group-hover:bg-[#5b6949] transition-all duration-300" />

                    <div className="p-5 sm:p-6">
                      {/* Save Button */}
                      <button
                        onClick={() => saveJob(job)}
                        className={cn(
                          "absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-xl transition-all duration-200 z-10",
                          isSaved
                            ? "bg-red-50 text-red-500 shadow-sm"
                            : "bg-zinc-50 text-zinc-300 hover:bg-[#5b6949]/10 hover:text-[#5b6949] hover:shadow-sm"
                        )}
                        title={isSaved ? "Job saved" : "Save job"}
                      >
                        {isSaved ? (
                          <Heart className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      {/* Job Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {job.companyLogo ? (
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl border border-zinc-100 bg-white overflow-hidden flex items-center justify-center shadow-sm">
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#5b6949]/10 to-[#5b6949]/5 border border-[#5b6949]/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#5b6949]/60" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 pr-12">
                          <h3 className="text-[15px] font-bold text-zinc-900 group-hover:text-[#5b6949] transition-colors duration-200 mb-1 leading-snug">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2 flex-wrap">
                            <span className="font-semibold text-zinc-700">
                              {job.companyName}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-300" />
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            {job.salary && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                <span className="flex items-center gap-1 text-[#5b6949] font-semibold">
                                  <DollarSign className="w-3 h-3" />
                                  {job.salary}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Tags Row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-100 text-zinc-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(job.postedAt)}
                            </span>
                            {job.applicantsCount && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md bg-[#5b6949]/10 text-[#5b6949]">
                                <Users className="w-3 h-3" />
                                {job.applicantsCount}
                              </span>
                            )}
                            {job.employmentType && (
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-100 text-zinc-500">
                                {job.employmentType}
                              </span>
                            )}
                            {job.seniorityLevel && (
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-zinc-100 text-zinc-500">
                                {job.seniorityLevel}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-5 pt-5 border-t border-zinc-100 space-y-5 animate-in slide-in-from-top-2 duration-200">
                          {/* Description */}
                          {job.descriptionHtml && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                                {tr('description')}
                              </h4>
                              <div
                                className="text-sm text-zinc-600 prose prose-sm prose-zinc max-w-none prose-headings:text-zinc-800 prose-a:text-[#5b6949]"
                                dangerouslySetInnerHTML={{
                                  __html: job.descriptionHtml,
                                }}
                              />
                            </div>
                          )}

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(job.companyDescription ||
                              job.companySlogan ||
                              job.companyWebsite) && (
                              <div className="space-y-3 p-5 bg-zinc-50/80 rounded-xl border border-zinc-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                  {tr('aboutCompany').replace('{company}', job.companyName)}
                                </h4>
                                {job.companySlogan && (
                                  <p className="text-sm text-zinc-500 italic leading-relaxed">
                                    &ldquo;{job.companySlogan}&rdquo;
                                  </p>
                                )}
                                {job.companyDescription && (
                                  <p className="text-sm text-zinc-600 leading-relaxed">
                                    {job.companyDescription}
                                  </p>
                                )}
                                {job.companyWebsite && (
                                  <a
                                    href={job.companyWebsite}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-[#5b6949] font-semibold hover:underline"
                                  >
                                    <Globe className="w-3.5 h-3.5" />
                                    {tr('visitWebsite')}
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}

                            <div className="space-y-3 p-5 bg-zinc-50/80 rounded-xl border border-zinc-100">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                {tr('details')}
                              </h4>
                              {job.jobFunction && (
                                <div className="text-sm">
                                  <span className="text-zinc-400 font-medium">{tr('function')} </span>
                                  <span className="text-zinc-700 font-semibold">{job.jobFunction}</span>
                                </div>
                              )}
                              {job.industries && (
                                <div className="text-sm">
                                  <span className="text-zinc-400 font-medium">{tr('industries')} </span>
                                  <span className="text-zinc-700 font-semibold">{job.industries}</span>
                                </div>
                              )}
                              {job.benefits && job.benefits.length > 0 && (
                                <div>
                                  <span className="text-sm text-zinc-400 font-medium">{tr('benefits')}</span>
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {job.benefits.map((benefit, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[11px] px-2.5 py-1 bg-[#5b6949]/10 text-[#5b6949] rounded-lg font-semibold"
                                      >
                                        {benefit}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Link
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5b6949] text-white rounded-xl hover:bg-[#4a573a] shadow-sm shadow-[#5b6949]/20 hover:shadow-md transition-all text-sm font-semibold"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              {tr('viewOnLinkedIn')}
                            </Link>
                            {job.applyUrl && (
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#5b6949] text-[#5b6949] rounded-xl hover:bg-[#5b6949] hover:text-white transition-all text-sm font-semibold"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                {tr('applyNow')}
                              </a>
                            )}
                            {job.companyLinkedinUrl && (
                              <a
                                href={job.companyLinkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 text-zinc-600 rounded-xl hover:bg-zinc-200 transition-all text-sm font-medium"
                              >
                                <Building2 className="w-3.5 h-3.5" />
                                {tr('company')}
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleJobExpanded(job.id)}
                        className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-zinc-400 hover:text-[#5b6949] transition-colors rounded-lg hover:bg-[#5b6949]/5"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            {tr('less')}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            {tr('details')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={cn(
                    "px-8 h-11 font-semibold rounded-xl",
                    "bg-white text-[#5b6949] border-2 border-[#5b6949]/20",
                    "hover:border-[#5b6949] hover:bg-[#5b6949] hover:text-white",
                    "shadow-sm hover:shadow-md transition-all duration-200"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {tr('loadMore')}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            )}

            {loading && pageNum > 0 && (
              <div className="flex justify-center py-6">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white border border-zinc-200 shadow-sm">
                  <div className="w-4 h-4 border-2 border-zinc-200 border-t-[#5b6949] rounded-full animate-spin" />
                  <span className="text-zinc-500 text-sm font-medium">{tr('loadingMore')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial empty state before search */}
        {!searched && !loading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5b6949]/15 to-[#5b6949]/5 flex items-center justify-center border border-[#5b6949]/10">
                <Search className="w-8 h-8 text-[#5b6949]/40" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#5b6949]/10 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-[#5b6949]" />
              </div>
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <p className="text-zinc-700 font-semibold text-lg">
                {tr('startYourSearch')}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {tr('startYourSearchDescription')}
              </p>
            </div>
          </div>
        )}
      </div>

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Job Search"
        limitMessage="You've used all your free job search credits. Upgrade to continue searching."
      />
    </div>
  );
}
