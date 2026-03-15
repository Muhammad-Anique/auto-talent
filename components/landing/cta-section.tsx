"use client";

import Link from "next/link";
import { Star, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

const staticData = {
  button: {
    href: "/signin",
  },
  trustpilot: {
    stars: 5,
  },
  socialProof: {
    stars: 5,
  },
};

export function CTASection() {
  const { t } = useLocale();
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#5b6949] relative overflow-hidden">
      {/* Banner Background Pattern */}
      <div className="absolute inset-0">
        {/* Diagonal stripes pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-1"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent transform skew-y-1"></div>

        {/* Corner accent elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#5b6949]/50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        {/* Banner border effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          {/* Main Content */}
          <div className="mb-8 sm:mb-10 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg">
              {t("cta.title")}
            </h2>
            <p className="text-gray-800 sm:text-lg text-white/95 mb-2 sm:mb-3 font-medium">
              {t("cta.subtitle")}
            </p>
            <p className="text-sm sm:text-gray-800 text-white/85 max-w-2xl mx-auto leading-relaxed">
              {t("cta.description")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 px-4">
            <Link href={staticData.button.href} className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-[#5b6949] px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-gray-800 sm:text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                {t("cta.primary")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-gray-800 sm:text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 border border-white/30 shadow-lg">
              {t("cta.secondary")}
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
            {[
              t("cta.features.0"),
              t("cta.features.1"),
              t("cta.features.2"),
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/25 shadow-md"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="text-white text-xs sm:text-sm font-medium">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            {/* Trustpilot Rating */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/25 shadow-md">
              <span className="text-white font-medium text-xs sm:text-sm">
                {t("hero.trustpilotRating")}
              </span>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[...Array(staticData.trustpilot.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current"
                  />
                ))}
              </div>
              <span className="text-white text-xs">
                {t("hero.trustpilotPlatform")}
              </span>
            </div>

            {/* User Count */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/15 backdrop-blur-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/25 shadow-md">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-white to-white/80 rounded-full border border-white/30"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#5b6949]/80 to-[#5b6949] rounded-full border border-white/30"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-white/60 to-white/40 rounded-full border border-white/30"></div>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[...Array(staticData.socialProof.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-current"
                  />
                ))}
                <span className="text-white font-medium text-xs sm:text-sm ml-0.5 sm:ml-1">
                  {t("cta.trustedBy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
