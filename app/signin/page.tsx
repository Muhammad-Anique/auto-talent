"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { BrainCircuitIcon, Loader2Icon, ArrowLeft } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInMode, setSignInMode] = useState<"password" | "magic">("password");

  const plan = searchParams.get("plan");
  const postAuthPath = plan ? "/dashboard/subscription" : "/dashboard";

  // Redirect to dashboard if already signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        router.push(postAuthPath);
      }
    };
    checkSession();
  }, [router, postAuthPath]);

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push(postAuthPath);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    // Magic link sign in
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    // Ensure we have a full URL with protocol and correct callback path
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(postAuthPath)}`;

    const { error: signInError, data } = await supabase.auth.signInWithOtp({
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
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(postAuthPath)}`;
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

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(postAuthPath)}`;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('rate limit')) {
        setError("Too many sign-up attempts. Please wait a few minutes and try again, or sign in with Google.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-white">
      {/* Back to Landing Page Link */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/landing")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col">
        {/* Logo/Icon */}
        <div className="mb-6 mt-2 flex ">
          <span className="inline-flex w-12 h-12 rounded-full bg-[#5b6949] overflow-hidden items-center justify-center">
            <BrainCircuitIcon className="text-white size-8" />
          </span>
        </div>
        <h2 className="text-3xl text-gray-900 font-bold mb-2">
          {isSignUp ? "Create account" : "Sign in"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isSignUp
            ? "Enter your email and create a password"
            : "Enter your email and password to get started"}
        </p>

        {/* Toggle between Sign In and Sign Up */}
        <div className="flex gap-2 mb-4 w-full">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(""); setSuccess(false); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              !isSignUp
                ? "bg-[#5b6949] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(""); setSuccess(false); }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              isSignUp
                ? "bg-[#5b6949] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Toggle between Password and Magic Link (only for sign in) */}
        {!isSignUp && (
          <div className="flex gap-2 mb-4 w-full">
            <button
              type="button"
              onClick={() => setSignInMode("password")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                signInMode === "password"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setSignInMode("magic")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                signInMode === "magic"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Magic Link
            </button>
          </div>
        )}

        <form
          onSubmit={
            isSignUp
              ? handleEmailSignUp
              : signInMode === "password"
              ? handlePasswordSignIn
              : handleMagicLinkSignIn
          }
          className="w-full flex flex-col gap-4"
        >
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {isSignUp
                ? "Check your email to confirm your account!"
                : "Check your email for the magic link!"}
            </div>
          )}
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b6949] text-gray-900"
          />
          {(isSignUp || signInMode === "password") && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b6949] text-gray-900"
            />
          )}
          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b6949] text-gray-900"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-[#5b6949] rounded-md transition disabled:opacity-50 font-medium hover:bg-[#4a5438]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="h-5 w-5 animate-spin mr-2" />
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </span>
            ) : isSignUp ? (
              "Create Account"
            ) : signInMode === "password" ? (
              "Sign in with Password"
            ) : (
              "Send Magic Link"
            )}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6 w-full">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-3 text-gray-600 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-gray-300" />
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
          <span className="font-medium text-gray-900">Sign in with Google</span>
        </button>
        {/* Privacy text */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p className="mt-2">
            By {isSignUp ? "creating an account" : "signing in"}, you agree to our{" "}
            <a href="#" className="underline text-gray-700 hover:text-[#5b6949]">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-gray-700 hover:text-[#5b6949]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen justify-center items-center bg-white">
          <Loader2Icon className="h-8 w-8 animate-spin text-[#5b6949]" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
