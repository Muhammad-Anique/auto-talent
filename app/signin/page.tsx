"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Header from "@/components/header";
import { BrainCircuitIcon, Loader2Icon, ArrowLeft } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect to dashboard if already signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    // Magic link sign in
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${baseUrl}/auth/callback?next=/dashboard`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // Show success message
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${baseUrl}/auth/callback?next=/dashboard`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
    // On success, Supabase will redirect
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-white">
      {/* Back to Landing Page Link */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/landing")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col">
        {/* Logo/Icon */}
        <div className="mb-6 mt-2 flex ">
          <span className="inline-flex w-12 h-12 rounded-full bg-[#5b6949] bg-opacity-10 overflow-hidden items-center justify-center">
            <BrainCircuitIcon className="text-[#ffffff] size-8" />
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
        <p className=" text-gray-500 mb-6">Enter your email to get started</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              Check your email for the magic link!
            </div>
          )}
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b6949]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-[#5b6949] rounded-md transition disabled:opacity-50 font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="h-5 w-5 animate-spin mr-2" />
                Signing In...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6 w-full">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 bg-white hover:bg-gray-50 transition disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="font-medium">Google</span>
        </button>
        {/* reCAPTCHA and privacy text */}
        <div className="mt-8 text-xs text-gray-400 text-center">
          <p>
            This site is protected by reCAPTCHA and the Google Privacy Policy.
          </p>
          <p className="mt-2">
            By signing in, you agree to our{" "}
            <a href="#" className="underline text-gray-500 hover:text-blue-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-gray-500 hover:text-blue-600">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
