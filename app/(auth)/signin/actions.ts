"use server";

import { createClient, createServiceClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

interface AuthCheckResult {
  authenticated: boolean;
  user: User | null;
}

export async function checkAuth(): Promise<AuthCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { authenticated: false, user: null };
  }

  return { authenticated: true, user };
}

export async function deleteUserAccount(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const confirmation = formData.get("confirm") as string;

  // Verify confirmation text
  if (confirmation !== "DELETE") {
    throw new Error('Confirmation text must be "DELETE"');
  }

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  try {
    const serviceClient = await createServiceClient();
    const userId = user.id;

    // Delete user data from all tables
    // Delete auto-apply configurations
    await serviceClient
      .from("auto_apply_configs")
      .delete()
      .eq("user_id", userId);

    // Delete resumes
    await serviceClient.from("resumes").delete().eq("user_id", userId);

    // Delete jobs
    await serviceClient.from("jobs").delete().eq("user_id", userId);

    // Delete cover letters
    await serviceClient.from("cover_letters").delete().eq("user_id", userId);

    // Delete follow-up emails
    await serviceClient.from("follow_up_emails").delete().eq("user_id", userId);

    // Delete interview questions
    await serviceClient
      .from("interview_questions")
      .delete()
      .eq("user_id", userId);

    // Delete profiles
    await serviceClient.from("profiles").delete().eq("user_id", userId);

    // Delete user record
    await serviceClient.from("users").delete().eq("id", userId);

    // Delete the auth user using admin API
    // Create a Supabase admin client with service role key for auth admin operations
    const adminClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(
      userId
    );

    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError);
      throw new Error("Failed to delete user account");
    }

    revalidatePath("/", "layout");

    // Redirect to landing page after successful deletion
    redirect("/landing");
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete user account");
  }
}

interface WaitlistResult {
  success: boolean;
  error?: string;
}

export async function joinWaitlist(
  formData: FormData
): Promise<WaitlistResult> {
  try {
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    if (!email || !firstName || !lastName) {
      return { success: false, error: "All fields are required" };
    }

    // Create a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email address" };
    }

    // Here you would typically save to a database
    // For now, we'll just return success
    // TODO: Implement database storage for waitlist entries

    console.log("Waitlist entry:", { email, firstName, lastName });

    return { success: true };
  } catch (error) {
    console.error("Error joining waitlist:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join waitlist",
    };
  }
}
