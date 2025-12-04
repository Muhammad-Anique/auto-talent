"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Trophy, 
  Star,
  Timer,
  Brain,
  Target,
  Award,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Question {
  question: string;
  answer: string;
}

interface EvaluationResult {
  question: string;
  score: number;
  feedback: string;
}

export default function InterviewDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult[] | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const QUESTIONS_PER_PAGE = 3;
  const TOTAL_TIME = 30 * 60; // 30 minutes

  useEffect(() => {
    if (!id) return;

    const fetchInterview = async () => {
      const { data, error } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching interview:", error);
        return;
      }

      let parsedQuestions = data.questions;
      if (typeof parsedQuestions === "string") {
        try {
          parsedQuestions = JSON.parse(parsedQuestions);
        } catch (e) {
          console.error("Failed to parse questions JSON:", e);
          parsedQuestions = [];
        }
      }

      setData({
        ...data,
        questions: parsedQuestions,
      });
    };

    fetchInterview();
  }, [id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const startQuiz = () => {
    setIsTimerActive(true);
    toast({
      title: "Quiz Started!",
      description: "You have 30 minutes to complete the quiz. Good luck!",
    });
  };

  const handleTimeUp = async () => {
    setIsTimerActive(false);
    toast({
      title: "Time's Up!",
      description: "Your quiz has been automatically submitted.",
      variant: "destructive",
    });
    await handleEvaluate();
  };

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const payload = {
        questions: data.questions.map((q: Question) => ({
          question: q.question,
          answer: q.answer,
        })),
        candidateAnswers: data.questions.map((q: Question, index: number) => ({
          question: q.question,
          answer: answers[index] || "No answer provided",
        })),
      };

      const response = await fetch("/api/evaluate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to evaluate: ${errorResponse.error}`);
      }

      const result = await response.json();
      const results = result.results as EvaluationResult[];
      
      // Calculate overall score
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      const averageScore = Math.round((totalScore / results.length) * 10) / 10;
      
      setEvaluationResult(results);
      setOverallScore(averageScore);
      setShowResults(true);
      setIsTimerActive(false);

    } catch (error) {
      console.error("Evaluation error:", error);
      toast({
        title: "Evaluation Error",
        description: "Failed to evaluate your answers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestions = () => {
    if (!data?.questions) return [];
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    return data.questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  };

  const totalPages = data ? Math.ceil(data.questions.length / QUESTIONS_PER_PAGE) : 0;
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = data?.questions?.length || 0;

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#5b6949] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Quiz Start Screen
  if (!isTimerActive && !showResults) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-gray-50">
        <div className="container mx-auto p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-md border border-zinc-200">
              <div className="text-center space-y-8">
                {/* Header */}
      <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60">
                      <Brain className="w-12 h-12 text-[#5b6949]" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">{data.title}</h1>
                    <p className="text-zinc-600">{data.description}</p>
                  </div>
                </div>

                {/* Quiz Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg  border border-zinc-200">
                    <div className="flex  items-center gap-2 mb-2">
                      <Timer className="w-5 h-5 text-[#5b6949]" />
                      <span className="font-semibold text-zinc-900 text-left">Time Limit</span>
                    </div>
                    <p className="text-zinc-600 text-left">30 minutes</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-[#5b6949]" />
                      <span className="font-semibold text-zinc-900">Questions</span>
                    </div>
                    <p className="text-zinc-600">{totalQuestions} questions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-[#5b6949]" />
                      <span className="font-semibold text-zinc-900">Difficulty</span>
                    </div>
                    <p className="text-zinc-600">AI-Generated</p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-zinc-50 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-zinc-900 mb-3">Instructions:</h3>
                  <ul className="space-y-2 text-sm text-zinc-600">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5b6949] flex-shrink-0"></div>
                      <span>You have 30 minutes to complete all questions</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5b6949] flex-shrink-0"></div>
                      <span>Answer all questions to the best of your ability</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5b6949] flex-shrink-0"></div>
                      <span>Your answers will be evaluated by AI for accuracy and completeness</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5b6949] flex-shrink-0"></div>
                      <span>You can navigate between questions using the pagination</span>
                    </li>
                  </ul>
                </div>

                {/* Start Button */}
                <Button
                  onClick={startQuiz}
                  className={cn(
                    "px-8 py-4 text-lg font-semibold",
                    "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                    "text-white hover:shadow-xl hover:shadow-[#5b6949]/25",
                    "hover:-translate-y-1 hover:scale-105 transition-all duration-500"
                  )}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Start Quiz
                </Button>
              </div>
            </Card>
          </div>
            </div>
      </div>
    );
  }

  // Results Modal
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
        <div className="container mx-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl">
              <div className="text-center space-y-8">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60">
                      <Award className="w-12 h-12 text-[#5b6949]" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Quiz Results</h1>
                    <p className="text-zinc-600">Here's how you performed</p>
                  </div>
                </div>

                {/* Overall Score Card */}
                <Card className="p-6 bg-gradient-to-r from-zinc-50/80 to-gray-50/80 border border-zinc-200/60">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Star className="w-8 h-8 text-[#5b6949]" />
                    <span className="text-2xl font-bold text-zinc-900">Overall Score</span>
                  </div>
                  <div className="text-4xl font-bold text-[#5b6949] mb-2">
                    {overallScore}/10
                  </div>
                  <div className="text-sm text-zinc-600">
                    {overallScore >= 8 ? "Excellent! You're well-prepared!" :
                     overallScore >= 6 ? "Good job! Keep practicing!" :
                     "Keep studying and try again!"}
                  </div>
                </Card>

                {/* Individual Results */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-zinc-900">Question Breakdown</h2>
                  {evaluationResult?.map((result, index) => (
                    <Card key={index} className="p-6 text-left">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-zinc-900 mb-2">
                            Question {index + 1}
                          </h3>
                          <p className="text-zinc-600 text-sm mb-3">{result.question}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {result.score >= 8 ? <CheckCircle className="w-4 h-4 text-[#5b6949]" /> :
                           result.score >= 6 ? <Star className="w-4 h-4 text-[#5b6949]" /> :
                           <XCircle className="w-4 h-4 text-zinc-500" />}
                          {result.score}/10
                        </div>
                      </div>
                      <div className="bg-zinc-50 rounded-lg p-4">
                        <p className="text-sm text-zinc-700">{result.feedback}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => router.push('/dashboard/interview-questions')}
                    variant="outline"
                    className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Questions
                  </Button>
        <Button
                    onClick={() => window.location.reload()}
                    className="bg-[#5b6949] text-white hover:bg-[#5b6949]/90"
        >
                    <Trophy className="w-4 h-4 mr-2" />
                    Try Again
        </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">{data.title}</h1>
              <p className="text-zinc-600">{data.description}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Timer */}
              <Card className="px-4 py-2 bg-zinc-50 border-zinc-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#5b6949]" />
                  <span className={cn(
                    "font-mono font-bold text-lg",
                    timeLeft <= 300 ? "text-red-600" : "text-zinc-700"
                  )}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </Card>
              
              {/* Progress */}
              <Card className="px-4 py-2 bg-zinc-50 border-zinc-200">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#5b6949]" />
                  <span className="text-zinc-700 font-medium">
                    {answeredQuestions}/{totalQuestions}
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Progress</span>
              <span>{Math.round((answeredQuestions / totalQuestions) * 100)}%</span>
            </div>
            <Progress value={(answeredQuestions / totalQuestions) * 100} className="h-2" />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {getCurrentQuestions().map((question: Question, index: number) => {
            const globalIndex = currentPage * QUESTIONS_PER_PAGE + index;
            return (
              <Card key={globalIndex} className="p-6 bg-white/80 backdrop-blur-sm border-white/40">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#5b6949] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {globalIndex + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 mb-3">{question.question}</h3>
                      <textarea
                        value={answers[globalIndex] || ""}
                        onChange={(e) => handleChange(globalIndex, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-4 border border-zinc-200 rounded-lg resize-none focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20 transition-all duration-200"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            variant="outline"
            className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i)}
                variant={currentPage === i ? "default" : "outline"}
                size="sm"
                className={cn(
                  currentPage === i ? "bg-[#5b6949] text-white" : "border-zinc-200 text-zinc-600"
                )}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {currentPage === totalPages - 1 ? (
              <Button
                onClick={handleEvaluate}
                disabled={loading || answeredQuestions === 0}
                className="bg-[#5b6949] text-white hover:bg-[#5b6949]/90"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Submit Quiz
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                variant="outline"
                className="border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}