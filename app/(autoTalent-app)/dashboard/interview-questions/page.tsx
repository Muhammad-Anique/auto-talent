"use client";

import { useState, useEffect } from "react";
import InterviewCard from "@/components/interview-question/InterviewCard";
import { supabase } from "@/lib/supabase/client";
import { useLoading } from "@/context/LoadingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Plus,
  ArrowRight,
  AlertCircle,
  Loader2,
  X,
  Brain,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { checkCanPerformAction, recordUsage } from "@/utils/actions/subscriptions/usage";
import { PaywallModal } from "@/components/ui/paywall-modal";
import { useLocale } from "@/components/providers/locale-provider";

type InterviewItem = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function InterviewPage() {
  const { t } = useLocale();
  const [interviewList, setInterviewList] = useState<InterviewItem[]>([]);
  const [filteredInterviewList, setFilteredInterviewList] = useState<
    InterviewItem[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const { setIsLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    setGlobalLoading(false);
    fetchInterviewQuestions();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredInterviewList(interviewList);
      return;
    }

    const filtered = interviewList.filter((interview) => {
      const searchLower = searchQuery.toLowerCase();
      const titleMatch = interview.title.toLowerCase().includes(searchLower);
      const descriptionMatch = interview.description
        .toLowerCase()
        .includes(searchLower);
      return titleMatch || descriptionMatch;
    });

    setFilteredInterviewList(filtered);
  }, [searchQuery, interviewList]);

  const fetchInterviewQuestions = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }

      const { data, error } = await supabase
        .from("interview_questions")
        .select("id, title, description, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching interview questions:", error);
        setError("Failed to fetch interview questions");
        return;
      }

      if (data) {
        setInterviewList(data);
        setFilteredInterviewList(data);
      }
    } catch (err) {
      setError("Failed to fetch interview questions");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobDescription) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check credit limit
      const creditCheck = await checkCanPerformAction('questionnaire');
      if (!creditCheck.allowed) {
        setShowPaywall(true);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription }),
      });

      const data = await res.json();

      if (data.questions) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw new Error("Failed to get user");
        }

        const { data: insertedData, error: insertError } = await supabase
          .from("interview_questions")
          .insert([
            {
              title: jobTitle,
              description: jobDescription,
              questions: data.questions,
              user_id: user?.id,
            },
          ])
          .select("id, title, description, created_at")
          .single();

        if (insertError) {
          throw new Error("Failed to save interview questions");
        }

        if (insertedData) {
          await recordUsage('questionnaire');
          setInterviewList((prev) => [insertedData, ...prev]);
          setFilteredInterviewList((prev) => [insertedData, ...prev]);
          toast({
            title: "Success",
            description: "Interview questions generated successfully!",
          });
        }

        setJobTitle("");
        setJobDescription("");
        setShowModal(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to generate interview questions";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <div className="text-center space-y-6">
        {/* Simple Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-br from-[#5b6949]/10 to-gray-500/10 border border-[#5b6949]/20">
            <MessageSquare className="w-12 h-12 text-[#5b6949]" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("dashboard.interviewPage.noQuestionsTitle")}
          </h2>
          <p className="text-gray-600 max-w-md">
            {t("dashboard.interviewPage.noQuestionsDescription")}
          </p>
        </div>

        {/* Button */}
        <Button
          onClick={() => setShowModal(true)}
          disabled={isLoading}
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
          {t("dashboard.interviewPage.generateQuestions")}
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
                  {t("dashboard.interviewPage.badge")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {t("dashboard.interviewPage.title")}
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-md leading-relaxed">
                {t("dashboard.interviewPage.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 text-[#8fa676]" />
                <span className="text-sm text-zinc-300 font-medium">
                  {interviewList.length} {interviewList.length !== 1 ? t("dashboard.interviewPage.questionSets") : t("dashboard.interviewPage.questionSet")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Action Card */}
        <div className="relative rounded-2xl bg-white border border-zinc-200/80 shadow-sm shadow-black/[0.03] p-6 sm:p-8 space-y-4">
          {/* Search Bar */}
          {interviewList.length > 0 && (
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-md bg-[#5b6949]/10 group-focus-within:bg-[#5b6949]/20 transition-colors">
                <Search className="w-3.5 h-3.5 text-[#5b6949]" />
              </div>
              <Input
                type="text"
                placeholder={t("dashboard.interviewPage.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-zinc-800 bg-zinc-50/50 border-zinc-200 rounded-xl focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/10 focus:bg-white placeholder:text-zinc-400 transition-all"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setShowModal(true)}
              disabled={isLoading}
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
              {isLoading ? t("dashboard.interviewPage.generating") : t("dashboard.interviewPage.generateQuestions")}
            </Button>

            {interviewList.length > 0 && (
              <div className="text-sm text-zinc-500">
                {filteredInterviewList.length} of {interviewList.length}{" "}
                {interviewList.length !== 1 ? t("dashboard.interviewPage.questionSets") : t("dashboard.interviewPage.questionSet")}
                {searchQuery && ` ${t("dashboard.interviewPage.matching")} "${searchQuery}"`}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="relative rounded-2xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-6 bg-zinc-50 border-zinc-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-600">
                {t("dashboard.interviewPage.generatingQuestions")}
              </span>
            </div>
          </Card>
        )}

        {/* Content */}
        {filteredInterviewList.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredInterviewList.map(
              ({ id, title, description, created_at }) => (
                <InterviewCard
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  created_at={created_at}
                />
              ),
            )}
          </div>
        )}

        {/* No Search Results */}
        {interviewList.length > 0 &&
          filteredInterviewList.length === 0 &&
          searchQuery && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">
                  {t("dashboard.interviewPage.noQuestionsFound")} "{searchQuery}"
                </span>
              </div>
            </div>
          )}
      </div>

      <PaywallModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature={t("dashboard.interviewPage.title")}
        limitMessage={t("dashboard.interviewPage.paywallMessage")}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <Card
            className={cn(
              "relative w-full max-w-md p-0 overflow-hidden",
              "bg-white/90 backdrop-blur-xl border-white/40 shadow-2xl",
              "animate-in fade-in-0 zoom-in-95 duration-300",
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "relative px-6 pt-6 pb-4 border-b",
                "bg-gradient-to-r from-zinc-50/80 to-gray-50/80",
                "border-zinc-200/40",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60",
                  )}
                >
                  <Brain className="w-5 h-5 text-[#5b6949]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {t("dashboard.interviewPage.modalTitle")}
                  </h2>
                  <p className="text-sm text-zinc-600 mt-1">
                    {t("dashboard.interviewPage.modalSubtitle")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowModal(false)}
                  className="h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/80"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700">
                    {t("dashboard.interviewPage.jobTitle")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder={t("dashboard.interviewPage.jobTitlePlaceholder")}
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className={cn(
                      "w-full transition-all duration-200",
                      "border-zinc-200 focus:border-[#5b6949]",
                      "focus:ring-2 focus:ring-[#5b6949]/20",
                      "bg-white/60 backdrop-blur-sm",
                    )}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700">
                    {t("dashboard.interviewPage.jobDescription")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder={t("dashboard.interviewPage.jobDescriptionPlaceholder")}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                    className={cn(
                      "w-full resize-none transition-all duration-200",
                      "border-zinc-300 border focus:border-[#5b6949]",
                      "focus:ring-2 focus:ring-[#5b6949]/20",
                      "bg-white/60 backdrop-blur-sm",
                    )}
                    required
                  />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div
              className={cn(
                "px-6 py-4 border-t",
                "bg-gradient-to-r from-zinc-50/50 to-gray-50/50",
                "border-zinc-200/40",
              )}
            >
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                >
                  {t("dashboard.common.cancel")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !jobTitle || !jobDescription}
                  className={cn(
                    "flex-1 text-white shadow-lg hover:shadow-xl transition-all duration-500",
                    "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                    "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
                    "group",
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("dashboard.interviewPage.generating")}
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      {t("dashboard.interviewPage.generateQuestions")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
