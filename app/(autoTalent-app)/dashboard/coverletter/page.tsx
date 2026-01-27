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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverLetter {
  id: string;
  title: string;
  context: string;
  created_at: string;
}

const CoverLettersPage = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [filteredCoverLetters, setFilteredCoverLetters] = useState<
    CoverLetter[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading } = useLoading();

  const fetchCoverLetters = async () => {
    const { data, error } = await supabase
      .from("cover_letters")
      .select("*")
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
            No cover letters created yet
          </h2>
          <p className="text-gray-600 max-w-md">
            Start building your professional profile by creating your first
            cover letter
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
          Create Cover Letter
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
              <FileText className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">
                Cover Letters
              </h1>
              <p className="text-zinc-600 text-sm mt-1">
                Professional cover letters that get you noticed
              </p>
            </div>
          </div>

          {/* Search Bar */}
          {coverLetters.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search cover letters by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-gray-800 bg-white/80 border-gray-200 focus:border-[#5b6949] focus:ring-[#5b6949]/20"
              />
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className={cn(
                "text-white shadow-lg hover:shadow-xl transition-all duration-500",
                "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
                "group",
              )}
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              {loading ? "Creating..." : "New Cover Letter"}
            </Button>

            {coverLetters.length > 0 && (
              <div className="text-sm text-zinc-500">
                {filteredCoverLetters.length} of {coverLetters.length} cover
                letter{coverLetters.length !== 1 ? "s" : ""}
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
        {loading && (
          <Card className="p-6 bg-zinc-50 border-zinc-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-600">
                Creating your cover letter...
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
                  No cover letters found matching "{searchQuery}"
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
    </div>
  );
};

export default CoverLettersPage;
