import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  RateLimiter,
  SecurityValidator,
  SecurityMiddleware,
  DEFAULT_RATE_LIMITS,
  InputSanitizer,
} from "@/lib/auto-apply-security";
import {
  AutoApplyErrorHandler,
  AutoApplyErrorCode,
} from "@/lib/auto-apply-errors";
import { AutoApplyConfigDB } from "@/lib/auto-apply-types";

// GET /api/auto-apply/config - Get user's auto-apply configuration
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: config, error } = await supabase
      .from("auto_apply_configs")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error("Failed to fetch configuration");
    }

    return NextResponse.json({
      config: config || null,
    });
  } catch (error) {
    console.error("Error fetching auto-apply config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/auto-apply/config - Create new auto-apply configuration
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Sanitize input data
    const sanitizedData = {
      ...body,
      first_name: InputSanitizer.sanitizeHtml(body.first_name),
      last_name: InputSanitizer.sanitizeHtml(body.last_name),
      email: InputSanitizer.sanitizeEmail(body.email),
      phone: InputSanitizer.sanitizePhone(body.phone),
      linkedin_url: InputSanitizer.sanitizeUrl(body.linkedin_url),
      website: body.website ? InputSanitizer.sanitizeUrl(body.website) : null,
      github_url: body.github_url
        ? InputSanitizer.sanitizeUrl(body.github_url)
        : null,
      search_terms: InputSanitizer.sanitizeHtml(body.search_terms),
      search_location: InputSanitizer.sanitizeHtml(body.search_location),
    };

    // Apply rate limiting
    const result = await SecurityMiddleware.withRateLimit(
      user.id,
      "configCreation",
      DEFAULT_RATE_LIMITS.configCreation,
      async () => {
        // Security validation
        return await SecurityMiddleware.withSecurityValidation(
          user.id,
          () => SecurityValidator.validateConfigCreation(user.id),
          async () => {
            // Check credits
            const { data: userData } = await supabase
              .from("users")
              .select("credits")
              .eq("id", user.id)
              .single();

            if (!userData || userData.credits < 10) {
              throw new Error("Insufficient credits");
            }

            // Create configuration
            const { data: config, error } = await supabase
              .from("auto_apply_configs")
              .insert([
                {
                  user_id: user.id,
                  ...sanitizedData,
                },
              ])
              .select()
              .single();

            if (error) {
              throw new Error("Failed to create configuration");
            }

            // Deduct credits
            await supabase
              .from("users")
              .update({ credits: userData.credits - 10 })
              .eq("id", user.id);

            // Log activity
            await supabase.from("auto_apply_activity_log").insert({
              user_id: user.id,
              config_id: config.id,
              activity_type: "config_created",
              description: "Auto-apply configuration created",
            });

            return config;
          }
        );
      }
    );

    return NextResponse.json({
      success: true,
      config: result,
    });
  } catch (error) {
    console.error("Error creating auto-apply config:", error);

    if (error instanceof Error) {
      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429 }
        );
      }
      if (error.message.includes("credits")) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/auto-apply/config - Update auto-apply configuration
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { configId, ...updateData } = body;

    if (!configId) {
      return NextResponse.json(
        { error: "Configuration ID is required" },
        { status: 400 }
      );
    }

    // Sanitize input data
    const sanitizedData = {
      ...updateData,
      first_name: updateData.first_name
        ? InputSanitizer.sanitizeHtml(updateData.first_name)
        : undefined,
      last_name: updateData.last_name
        ? InputSanitizer.sanitizeHtml(updateData.last_name)
        : undefined,
      email: updateData.email
        ? InputSanitizer.sanitizeEmail(updateData.email)
        : undefined,
      phone: updateData.phone
        ? InputSanitizer.sanitizePhone(updateData.phone)
        : undefined,
      linkedin_url: updateData.linkedin_url
        ? InputSanitizer.sanitizeUrl(updateData.linkedin_url)
        : undefined,
      website: updateData.website
        ? InputSanitizer.sanitizeUrl(updateData.website)
        : undefined,
      github_url: updateData.github_url
        ? InputSanitizer.sanitizeUrl(updateData.github_url)
        : undefined,
      search_terms: updateData.search_terms
        ? InputSanitizer.sanitizeHtml(updateData.search_terms)
        : undefined,
      search_location: updateData.search_location
        ? InputSanitizer.sanitizeHtml(updateData.search_location)
        : undefined,
    };

    // Apply rate limiting
    const result = await SecurityMiddleware.withRateLimit(
      user.id,
      "configUpdate",
      DEFAULT_RATE_LIMITS.configUpdate,
      async () => {
        // Update configuration
        const { data: config, error } = await supabase
          .from("auto_apply_configs")
          .update(sanitizedData)
          .eq("id", configId)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) {
          throw new Error("Failed to update configuration");
        }

        // Log activity
        await supabase.from("auto_apply_activity_log").insert({
          user_id: user.id,
          config_id: config.id,
          activity_type: "config_updated",
          description: "Auto-apply configuration updated",
        });

        return config;
      }
    );

    return NextResponse.json({
      success: true,
      config: result,
    });
  } catch (error) {
    console.error("Error updating auto-apply config:", error);

    if (error instanceof Error && error.message.includes("Rate limit")) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/auto-apply/config - Delete auto-apply configuration
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const configId = searchParams.get("configId");

    if (!configId) {
      return NextResponse.json(
        { error: "Configuration ID is required" },
        { status: 400 }
      );
    }

    // Delete configuration
    const { error } = await supabase
      .from("auto_apply_configs")
      .delete()
      .eq("id", configId)
      .eq("user_id", user.id);

    if (error) {
      throw new Error("Failed to delete configuration");
    }

    // Log activity
    await supabase.from("auto_apply_activity_log").insert({
      user_id: user.id,
      activity_type: "config_deleted",
      description: "Auto-apply configuration deleted",
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting auto-apply config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
