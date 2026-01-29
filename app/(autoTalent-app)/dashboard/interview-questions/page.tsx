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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type InterviewItem = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function InterviewPage() {
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
            No interview questions created yet
          </h2>
          <p className="text-gray-600 max-w-md">
            Generate AI-powered interview questions tailored to your job
            description
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
          Generate Questions
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60",
              )}
            >
              <MessageSquare className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">
                Interview Questions
              </h1>
              <p className="text-zinc-600 text-sm mt-1">
                AI-powered questions to help you prepare for interviews
              </p>
            </div>
          </div>

          {/* Search Bar */}
          {interviewList.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search interview questions by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-800 bg-white/80 border-gray-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setShowModal(true)}
              disabled={isLoading}
              className={cn(
                "text-white shadow-lg hover:shadow-xl transition-all duration-500",
                "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
                "group",
              )}
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              {isLoading ? "Generating..." : "Generate Questions"}
            </Button>

            {interviewList.length > 0 && (
              <div className="text-sm text-zinc-500">
                {filteredInterviewList.length} of {interviewList.length}{" "}
                question set{interviewList.length !== 1 ? "s" : ""}
                {searchQuery && ` matching "${searchQuery}"`}
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
        {isLoading && (
          <Card className="p-6 bg-zinc-50 border-zinc-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-600">
                Generating your interview questions...
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
                  No interview questions found matching "{searchQuery}"
                </span>
              </div>
            </div>
          )}
      </div>

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
                    Generate Interview Questions
                  </h2>
                  <p className="text-sm text-zinc-600 mt-1">
                    AI will create questions based on your job description
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
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
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
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder="Paste the job description here to generate relevant questions..."
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
                  Cancel
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Questions
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
