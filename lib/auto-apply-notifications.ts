// Auto-Apply Notification System

import {
  AutoApplyError,
  AutoApplyErrorHandler,
  AutoApplyErrorCode,
} from "./auto-apply-errors";

export interface NotificationConfig {
  title: string;
  description: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export class AutoApplyNotificationManager {
  private static notifications: NotificationConfig[] = [];

  static createSuccessNotification(
    title: string,
    description: string
  ): NotificationConfig {
    return {
      title,
      description,
      type: "success",
      duration: 5000,
    };
  }

  static createErrorNotification(error: AutoApplyError): NotificationConfig {
    const message = AutoApplyErrorHandler.getErrorMessage(error);
    const severity = AutoApplyErrorHandler.getErrorSeverity(error);

    return {
      title: "Auto-Apply Error",
      description: message,
      type:
        severity === "critical" || severity === "high" ? "error" : "warning",
      duration: severity === "critical" ? 0 : 8000, // Critical errors don't auto-dismiss
    };
  }

  static createWarningNotification(
    title: string,
    description: string
  ): NotificationConfig {
    return {
      title,
      description,
      type: "warning",
      duration: 6000,
    };
  }

  static createInfoNotification(
    title: string,
    description: string
  ): NotificationConfig {
    return {
      title,
      description,
      type: "info",
      duration: 4000,
    };
  }

  static createCreditsNotification(
    credits: number,
    required: number = 10
  ): NotificationConfig {
    if (credits < required) {
      return this.createWarningNotification(
        "Insufficient Credits",
        `You need ${required} credits to use this feature. You currently have ${credits} credits.`
      );
    }

    return this.createInfoNotification(
      "Credits Available",
      `You have ${credits} credits available.`
    );
  }

  static createConfigurationNotification(isEdit: boolean): NotificationConfig {
    return this.createSuccessNotification(
      isEdit ? "Configuration Updated" : "Configuration Created",
      isEdit
        ? "Your auto-apply configuration has been updated successfully."
        : "Your auto-apply configuration has been created successfully."
    );
  }

  static createAutoApplyStatusNotification(
    isActive: boolean
  ): NotificationConfig {
    return this.createSuccessNotification(
      isActive ? "Auto-Apply Activated" : "Auto-Apply Deactivated",
      isActive
        ? "Auto-apply is now active and will automatically apply to jobs based on your criteria."
        : "Auto-apply has been deactivated."
    );
  }

  static createJobApplicationNotification(
    success: boolean,
    jobTitle?: string,
    companyName?: string
  ): NotificationConfig {
    if (success) {
      return this.createSuccessNotification(
        "Application Submitted",
        `Successfully applied to ${jobTitle} at ${companyName}`
      );
    }

    return this.createErrorNotification(
      AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.JOB_APPLICATION_FAILED,
        `Failed to apply to ${jobTitle} at ${companyName}`
      )
    );
  }

  static createRateLimitNotification(): NotificationConfig {
    return this.createWarningNotification(
      "Rate Limit Reached",
      "You have reached the maximum number of applications for today. Please try again tomorrow."
    );
  }

  static createNetworkErrorNotification(): NotificationConfig {
    return this.createErrorNotification(
      AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.NETWORK_ERROR,
        "Network connection error. Please check your internet connection and try again."
      )
    );
  }

  static createValidationErrorNotification(field: string): NotificationConfig {
    return this.createErrorNotification(
      AutoApplyErrorHandler.createError(
        AutoApplyErrorCode.INVALID_FORM_DATA,
        `Please check the ${field} field and try again.`,
        field
      )
    );
  }

  // Toast notification integration
  static showNotification(notification: NotificationConfig, toast: any): void {
    const toastConfig = {
      title: notification.title,
      description: notification.description,
      variant: notification.type === "error" ? "destructive" : "default",
      duration: notification.duration,
    };

    if (notification.action) {
      toast({
        ...toastConfig,
        action: notification.action,
      });
    } else {
      toast(toastConfig);
    }
  }

  // Batch notifications
  static showBatchNotifications(
    notifications: NotificationConfig[],
    toast: any
  ): void {
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        this.showNotification(notification, toast);
      }, index * 1000); // Stagger notifications
    });
  }
}
