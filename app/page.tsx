import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  themeColor: "#ffffff",
};

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const code = params.code;
  const type = params.type; // magiclink, recovery, etc.

  // If there's an auth code, handle it and redirect to dashboard
  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore - called from Server Component
            }
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successfully authenticated, redirect to dashboard
      console.log("✅ Authentication successful, redirecting to dashboard");
      redirect("/dashboard");
    } else {
      // Error, redirect to signin with error message
      console.error("❌ Authentication error:", error.message);
      redirect(`/signin?error=${encodeURIComponent(error.message)}`);
    }
  }

  // No auth code, redirect to landing
  redirect("/landing");
}
