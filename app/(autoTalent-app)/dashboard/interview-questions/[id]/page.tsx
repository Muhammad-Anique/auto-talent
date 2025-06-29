"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, Sparkles, Loader2, AlertCircle, ClipboardList, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError("Failed to fetch interview details.");
        setLoading(false);
        return;
      }

      let parsedQuestions = data.questions;
      if (typeof parsedQuestions === "string") {
        try {
          parsedQuestions = JSON.parse(parsedQuestions);
        } catch (e) {
          parsedQuestions = [];
        }
      }

      setData({
        ...data,
        questions: parsedQuestions,
      });
      setLoading(false);
    };

    fetchInterview();
  }, [id]);

  const handleEvaluate = async () => {
    router.push(`/dashboard/interview-questions/${id}/evaluation`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-gray-50">
        <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl flex items-center gap-4">
          <Loader2 className="w-6 h-6 text-[#5b6949] animate-spin" />
          <span className="text-zinc-600">Loading interview...</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-gray-50">
        <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl max-w-md">
          <div className="text-center space-y-4">
            <div className="p-3 rounded-full bg-red-100 mx-auto w-fit">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Error</h2>
            <p className="text-zinc-600 text-sm">{error}</p>
            <Button onClick={handleBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50 py-6">
      <div className="container w-full  px-2 sm:px-6 lg:px-6">
        <Card className="p-4 border-none shadow-none  w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={handleBack} className="p-2 hover:bg-zinc-100/80">
              <ArrowLeft className="w-5 h-5 text-zinc-600" />
            </Button>
            <div className="p-3 rounded-xl bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60">
              <MessageSquare className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-zinc-900">{data.title}</h1>
              <p className="text-zinc-600 text-sm mt-1">{data.description}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6 mb-[140px]">
            {Array.isArray(data.questions) && data.questions.length > 0 ? (
              data.questions.map((q: any, index: number) => (
                <Card
                  key={index}
                  className={cn(
                    "p-6 bg-white/90 border-zinc-100/60 shadow-sm flex flex-col gap-2",
                    "transition-all duration-300 hover:shadow-lg hover:border-[#5b6949]/40"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4 text-[#5b6949]" />
                    <span className="font-semibold text-zinc-800">Question {index + 1}</span>
                  </div>
                  <p className="text-zinc-700 font-medium mb-1 whitespace-pre-line">{q.question}</p>
                  {q.answer && (
                    <div className="flex items-start gap-2 text-sm text-zinc-800 bg-[#5b6949]/10 rounded px-3 py-2 mt-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold">Description:</span>
                      <span className="text-zinc-800">{q.answer}</span>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center text-zinc-500 italic py-8">
                No questions found for this interview.
              </div>
            )}
          </div>

          {/* Take Test Button - Fixed Bottom Right */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-zinc-200/60">
                <Sparkles className="w-3 h-3 text-[#5b6949]" />
                <span>Ready to test your skills?</span>
              </div>
              <Button
                onClick={handleEvaluate}
                disabled={loading}
                className={cn(
                  "text-white shadow-2xl hover:shadow-3xl !min-h-[80px] transition-all duration-500",
                  "bg-gradient-to-r from-[#5b6949] via-[#5b6949]/90 to-[#5b6949]",
                  "hover:from-[#5b6949]/90 hover:via-[#5b6949] hover:to-[#5b6949]/90",
                  "group px-8 py-4 text-lg font-bold rounded-2xl",
                  "border-2 border-white/20 backdrop-blur-sm",
                  "transform hover:scale-105 active:scale-95"
                )}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/20">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span>Start Interview Test</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </Button>
            </div>
          </div>
          {evaluationResult && (
            <p className="mt-4 text-green-600">{evaluationResult}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
