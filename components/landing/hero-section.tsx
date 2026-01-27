"use client";

import {
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";

const staticData = {
  trustpilot: {
    stars: 5,
  },
  cta: {
    href: "/signup",
  },
  socialProof: {
    stars: 5,
  },
  partners: {
    companies: ["Microsoft", "Google", "Amazon", "Meta", "Netflix", "Stripe"],
  },
};

export function HeroSection() {
  const { t } = useLocale();
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-emerald-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#5b6949]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#5b6949]/5 to-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#5b6949]/20 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(staticData.trustpilot.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-500 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-black">
                {t("hero.trustpilotRating")} on {t("hero.trustpilotPlatform")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {t("hero.headlinePart1")}
              <br />
              <span className="bg-[#5b6949] via-[#5b6949] bg-clip-text text-transparent">
                {t("hero.headlineHighlight")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-800 sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              {t("hero.description")}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[
                t("hero.features.atsOptimized"),
                t("hero.features.resumeCvBuilder"),
                t("hero.features.autoApply"),
                t("hero.features.aiJobMatching"),
                t("hero.features.interviewAssistant"),
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 sm:gap-2 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#5b6949]/20"
                >
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5b6949]" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link href={staticData.cta.href} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-gray-800 sm:text-lg font-semibold hover:from-[#5b6949]/90 hover:to-[#5b6949]/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-white/80 backdrop-blur-sm text-[#5b6949] px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-gray-800 sm:text-lg font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 border border-[#5b6949]/20 shadow-sm hover:shadow-md">
                {t("hero.ctaSecondary")}
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#5b6949] to-[#5b6949] rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(staticData.socialProof.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-current"
                  />
                ))}
                <span className="text-sm sm:text-gray-800 text-black font-medium ml-1 sm:ml-2">
                  {t("hero.trustedBy")} {t("hero.userCount")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-yellow-50/30 rounded-3xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5b6949]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10 space-y-6">
                {/* Dashboard Title */}
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {t("hero.dashboard.title")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("hero.dashboard.subtitle")}
                  </p>
                </div>

                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#5b6949] to-[#5b6949] rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      AutoTalent
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#5b6949] rounded-full animate-pulse"></div>
                    <span className="text-xs text-[#5b6949] font-medium">
                      {t("hero.dashboard.active")}
                    </span>
                  </div>
                </div>

                {/* Mock Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-[#5b6949]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#5b6949] to-[#5b6949] rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-2 h-2 bg-[#5b6949] rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl font-bold text-[#5b6949] mb-1">
                      247
                    </div>
                    <div className="text-sm font-medium text-[#5b6949]">
                      {t("hero.dashboard.applicationsSent")}
                    </div>
                    <div className="text-xs text-[#5b6949]/70 mt-1">
                      {t("hero.dashboard.thisWeek")}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-700 mb-1">
                      12
                    </div>
                    <div className="text-sm font-medium text-yellow-600">
                      {t("hero.dashboard.interviews")}
                    </div>
                    <div className="text-xs text-yellow-500 mt-1">
                      {t("hero.dashboard.successRate")}
                    </div>
                  </div>
                </div>

                {/* Mock Job Cards */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5 border border-[#5b6949]/30 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#5b6949] to-[#5b6949] rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            MS
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg group-hover:text-[#5b6949] transition-colors">
                            Senior Developer
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <span className="font-medium">Microsoft</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-[#5b6949] font-medium">
                              Remote
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#5b6949] rounded-full animate-pulse"></div>
                        <span className="text-xs text-[#5b6949] font-medium">
                          {t("hero.dashboard.applied")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#5b6949] rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          {t("hero.dashboard.perfectMatch")}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{t("hero.dashboard.hoursAgo")}</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            GO
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg group-hover:text-yellow-700 transition-colors">
                            Product Manager
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <span className="font-medium">Google</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-yellow-600 font-medium">
                              San Francisco
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-yellow-600 font-medium">
                          {t("hero.dashboard.pending")}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          {t("hero.dashboard.highMatch")}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{t("hero.dashboard.dayAgo")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#5b6949] to-[#5b6949] rounded-2xl rotate-12 opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl -rotate-12 opacity-20"></div>
          </div>
        </div>

        {/* Partner Companies */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-8 px-4">
            {t("hero.partnersTitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 opacity-60 px-4">
            {staticData.partners.companies.map((company: string, index: number) => (
              <div
                key={index}
                className="text-gray-400 font-semibold text-xs sm:text-sm"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
