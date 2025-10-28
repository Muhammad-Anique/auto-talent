// Auto-Apply State Management Hook

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AutoApplyConfig,
  AppliedJob,
  AutoApplyStatus,
} from "@/lib/auto-apply-types";
import { cacheManager } from "@/lib/auto-apply-cache";
import { createClient } from "@/utils/supabase/client";
import {
  AutoApplyErrorHandler,
  AutoApplyErrorCode,
} from "@/lib/auto-apply-errors";
import { AutoApplyNotificationManager } from "@/lib/auto-apply-notifications";
import { useToast } from "./use-toast";

// Hook for managing auto-apply configuration
export function useAutoApplyConfig(userId: string) {
  const [config, setConfig] = useState<AutoApplyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const { toast } = useToast();

  // Initialize Supabase client
  useEffect(() => {
    const initClient = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initClient();
  }, []);

  // Load configuration
  const loadConfig = useCallback(async () => {
    if (!supabaseClient) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedConfig = cacheManager.getConfigCache().getUserConfig(userId);
      if (cachedConfig) {
        setConfig(cachedConfig);
        setLoading(false);
        return;
      }

      // Fetch from database
      const { data, error } = await supabaseClient
        .from("auto_apply_configs")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw new Error("Failed to load configuration");
      }

      if (data) {
        setConfig(data);
        cacheManager.getConfigCache().setUserConfig(userId, data);
      } else {
        setConfig(null);
      }
    } catch (err) {
      const autoApplyError = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.DATABASE_ERROR,
        "Failed to load configuration"
      );
      AutoApplyErrorHandler.logError(autoApplyError);
      setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, userId]);

  // Update configuration
  const updateConfig = useCallback(
    async (updates: Partial<AutoApplyConfig>) => {
      if (!supabaseClient || !config) return;

      try {
        const { data, error } = await supabaseClient
          .from("auto_apply_configs")
          .update(updates)
          .eq("form_id", config.form_id)
          .select()
          .single();

        if (error) {
          throw new Error("Failed to update configuration");
        }

        const updatedConfig = { ...config, ...data };
        setConfig(updatedConfig);
        cacheManager.getConfigCache().setUserConfig(userId, updatedConfig);

        const notification =
          AutoApplyNotificationManager.createSuccessNotification(
            "Configuration Updated",
            "Your auto-apply configuration has been updated successfully."
          );
        AutoApplyNotificationManager.showNotification(notification, toast);
      } catch (err) {
        const autoApplyError = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to update configuration"
        );
        AutoApplyErrorHandler.logError(autoApplyError);
        const notification =
          AutoApplyNotificationManager.createErrorNotification(autoApplyError);
        AutoApplyNotificationManager.showNotification(notification, toast);
      }
    },
    [supabaseClient, config, userId, toast]
  );

  // Delete configuration
  const deleteConfig = useCallback(async () => {
    if (!supabaseClient || !config) return;

    try {
      const { error } = await supabaseClient
        .from("auto_apply_configs")
        .delete()
        .eq("form_id", config.form_id);

      if (error) {
        throw new Error("Failed to delete configuration");
      }

      setConfig(null);
      cacheManager.getConfigCache().invalidateUserConfig(userId);

      const notification =
        AutoApplyNotificationManager.createSuccessNotification(
          "Configuration Deleted",
          "Your auto-apply configuration has been deleted successfully."
        );
      AutoApplyNotificationManager.showNotification(notification, toast);
    } catch (err) {
      const autoApplyError = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.DATABASE_ERROR,
        "Failed to delete configuration"
      );
      AutoApplyErrorHandler.logError(autoApplyError);
      const notification =
        AutoApplyNotificationManager.createErrorNotification(autoApplyError);
      AutoApplyNotificationManager.showNotification(notification, toast);
    }
  }, [supabaseClient, config, userId, toast]);

  // Load configuration on mount
  useEffect(() => {
    if (supabaseClient) {
      loadConfig();
    }
  }, [supabaseClient, loadConfig]);

  return {
    config,
    loading,
    error,
    updateConfig,
    deleteConfig,
    refetch: loadConfig,
  };
}

