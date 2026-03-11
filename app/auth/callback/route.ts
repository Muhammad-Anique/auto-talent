import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    let supabaseResponse = NextResponse.next({
      request,
    });

    // Store cookies with their options for later use
    const cookiesToSet: Array<{ name: string; value: string; options?: any }> =
      [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSetFromSupabase: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            // Store cookies with options
            cookiesToSet.length = 0;
            cookiesToSetFromSupabase.forEach(({ name, value, options }) => {
              cookiesToSet.push({ name, value, options });
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSetFromSupabase.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      // Handle production URL properly
      let redirectUrl = `${origin}${next}`;
      if (!isLocalEnv) {
        // Use forwarded host if available (from proxy/load balancer)
        if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        }
        // Otherwise use the origin (should be app.autotalent.co in production)
        else {
          redirectUrl = `${origin}${next}`;
        }
      }

      // Create the redirect response with cookies
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Set all cookies with their options in the redirect response
      cookiesToSet.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options || {});
      });

      // Also copy any existing cookies from supabaseResponse
      supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
        if (!cookiesToSet.some((c) => c.name === name)) {
          redirectResponse.cookies.set(name, value);
        }
      });

      console.log(`✅ Auth successful, redirecting to: ${redirectUrl}`);
      console.log(`Cookies set: ${cookiesToSet.length} cookies`);

      return redirectResponse;
    } else {
      console.error(`❌ Auth error: ${error.message}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/signin?error=Could not authenticate user`
  );
}
