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

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
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

      // Copy all cookies from supabaseResponse to redirectResponse
      supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
        redirectResponse.cookies.set(name, value);
      });

      return redirectResponse;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/signin?error=Could not authenticate user`
  );
}