// Hook for managing applied jobs
export function useAppliedJobs(userId: string) {
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const { toast } = useToast();

  // Initialize Supabase client
  useEffect(() => {
    const initClient = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initClient();
  }, []);

  // Load applied jobs
  const loadJobs = useCallback(async () => {
    if (!supabaseClient) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedJobs = cacheManager.getJobsCache().getUserJobs(userId);
      if (cachedJobs) {
        setJobs(cachedJobs);
        setLoading(false);
        return;
      }

      // Fetch from database
      const { data, error } = await supabaseClient
        .from("applied_jobs")
        .select("*")
        .eq("user_id", userId)
        .order("applied_at", { ascending: false });

      if (error) {
        throw new Error("Failed to load applied jobs");
      }

      setJobs(data || []);
      cacheManager.getJobsCache().setUserJobs(userId, data || []);
    } catch (err) {
      const autoApplyError = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.DATABASE_ERROR,
        "Failed to load applied jobs"
      );
      AutoApplyErrorHandler.logError(autoApplyError);
      setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, userId]);

  // Retry failed job application
  const retryJob = useCallback(
    async (jobId: string) => {
      if (!supabaseClient) return;

      try {
        // Update job status to pending
        const { error } = await supabaseClient
          .from("applied_jobs")
          .update({ status: "pending" })
          .eq("id", jobId);

        if (error) {
          throw new Error("Failed to retry job application");
        }

        // Refresh jobs list
        await loadJobs();

        const notification =
          AutoApplyNotificationManager.createSuccessNotification(
            "Job Retry Initiated",
            "The job application has been queued for retry."
          );
        AutoApplyNotificationManager.showNotification(notification, toast);
      } catch (err) {
        const autoApplyError = AutoApplyErrorHandler.createError(
          AutoApplyErrorCode.DATABASE_ERROR,
          "Failed to retry job application"
        );
        AutoApplyErrorHandler.logError(autoApplyError);
        const notification =
          AutoApplyNotificationManager.createErrorNotification(autoApplyError);
        AutoApplyNotificationManager.showNotification(notification, toast);
      }
    },
    [supabaseClient, loadJobs, toast]
  );

  // Load jobs on mount
  useEffect(() => {
    if (supabaseClient) {
      loadJobs();
    }
  }, [supabaseClient, loadJobs]);

  return {
    jobs,
    loading,
    error,
    retryJob,
    refetch: loadJobs,
  };
}

