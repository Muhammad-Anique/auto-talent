// Auto-Apply Types and Interfaces
// Comprehensive TypeScript definitions for the auto-apply feature

export interface AutoApplyConfig {
  form_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  current_job_title?: string;
  current_company?: string;
  current_salary?: string;
  desired_salary: string;
  notice_period?: string;
  work_auth: string;
  field_of_study?: string;
  graduation_year?: string;
  linkedin_url: string;
  website?: string;
  github_url?: string;
  selected_resume_id?: string;
  uploaded_resume_path?: string;
  legally_authorized: string;
  require_sponsorship: string;
  current_location?: string;
  years_experience?: string;
  expected_salary?: string;
  start_date?: string;
  interest_reason?: string;
  key_skills?: string;
  disabilities?: string;
  gender?: string;
  race?: string;
  veteran?: string;
  search_terms: string;
  randomize_search: boolean;
  search_location: string;
  experience_level?: string;
  salary_range?: string;
  target_experience?: string;
  preferred_job_types: string[];
  industries?: string;
  blacklisted_companies?: string;
  whitelisted_companies?: string;
  skip_keywords?: string;
  prioritize_keywords?: string;
  skip_security_clearance: boolean;
  follow_companies: boolean;
  resume_ready: boolean;
  use_web_ui: boolean;
  skills: SkillGroup[];
  work_experience: WorkExperience[];
  education: Education[];
  projects?: string;
  certifications?: string;
  created_at: string;
  updated_at: string;
}

export interface AppliedJob {
  id: string;
  user_id: string;
  job_title: string;
  company_name: string;
  job_url: string;
  status: "applied" | "error" | "skipped" | "pending";
  applied_at: string;
  error_message?: string;
  application_data?: Record<string, any>;
}

export interface SkillGroup {
  items: string[];
  category: string;
}

export interface WorkExperience {
  date: string;
  company: string;
  location: string;
  position: string;
  description: string[];
  technologies: string[];
}

export interface Education {
  gpa: number;
  date: string;
  field: string;
  degree: string;
  school: string;
  location: string;
  achievements: string[];
}

export interface AutoApplyError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface AutoApplyStatus {
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  totalApplications: number;
  successfulApplications: number;
  failedApplications: number;
  creditsRemaining: number;
}

export interface JobSearchCriteria {
  searchTerms: string;
  location: string;
  experienceLevel?: string;
  salaryRange?: string;
  jobTypes: string[];
  industries?: string[];
  blacklistedCompanies?: string[];
  whitelistedCompanies?: string[];
  skipKeywords?: string[];
  prioritizeKeywords?: string[];
  skipSecurityClearance: boolean;
}

export interface ApplicationResult {
  success: boolean;
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  errorMessage?: string;
  appliedAt: string;
}

// Database Table Types
export interface AutoApplyConfigDB {
  id: string;
  user_id: string;
  form_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  current_job_title?: string;
  current_company?: string;
  current_salary?: string;
  desired_salary: string;
  notice_period?: string;
  work_auth: string;
  field_of_study?: string;
  graduation_year?: string;
  linkedin_url: string;
  website?: string;
  github_url?: string;
  selected_resume_id?: string;
  uploaded_resume_path?: string;
  legally_authorized: string;
  require_sponsorship: string;
  current_location?: string;
  years_experience?: string;
  expected_salary?: string;
  start_date?: string;
  interest_reason?: string;
  key_skills?: string;
  disabilities?: string;
  gender?: string;
  race?: string;
  veteran?: string;
  search_terms: string;
  randomize_search: boolean;
  search_location: string;
  experience_level?: string;
  salary_range?: string;
  target_experience?: string;
  preferred_job_types: string[];
  industries?: string;
  blacklisted_companies?: string;
  whitelisted_companies?: string;
  skip_keywords?: string;
  prioritize_keywords?: string;
  skip_security_clearance: boolean;
  follow_companies: boolean;
  resume_ready: boolean;
  use_web_ui: boolean;
  skills: SkillGroup[];
  work_experience: WorkExperience[];
  education: Education[];
  projects?: string;
  certifications?: string;
  created_at: string;
  updated_at: string;
}

export interface AppliedJobDB {
  id: string;
  user_id: string;
  config_id?: string;
  job_title: string;
  company_name: string;
  job_url: string;
  job_description?: string;
  location?: string;
  salary_range?: string;
  employment_type?: string;
  status: "pending" | "applied" | "error" | "skipped";
  error_message?: string;
  application_data?: Record<string, any>;
  applied_at: string;
  created_at: string;
  updated_at: string;
}

export interface JobSearchHistoryDB {
  id: string;
  user_id: string;
  config_id?: string;
  search_terms: string;
  search_location: string;
  filters: Record<string, any>;
  jobs_found: number;
  jobs_applied: number;
  jobs_skipped: number;
  jobs_failed: number;
  searched_at: string;
  completed_at?: string;
}

