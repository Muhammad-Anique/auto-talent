"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  gradient: string;
  popular?: boolean;
}

const tierStyles = [
  {
    gradient: "from-[#5b6949]/80 to-[#5b6949]/80",
  },
  {
    gradient: "from-[#5b6949]/80 to-yellow-500/80",
    popular: true,
  },
  {
    gradient: "from-yellow-500/80 to-orange-500/80",
  },
];

export function PricingSection() {
  const { t } = useLocale();

  const tiers: PricingTier[] = [
    {
      name: t("pricing.tiers.small.name"),
      price: t("pricing.tiers.small.price"),
      description: t("pricing.tiers.small.description"),
      gradient: tierStyles[0].gradient,
      features: [
        { text: t("pricing.tiers.small.features.0"), included: true },
        { text: t("pricing.tiers.small.features.1"), included: true },
        { text: t("pricing.tiers.small.features.2"), included: true },
        { text: t("pricing.tiers.small.features.3"), included: true },
      ],
      buttonText: t("pricing.getStarted"),
    },
    {
      name: t("pricing.tiers.starter.name"),
      price: t("pricing.tiers.starter.price"),
      description: t("pricing.tiers.starter.description"),
      gradient: tierStyles[1].gradient,
      popular: tierStyles[1].popular,
      features: [
        { text: t("pricing.tiers.starter.features.0"), included: true },
        { text: t("pricing.tiers.starter.features.1"), included: true },
        { text: t("pricing.tiers.starter.features.2"), included: true },
        { text: t("pricing.tiers.starter.features.3"), included: true },
      ],
      buttonText: t("pricing.getStarted"),
    },
    {
      name: t("pricing.tiers.pro.name"),
      price: t("pricing.tiers.pro.price"),
      description: t("pricing.tiers.pro.description"),
      gradient: tierStyles[2].gradient,
      features: [
        { text: t("pricing.tiers.pro.features.0"), included: true },
        { text: t("pricing.tiers.pro.features.1"), included: true },
        { text: t("pricing.tiers.pro.features.2"), included: true },
        { text: t("pricing.tiers.pro.features.3"), included: true },
      ],
      buttonText: t("pricing.getStarted"),
    },
  ];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5b6949]/10 text-[#5b6949] px-4 py-2 rounded-full text-sm font-medium mb-6">
            💰 {t("pricing.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            {t("pricing.title")}
            <span className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] bg-clip-text text-transparent">
              {" "}
              {t("pricing.titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-800 sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("pricing.description")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group",
                tier.popular && "lg:scale-105 lg:-mt-4 z-10",
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    {t("pricing.mostPopular")}
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "h-full rounded-2xl p-6 sm:p-8 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2",
                  tier.popular
                    ? "bg-white border-2 border-[#5b6949]/30 shadow-xl"
                    : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300",
                )}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-gray-800 sm:text-lg text-gray-500 ml-2">
                      {tier.name === t("pricing.tiers.small.name")
                        ? t("pricing.perForever")
                        : tier.name === t("pricing.tiers.pro.name")
                        ? t("pricing.perOneTime")
                        : t("pricing.perMonth")}
                    </span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                          feature.included
                            ? "bg-gradient-to-r from-[#5b6949] to-[#5b6949]"
                            : "bg-gray-200",
                        )}
                      >
                        <Check
                          className={cn(
                            "w-3 h-3",
                            feature.included ? "text-white" : "text-gray-400",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          feature.included ? "text-gray-700" : "text-gray-400",
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                    tier.popular
                      ? "bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white hover:from-[#5b6949]/90 hover:to-[#5b6949]/90 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
                  )}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
