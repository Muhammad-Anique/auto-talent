"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { createClient } from "@/utils/supabase/client";
import {
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  FileText,
  Coins,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AutoApplyErrorHandler,
  handleAutoApplyError,
  AutoApplyErrorCode,
} from "@/lib/auto-apply-errors";
import { AutoApplyNotificationManager } from "@/lib/auto-apply-notifications";

export default function AutoApplyDashboard() {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const { toast } = useToast();
  const [submittedForms, setSubmittedForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [credits, setCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [loadingAutoApply, setLoadingAutoApply] = useState(true);
  const [userResumes, setUserResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initSupabase();
  }, []);

  // Load user credits and Auto-Apply status
  const loadUserData = async () => {
    if (!supabaseClient) return;
    setLoadingCredits(true);
    setLoadingAutoApply(true);
    setError(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.AUTHENTICATION_ERROR,
          "You must be logged in to view this page",
        );
        AutoApplyErrorHandler.logError(error);
        setError(AutoApplyErrorHandler.getErrorMessage(error));
        return;
      }

      // Check if user has a user record
      const { data: userData, error: userError } = await supabaseClient
        .from("users")
        .select('credits, "Auto-Apply"')
        .eq("id", user.id)
        .single();

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 is "not found"
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to load user data",
        );
        AutoApplyErrorHandler.logError(error, { userError });
        setError(AutoApplyErrorHandler.getErrorMessage(error));
        return;
      }

      setCredits(userData?.credits || 0);
      setAutoApplyEnabled(userData?.["Auto-Apply"] || false);
    } catch (error) {
      const autoApplyError = handleAutoApplyError(error);
      AutoApplyErrorHandler.logError(autoApplyError);
      setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
    } finally {
      setLoadingCredits(false);
      setLoadingAutoApply(false);
    }
  };

  // Activate Auto-Apply (consumes 10 credits)
  const activateAutoApply = async () => {
    if (!supabaseClient) return;

    if (credits < 10) {
      const notification =
        AutoApplyNotificationManager.createCreditsNotification(credits, 10);
      AutoApplyNotificationManager.showNotification(notification, toast);
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.AUTHENTICATION_ERROR,
          "You must be logged in to activate Auto-Apply",
        );
        AutoApplyErrorHandler.logError(error);
        const notification =
          AutoApplyNotificationManager.createErrorNotification(error);
        AutoApplyNotificationManager.showNotification(notification, toast);
        return;
      }

      // First, try to get existing user record
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to fetch user data",
        );
        AutoApplyErrorHandler.logError(error, { fetchError });
        const notification =
          AutoApplyNotificationManager.createErrorNotification(error);
        AutoApplyNotificationManager.showNotification(notification, toast);
        return;
      }

      // Update user record: consume 10 credits and set Auto-Apply to true
      const { error: updateError } = await supabaseClient.from("users").upsert(
        {
          id: user.id,
          email: user.email,
          username: existingUser?.username || null,
          plan_sub: existingUser?.plan_sub || null,
          "Auto-Apply": true,
          last_auto_applied: existingUser?.last_auto_applied || null,
          credits: (existingUser?.credits || 0) - 10,
          created_at: existingUser?.created_at || new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      );

      if (updateError) {
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to activate Auto-Apply",
        );
        AutoApplyErrorHandler.logError(error, { updateError });
        const notification =
          AutoApplyNotificationManager.createErrorNotification(error);
        AutoApplyNotificationManager.showNotification(notification, toast);
        return;
      }

      setCredits((prev) => prev - 10);
      setAutoApplyEnabled(true);
      const notification =
        AutoApplyNotificationManager.createAutoApplyStatusNotification(true);
      AutoApplyNotificationManager.showNotification(notification, toast);
    } catch (error) {
      const autoApplyError = handleAutoApplyError(error);
      AutoApplyErrorHandler.logError(autoApplyError);
      const notification =
        AutoApplyNotificationManager.createErrorNotification(autoApplyError);
      AutoApplyNotificationManager.showNotification(notification, toast);
    }
  };

  // Load submitted forms
  const loadSubmittedForms = async () => {
    if (!supabaseClient) return;
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.AUTHENTICATION_ERROR,
          "You must be logged in to view configurations",
        );
        AutoApplyErrorHandler.logError(error);
        setError(AutoApplyErrorHandler.getErrorMessage(error));
        return;
      }

      const { data: forms, error } = await supabaseClient
        .from("auto_apply_configs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        const autoApplyError = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to load configurations",
        );
        AutoApplyErrorHandler.logError(autoApplyError, { error });
        setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
        return;
      }

      setSubmittedForms(forms || []);
    } catch (error) {
      const autoApplyError = handleAutoApplyError(error);
      AutoApplyErrorHandler.logError(autoApplyError);
      setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
    } finally {
      setLoading(false);
    }
  };

  // Load applied jobs
  const loadAppliedJobs = async () => {
    if (!supabaseClient) return;
    setLoadingJobs(true);
    setError(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        const error = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.AUTHENTICATION_ERROR,
          "You must be logged in to view applied jobs",
        );
        AutoApplyErrorHandler.logError(error);
        setError(AutoApplyErrorHandler.getErrorMessage(error));
        return;
      }

      const { data: jobs, error } = await supabaseClient
        .from("applied_jobs")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false });

      if (error) {
        const autoApplyError = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to load applied jobs",
        );
        AutoApplyErrorHandler.logError(autoApplyError, { error });
        setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
        return;
      }

      setAppliedJobs(jobs || []);
    } catch (error) {
      const autoApplyError = handleAutoApplyError(error);
      AutoApplyErrorHandler.logError(autoApplyError);
      setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
    } finally {
      setLoadingJobs(false);
    }
  };

  // Load user resumes
  const loadUserResumes = async () => {
    if (!supabaseClient) return;
    setLoadingResumes(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error("Auth error:", authError);
        return;
      }

      const { data: resumes, error: resumeError } = await supabaseClient
        .from("resumes")
        .select("*")
        .eq("user_id", user.id);

      if (resumeError) {
        console.error("Resume fetch error:", resumeError);
        return;
      }

      setUserResumes(resumes || []);
    } catch (error) {
      console.error("Error loading resumes:", error);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (supabaseClient) {
      loadSubmittedForms();
      loadAppliedJobs();
      loadUserData();
      loadUserResumes();
    }
  }, [supabaseClient]);

  const handleEditForm = (formId: string) => {
    router.push(`/dashboard/auto-apply/form?edit=${formId}`);
  };

  const handleDeleteForm = async (formId: string) => {
    if (!supabaseClient) return;
    if (confirm("Are you sure you want to delete this configuration?")) {
      try {
        const { error } = await supabaseClient
          .from("auto_apply_configs")
          .delete()
          .eq("form_id", formId);

        if (error) {
          const autoApplyError = AutoApplyErrorHandler.createError(
            AutoApplyErrorCode.DATABASE_ERROR,
            "Failed to delete configuration",
          );
          AutoApplyErrorHandler.logError(autoApplyError, { error });
          const notification =
            AutoApplyNotificationManager.createErrorNotification(
              autoApplyError,
            );
          AutoApplyNotificationManager.showNotification(notification, toast);
          return;
        }

        // Reload forms
        loadSubmittedForms();
        const notification =
          AutoApplyNotificationManager.createSuccessNotification(
            "Configuration Deleted",
            "Your auto-apply configuration has been deleted successfully.",
          );
        AutoApplyNotificationManager.showNotification(notification, toast);
      } catch (error) {
        const autoApplyError = handleAutoApplyError(error);
        AutoApplyErrorHandler.logError(autoApplyError);
        const notification =
          AutoApplyNotificationManager.createErrorNotification(autoApplyError);
        AutoApplyNotificationManager.showNotification(notification, toast);
      }
    }
  };

  // Check if user can create new form (only one allowed)
  const canCreateNewForm = submittedForms.length === 0;

  // Calculate real data from applied jobs
  const jobsProgress = appliedJobs.filter(
    (job) => job.status === "applied",
  ).length;
  const jobsTotal = appliedJobs.length;
  const lastUpdate =
    appliedJobs.length > 0
      ? new Date(
          Math.max(
            ...appliedJobs.map((job) => new Date(job.applied_at).getTime()),
          ),
        ).toLocaleString()
      : "No applications yet";
  const status = autoApplyEnabled ? "Active" : "Inactive";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-red-600">⚠️</div>
              <span className="font-semibold text-red-800">Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl mt-2">{status}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Jobs Progress</CardDescription>
              <CardTitle className="text-2xl mt-2">
                {jobsProgress}/{jobsTotal}
              </CardTitle>
              <div className="text-xs text-gray-700 mt-1">
                {jobsTotal > 0
                  ? `${Math.round((jobsProgress / jobsTotal) * 100)}% Completed`
                  : "No applications yet"}
              </div>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Available Credits</CardDescription>
              <CardTitle className="text-2xl mt-2 flex items-center justify-center gap-2">
                <Coins className="w-5 h-5" />
                {loadingCredits ? "..." : credits}
              </CardTitle>
              <div className="text-xs text-gray-700 mt-1">
                {credits >= 10 ? "Ready to apply" : "Need 10 credits to apply"}
              </div>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Auto-Apply Status</CardDescription>
              <CardTitle className="text-2xl mt-2 flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                {loadingAutoApply
                  ? "..."
                  : autoApplyEnabled
                    ? "Active"
                    : "Inactive"}
              </CardTitle>
              <div className="text-xs text-gray-700 mt-1">
                {autoApplyEnabled ? "Auto-applying enabled" : "Manual mode"}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Auto-Apply Control */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800 font-medium">
              Auto-Apply Control
            </CardTitle>
            <CardDescription>
              Manage your automated job application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={activateAutoApply}
              variant="default"
              className="w-full"
              disabled={credits < 10 || autoApplyEnabled || loadingAutoApply}
            >
              <Settings className="w-4 h-4 mr-2" />
              {autoApplyEnabled
                ? "Auto-Apply Already Active"
                : "Activate Auto-Apply (10 credits)"}
            </Button>
            {credits < 10 && !autoApplyEnabled && (
              <p className="text-xs text-red-600 text-center">
                Need at least 10 credits to activate Auto-Apply
              </p>
            )}
            {autoApplyEnabled && (
              <p className="text-xs text-green-600 text-center">
                ✓ Auto-Apply is already active
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submitted Forms */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-800 font-medium">
                Submitted Configurations
              </CardTitle>
              <Button
                onClick={() => router.push("/dashboard/auto-apply/form")}
                size="sm"
                disabled={!canCreateNewForm}
              >
                + New Configuration
              </Button>
            </div>
            {!canCreateNewForm && (
              <CardDescription className="text-red-600">
                You can only have one configuration at a time. Please delete the
                existing one to create a new one.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-700 mt-2">
                  Loading configurations...
                </p>
              </div>
            ) : submittedForms.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-semibold text-lg mb-2">
                  No Configurations Yet
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Create your first auto-apply configuration to get started!
                </p>
                <Button
                  onClick={() => router.push("/dashboard/auto-apply/form")}
                >
                  Create Configuration
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {submittedForms.map((form) => (
                  <div
                    key={form.form_id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {form.first_name && form.last_name
                              ? `${form.first_name} ${form.last_name}`
                              : "Unnamed Configuration"}
                          </h3>
                          <p className="text-sm text-gray-700">{form.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditForm(form.form_id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteForm(form.form_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-700" />
                        <span>
                          Created:{" "}
                          {new Date(form.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-700">Location: </span>
                        <span>{form.search_location || "Not specified"}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Job Terms: </span>
                        <span>{form.search_terms || "Not specified"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applied Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-800 font-medium">
              Applied Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loadingJobs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-700 mt-2">
                    Loading applied jobs...
                  </p>
                </div>
              ) : appliedJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No jobs have been applied to yet.
                </div>
              ) : (
                <table className="min-w-full text-sm border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-gray-700">
                      <th className="px-2 py-1 text-left">Job Title</th>
                      <th className="px-2 py-1 text-left">Company</th>
                      <th className="px-2 py-1 text-left">Status</th>
                      <th className="px-2 py-1 text-left">Applied At</th>
                      <th className="px-2 py-1 text-left">Job URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliedJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-2 py-1 font-medium">
                          {job.job_title}
                        </td>
                        <td className="px-2 py-1">{job.company_name}</td>
                        <td className="px-2 py-1">
                          <span
                            className={
                              job.status === "applied"
                                ? "text-green-600"
                                : job.status === "error"
                                  ? "text-green-600"
                                  : job.status === "skipped"
                                    ? "text-yellow-600"
                                    : "text-gray-600"
                            }
                          >
                            Applied
                            {/* {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)} */}
                          </span>
                        </td>
                        <td className="px-2 py-1">
                          {new Date(job.applied_at).toLocaleString()}
                        </td>
                        <td className="px-2 py-1">
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
