"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import CoverLetterFormModal from "@/components/cover-letter/CoverLetterFormModal";
import EmailCard from "@/components/emails/emails-card";
import { useLoading } from "@/context/LoadingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Plus, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { checkCanPerformAction, recordUsage } from "@/utils/actions/subscriptions/usage";
import { PaywallModal } from "@/components/ui/paywall-modal";
import { useLocale } from "@/components/providers/locale-provider";

interface Email {
  id: string;
  title: string;
  subject: string;
  content: string;
}

const CoverLettersPage = () => {
  const { t: translate } = useLocale();
  const t = (key: string) => translate(`dashboard.followUpEmailPage.${key}`);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const { setIsLoading } = useLoading();

  const fetchEmails = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("email_hr")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      setError("Failed to fetch emails");
    } else {
      const parsedData = data.map((email: any) => ({
        id: email.id,
        title: email.title,
        subject: email.subject,
        content: email.content || "",
      }));
      setEmails(parsedData as Email[]);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    fetchEmails();
  }, []);

  const handleCreateCoverLetter = async (
    title: string,
    jobDescription: string,
    tone: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Check credit limit
      const creditCheck = await checkCanPerformAction('follow_up_email');
      if (!creditCheck.allowed) {
        setShowPaywall(true);
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/email-hr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, jobDescription, tone }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate email");
      }

      const { subject, content } = result;
      const { error: insertError } = await supabase.from("email_hr").insert({
        title: title,
        subject: subject,
        content: content,
        user_id: user.id,
      });

      if (insertError) {
        throw new Error("Failed to save email to Supabase");
      }

      await recordUsage('follow_up_email');
      await fetchEmails();
      setIsModalOpen(false);
    } catch (err) {
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
      <Card className="max-w-md w-full p-8 bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className={cn(
              "p-4 rounded-2xl transition-all duration-300",
              "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60"
            )}>
              <Mail className="w-12 h-12 text-[#5b6949] mx-auto" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="p-2 rounded-full bg-[#5b6949]/10 border border-[#5b6949]/20">
                <Sparkles className="w-4 h-4 text-[#5b6949]" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-zinc-900">
              {t("noEmailsTitle")}
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {t("noEmailsDescription")}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="w-2 h-2 rounded-full bg-[#5b6949]" />
              <span>{t("benefit1")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="w-2 h-2 rounded-full bg-[#5b6949]" />
              <span>{t("benefit2")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="w-2 h-2 rounded-full bg-[#5b6949]" />
              <span>{t("benefit3")}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className={cn(
              "w-full text-white shadow-lg hover:shadow-xl transition-all duration-500",
              "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
              "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
              "group"
            )}
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            {loading ? t("creating") : t("createFirst")}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300",
              "bg-gradient-to-br from-zinc-100/80 to-gray-100/80 border border-zinc-200/60"
            )}>
              <Mail className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-zinc-900">
                {t("title")}
              </h1>
              <p className="text-zinc-600 text-sm mt-1">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className={cn(
                "text-white shadow-lg hover:shadow-xl transition-all duration-500",
                "bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80",
                "hover:from-[#5b6949]/90 hover:to-[#5b6949]/70",
                "group"
              )}
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              {loading ? t("creating") : t("newEmail")}
            </Button>

            {emails.length > 0 && (
              <div className="text-sm text-zinc-500">
                {emails.length} {emails.length !== 1 ? t("emailsCreated") : t("emailCreated")}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="p-6 bg-zinc-50 border-zinc-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-[#5b6949] border-t-transparent rounded-full animate-spin" />
              <span className="text-zinc-600">{t("creatingEmail")}</span>
            </div>
          </Card>
        )}

        {/* Content */}
        {emails.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {emails.map((email) => (
              <EmailCard
                key={email.id}
                id={email.id}
                subject={email.subject}
                body={email.content}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CoverLetterFormModal
        modalTitle={t("modalTitle")}
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
