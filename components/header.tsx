"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/getCurrentUser";
import type { User } from "@supabase/supabase-js";
import { Loader2Icon, BrainCircuit } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/landing");
    router.refresh();
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        <Link
          href="/landing"
          className="flex items-center gap-2 sm:gap-3 group"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5b6949] rounded-full flex items-center justify-center group-hover:bg-[#4a5438] transition-colors">
            <BrainCircuit className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-[#5b6949] group-hover:text-[#4a5438] transition-colors">
            AutoTalent
          </span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="hidden md:flex items-center">
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                Tools
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Auto Apply
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Interview Buddy
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    AI Resume Builder
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    AI Cover Letter Builder
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    AI Mock Interview
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    AI Resume Scanner
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Job Board
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Resume Translator
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    LinkedIn to Resume
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Resume Examples
                  </Link>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Cover Letter Examples
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">
                Hello, {user.email}
              </span>
              <Link
                onClick={() => setIsLoading(true)}
                href="/dashboard"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#5b6949] rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-[#5b6949]/90 transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <span className="hidden sm:inline">Redirecting </span>
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  "Dashboard"
                )}
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/signin"
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 text-xs sm:text-sm font-medium hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-[#5b6949] rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-[#5b6949]/90 transition-colors"
              >
                Start now
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
