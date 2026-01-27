"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  TRANSLATION_LANGUAGES,
  type TranslationLanguage,
} from "@/lib/translation-config";
import { Languages, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from "lucide-react";

interface TranslationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  targetLanguage: TranslationLanguage;
  currentLanguage: string;
  onConfirm: () => void;
}

export function TranslationDialog({
  isOpen,
  onOpenChange,
  targetLanguage,
  currentLanguage,
  onConfirm,
}: TranslationDialogProps) {
  const targetLang = TRANSLATION_LANGUAGES[targetLanguage];
  const currentLang =
    TRANSLATION_LANGUAGES[currentLanguage as TranslationLanguage] ||
    TRANSLATION_LANGUAGES.en;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl bg-gradient-to-b from-white to-zinc-50/50 border-2 border-zinc-200">
        <AlertDialogHeader>
          {/* Header with Icon and Language Flags */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5b6949]/10">
              <Languages className="w-6 h-6 text-[#5b6949]" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-2xl font-bold text-zinc-900">
                AI-Powered Translation
              </AlertDialogTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-xl">{currentLang.flag}</span>
                  <span className="font-medium">{currentLang.name}</span>
                </span>
                <ArrowRight className="w-4 h-4" />
                <span className="flex items-center gap-1.5">
                  <span className="text-xl">{targetLang.flag}</span>
                  <span className="font-medium">{targetLang.name}</span>
                </span>
              </div>
            </div>
          </div>

          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              {/* Main Description */}
              <p className="text-base text-zinc-700 leading-relaxed">
                Your resume will be professionally translated from{" "}
                <strong className="text-zinc-900">{currentLang.name}</strong> to{" "}
                <strong className="text-zinc-900">{targetLang.name}</strong> using AI-powered translation
                while preserving all formatting and structure.
              </p>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* What WILL be translated */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-sm text-emerald-900">Will be translated</h4>
                  </div>
                  <ul className="space-y-1.5 text-sm text-emerald-800">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">•</span>
                      <span>Job titles & descriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">•</span>
                      <span>Education & achievements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">•</span>
                      <span>Skills & categories</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">•</span>
                      <span>Project descriptions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-0.5">•</span>
                      <span>Cover letter & emails</span>
                    </li>
                  </ul>
                </div>

                {/* What will NOT be translated */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-sm text-blue-900">Will NOT be translated</h4>
                  </div>
                  <ul className="space-y-1.5 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Personal information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Email & phone numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Company names</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>URLs & links</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>Dates & numbers</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-amber-900">
                    This action will overwrite your current resume
                  </p>
                  <p className="text-sm text-amber-800">
                    Your resume content will be replaced with the translated version.
                    Consider downloading a copy of your current resume before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel className="border-2 border-zinc-300 hover:bg-zinc-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[#5b6949] hover:bg-[#5b6949]/90 text-white shadow-lg shadow-[#5b6949]/20 px-6"
          >
            Translate Resume
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