// Hook for managing auto-apply status
export function useAutoApplyStatus(userId: string) {
  const [status, setStatus] = useState<AutoApplyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const { toast } = useToast();

  // Initialize Supabase client
  useEffect(() => {
    const initClient = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initClient();
  }, []);

  // Load status
  const loadStatus = useCallback(async () => {
    if (!supabaseClient) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedStatus = cacheManager.getStatusCache().getUserStatus(userId);
      if (cachedStatus) {
        setStatus(cachedStatus);
        setLoading(false);
        return;
      }

      // Fetch from database
      const { data, error } = await supabaseClient
        .from("users")
        .select('credits, "Auto-Apply", last_auto_applied')
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error("Failed to load status");
      }

      // Get additional stats
      const { data: configs } = await supabaseClient
        .from("auto_apply_configs")
        .select("id")
        .eq("user_id", userId);

      const { data: jobs } = await supabaseClient
        .from("applied_jobs")
        .select("status")
        .eq("user_id", userId);

      const statusData: AutoApplyStatus = {
        isActive: data?.["Auto-Apply"] || false,
        lastRun: data?.last_auto_applied,
        totalApplications: jobs?.length || 0,
        successfulApplications:
          jobs?.filter((j: any) => j.status === "applied").length || 0,
        failedApplications:
          jobs?.filter((j: any) => j.status === "error").length || 0,
        creditsRemaining: data?.credits || 0,
      };

      setStatus(statusData);
      cacheManager.getStatusCache().setUserStatus(userId, statusData);
    } catch (err) {
      const autoApplyError = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.DATABASE_ERROR,
        "Failed to load status"
      );
      AutoApplyErrorHandler.logError(autoApplyError);
      setError(AutoApplyErrorHandler.getErrorMessage(autoApplyError));
    } finally {
      setLoading(false);
    }
  }, [supabaseClient, userId]);

  // Activate auto-apply
  const activate = useCallback(async () => {
    if (!supabaseClient || !status) return;

    if (status.creditsRemaining < 10) {
      const notification =
        AutoApplyNotificationManager.createCreditsNotification(
          status.creditsRemaining,
          10
        );
      AutoApplyNotificationManager.showNotification(notification, toast);
      return;
    }

    try {
      const { error } = await supabaseClient
        .from("users")
        .update({
          "Auto-Apply": true,
          credits: status.creditsRemaining - 10,
        })
        .eq("id", userId);

      if (error) {
        throw new Error("Failed to activate auto-apply");
      }

      // Update local status
      const updatedStatus = {
        ...status,
        isActive: true,
        creditsRemaining: status.creditsRemaining - 10,
      };
      setStatus(updatedStatus);
      cacheManager.getStatusCache().setUserStatus(userId, updatedStatus);

      const notification =
        AutoApplyNotificationManager.createAutoApplyStatusNotification(true);
      AutoApplyNotificationManager.showNotification(notification, toast);
    } catch (err) {
      const autoApplyError = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.DATABASE_ERROR,
        "Failed to activate auto-apply"
      );
      AutoApplyErrorHandler.logError(autoApplyError);
      const notification =
        AutoApplyNotificationManager.createErrorNotification(autoApplyError);
      AutoApplyNotificationManager.showNotification(notification, toast);
    }
  }, [supabaseClient, status, userId, toast]);

  // Deactivate auto-apply
  const deactivate = useCallback(async () => {
    if (!supabaseClient) return;

    try {
      const { error } = await supabaseClient
        .from("users")
        .update({ "Auto-Apply": false })
        .eq("id", userId);

      if (error) {
        throw new Error("Failed to deactivate auto-apply");
      }

      // Update local status
      if (status) {
        const updatedStatus = { ...status, isActive: false };
        setStatus(updatedStatus);
        cacheManager.getStatusCache().setUserStatus(userId, updatedStatus);
      }

      const notification =
        AutoApplyNotificationManager.createAutoApplyStatusNotification(false);
      AutoApplyNotificationManager.showNotification(notification, toast);
    } catch (err) {
      const autoApplyError = AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.DATABASE_ERROR,
        "Failed to deactivate auto-apply"
      );
      AutoApplyErrorHandler.logError(autoApplyError);
      const notification =
        AutoApplyNotificationManager.createErrorNotification(autoApplyError);
      AutoApplyNotificationManager.showNotification(notification, toast);
    }
  }, [supabaseClient, status, userId, toast]);

  // Load status on mount
  useEffect(() => {
    if (supabaseClient) {
      loadStatus();
    }
  }, [supabaseClient, loadStatus]);

  return {
    status,
    loading,
    error,
    activate,
    deactivate,
    refetch: loadStatus,
  };
}

// Combined hook for all auto-apply state
export function useAutoApplyState(userId: string) {
  const config = useAutoApplyConfig(userId);
  const jobs = useAppliedJobs(userId);
  const status = useAutoApplyStatus(userId);

  // Invalidate all caches when any data changes
  const invalidateAll = useCallback(() => {
    cacheManager.invalidateUser(userId);
  }, [userId]);

  return {
    config,
    jobs,
    status,
    invalidateAll,
  };
}