export interface ActivityLogDB {
  id: string;
  user_id: string;
  config_id?: string;
  activity_type:
    | "config_created"
    | "config_updated"
    | "config_deleted"
    | "auto_apply_started"
    | "auto_apply_stopped"
    | "job_applied"
    | "job_skipped"
    | "job_failed"
    | "search_completed";
  description?: string;
  metadata: Record<string, any>;
  created_at: string;
}

// API Response Types
export interface AutoApplyStatusResponse {
  isActive: boolean;
  credits: number;
  lastAutoApplied?: string;
  totalConfigs: number;
  totalApplications: number;
  successfulApplications: number;
  failedApplications: number;
}

export interface JobSearchResponse {
  jobs: JobListing[];
  totalFound: number;
  searchId: string;
  appliedCount: number;
  skippedCount: number;
  errorCount: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  salaryRange?: string;
  employmentType?: string;
  postedDate?: string;
  requirements?: string[];
  benefits?: string[];
}

// Form State Types
export interface AutoApplyFormState {
  // Personal Information
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  currentJobTitle: string;
  currentCompany: string;
  currentSalary: string;
  desiredSalary: string;
  noticePeriod: string;
  workAuth: string;
  educationLevel: string;
  fieldOfStudy: string;
  graduationYear: string;
  linkedinUrl: string;
  website: string;
  githubUrl: string;

  // Resume Selection
  selectedResumeId: string;
  uploadedResume: File | null;

  // Application Questions
  legallyAuthorized: string;
  requireSponsorship: string;
  currentLocation: string;
  yearsExperience: string;
  expectedSalary: string;
  startDate: string;
  interestReason: string;
  keySkills: string;
  disabilities: string;
  gender: string;
  race: string;
  veteran: string;

  // Search Preferences
  searchTerms: string;
  randomizeSearch: boolean;
  searchLocation: string;
  experienceLevel: string;
  salaryRange: string;
  targetExperience: string;
  preferredJobTypes: string[];
  industries: string;
  blacklistedCompanies: string;
  whitelistedCompanies: string;
  skipKeywords: string;
  prioritizeKeywords: string;
  skipSecurityClearance: boolean;
  followCompanies: boolean;

  // Additional Settings
  resumeReady: boolean;
  useWebUI: boolean;

  // Skills and Experience
  skills: SkillGroup[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: string;
  certifications: string;
}

// Component Props Types
export interface AutoApplyDashboardProps {
  userId: string;
  initialData?: {
    configs: AutoApplyConfig[];
    appliedJobs: AppliedJob[];
    status: AutoApplyStatus;
  };
}

export interface AutoApplyFormProps {
  userId: string;
  existingConfig?: AutoApplyConfig;
  isEdit?: boolean;
}

export interface JobApplicationCardProps {
  job: AppliedJob;
  onRetry?: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

export interface ConfigurationCardProps {
  config: AutoApplyConfig;
  onEdit: (configId: string) => void;
  onDelete: (configId: string) => void;
  onView: (configId: string) => void;
}

// Hook Types
export interface UseAutoApplyConfigReturn {
  config: AutoApplyConfig | null;
  loading: boolean;
  error: string | null;
  updateConfig: (updates: Partial<AutoApplyConfig>) => Promise<void>;
  deleteConfig: () => Promise<void>;
}

export interface UseAppliedJobsReturn {
  jobs: AppliedJob[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  retryJob: (jobId: string) => Promise<void>;
}

export interface UseAutoApplyStatusReturn {
  status: AutoApplyStatus;
  loading: boolean;
  error: string | null;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
}

// Service Types
export interface AutoApplyService {
  getConfig: (userId: string) => Promise<AutoApplyConfig | null>;
  createConfig: (
    config: Omit<AutoApplyConfig, "id" | "created_at" | "updated_at">
  ) => Promise<AutoApplyConfig>;
  updateConfig: (
    configId: string,
    updates: Partial<AutoApplyConfig>
  ) => Promise<AutoApplyConfig>;
  deleteConfig: (configId: string) => Promise<void>;

  getAppliedJobs: (
    userId: string,
    limit?: number,
    offset?: number
  ) => Promise<AppliedJob[]>;
  getJobSearchHistory: (userId: string) => Promise<JobSearchHistoryDB[]>;
  getActivityLog: (userId: string) => Promise<ActivityLogDB[]>;

  activateAutoApply: (userId: string) => Promise<void>;
  deactivateAutoApply: (userId: string) => Promise<void>;
  getStatus: (userId: string) => Promise<AutoApplyStatus>;

  searchJobs: (criteria: JobSearchCriteria) => Promise<JobSearchResponse>;
  applyToJob: (jobId: string, configId: string) => Promise<ApplicationResult>;
}

// Utility Types
export type AutoApplyStep =
  | "welcome"
  | "personal"
  | "resume"
  | "questions"
  | "search"
  | "review";

export type ApplicationStatus = "pending" | "applied" | "error" | "skipped";

export type ActivityType =
  | "config_created"
  | "config_updated"
  | "config_deleted"
  | "auto_apply_started"
  | "auto_apply_stopped"
  | "job_applied"
  | "job_skipped"
  | "job_failed"
  | "search_completed";

export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData?: AutoApplyFormState;
};

export type NotificationConfig = {
  title: string;
  description: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
};
