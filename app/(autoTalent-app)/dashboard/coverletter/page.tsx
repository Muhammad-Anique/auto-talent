"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CoverLetterCard from "@/components/cover-letter/CoverLetterCard";
import CoverLetterFormModal from "@/components/cover-letter/CoverLetterFormModal";
import { useLoading } from "@/context/LoadingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkCanPerformAction, recordUsage } from "@/utils/actions/subscriptions/usage";
import { PaywallModal } from "@/components/ui/paywall-modal";
import { useTranslations } from "next-intl";

interface CoverLetter {
  id: string;
  title: string;
  context: string;
  created_at: string;
}

const CoverLettersPage = () => {
  const t = useTranslations("dashboard.coverLetterPage");
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [filteredCoverLetters, setFilteredCoverLetters] = useState<
    CoverLetter[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const { setIsLoading } = useLoading();

  const fetchCoverLetters = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const sortedData = data as CoverLetter[];
      setCoverLetters(sortedData);
      setFilteredCoverLetters(sortedData);
    }
    if (error) setError("Failed to fetch cover letters");
  };

  useEffect(() => {
    setIsLoading(false);
    fetchCoverLetters();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCoverLetters(coverLetters);
      return;
    }

    const filtered = coverLetters.filter((coverLetter) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = coverLetter.title.toLowerCase().includes(searchLower);
      const contentMatch = coverLetter.context
        .toLowerCase()
        .includes(searchLower);
      return titleMatch || contentMatch;
    });

    setFilteredCoverLetters(filtered);
  }, [searchQuery, coverLetters]);

  const handleCreateCoverLetter = async (
    title: string,
    jobDescription: string,
    tone: number,
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Check credit limit
      const creditCheck = await checkCanPerformAction('cover_letter_create');
      if (!creditCheck.allowed) {
        setShowPaywall(true);
        setLoading(false);
        return;
      }

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, jobDescription, tone }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate cover letter");
      }

      const generatedContent = result.coverLetter || result.context;

      // Insert into Supabase with user_id
      const { error: insertError } = await supabase
        .from("cover_letters")
        .insert({
          title,
          context: generatedContent,
          user_id: user.id,
        });

      if (insertError) {
        throw new Error("Failed to save cover letter to Supabase");
      }

      await recordUsage('cover_letter_create');
      await fetchCoverLetters();
      setIsModalOpen(false);
    } catch (err) {
      setLoading(false);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="text-center space-y-6">
        {/* Simple Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-[#5b6949]/10 to-gray-500/10 border border-[#5b6949]/20">
            <FileText className="w-12 h-12 text-[#5b6949]" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("noCoverLetters")}
          </h2>
          <p className="text-gray-600 max-w-md">
            {t("noCoverLettersDescription")}
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2",
            "rounded-full text-gray-800 font-medium px-8 py-3",
            "transition-all duration-500",
            "bg-[#5b6949]",
            "text-white hover:shadow-xl hover:shadow-[#5b6949]/25",
            "hover:-translate-y-1 hover:scale-105",
          )}
        >
          <Plus className="w-5 h-5" />
          {t("createNew")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7db_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-[#3d4832] p-8 sm:p-10">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(91,105,73,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(91,105,73,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#5b6949]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#5b6949]/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5b6949]/20 border border-[#5b6949]/30 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#8fa676]" />
                <span className="text-xs font-semibold text-[#8fa676] tracking-wide uppercase">
                  {t("badge")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {t("title")}
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
                {t("subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-[#8fa676]" />
                <span className="text-sm text-zinc-300 font-medium">
                  {coverLetters.length} {coverLetters.length !== 1 ? t("coverLettersCount") : t("coverLetterCount")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Action Card */}
        <div className="relative rounded-2xl bg-white border border-zinc-200/80 shadow-sm shadow-black/[0.03] p-6 sm:p-8 space-y-4">
          {/* Search Bar */}
          {coverLetters.length > 0 && (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-[#5b6949]/10 group-focus-within:bg-[#5b6949]/20 transition-colors">
                <Search className="w-3.5 h-3.5 text-[#5b6949]" />
              </div>
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-zinc-800 bg-zinc-50/50 border-zinc-200 rounded-xl focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 focus:bg-white placeholder:text-zinc-400 transition-all"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className={cn(
                "h-12 px-6 font-semibold rounded-xl",
                "bg-[#5b6949] text-white shadow-md shadow-[#5b6949]/20",
                "hover:bg-[#4a573a] hover:shadow-lg hover:shadow-[#5b6949]/25",
                "active:scale-[0.98] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                "group",
              )}
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              {loading ? t("generating") : t("createNew")}
            </Button>

            {coverLetters.length > 0 && (
              <div className="text-sm text-zinc-500">
                {filteredCoverLetters.length} of {coverLetters.length} {coverLetters.length !== 1 ? t("coverLettersCount") : t("coverLetterCount")}
                {searchQuery && ` ${t("matching")} "${searchQuery}"`}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="p-6 bg-zinc-50 border-zinc-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-600">
                {t("creatingCoverLetter")}
              </span>
            </div>
          </Card>
        )}

        {/* Content */}
        {filteredCoverLetters.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCoverLetters.map((coverLetter) => (
              <CoverLetterCard
                key={coverLetter.id}
                id={coverLetter.id}
                title={coverLetter.title}
                context={coverLetter.context}
              />
            ))}
          </div>
        )}

        {/* No Search Results */}
        {coverLetters.length > 0 &&
          filteredCoverLetters.length === 0 &&
          searchQuery && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">
                  {t("noSearchResults")} "{searchQuery}"
                </span>
              </div>
            </div>
          )}
      </div>

      {/* Modal */}
      <CoverLetterFormModal
        modalTitle="Create New Cover Letter"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCoverLetter}
      />

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={t("title")}
        limitMessage={t("paywallMessage")}
      />
    </div>
  );
};

export default CoverLettersPage;
