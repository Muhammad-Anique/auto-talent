"use client";

import {
  CheckCircle,
  ArrowRight,
  Search,
  FileText,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import Link from "next/link";

const benefitsData = [
  {
    id: 1,
    icon: Search,
    gradient: "from-[#5b6949] to-[#5b6949]",
    bgColor: "bg-[#5b6949]/10",
    textColor: "text-[#5b6949]",
  },
  {
    id: 2,
    icon: Zap,
    gradient: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
  {
    id: 3,
    icon: FileText,
    gradient: "from-[#5b6949] to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    id: 4,
    icon: MessageSquare,
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
];

export function BenefitsSection() {
  const { t } = useLocale();

  const benefits = [
    {
      ...benefitsData[0],
      title: t("benefits.intelligentMatching.title"),
      description: t("benefits.intelligentMatching.description"),
      features: [
        t("benefits.intelligentMatching.features.0"),
        t("benefits.intelligentMatching.features.1"),
        t("benefits.intelligentMatching.features.2"),
      ],
    },
    {
      ...benefitsData[1],
      title: t("benefits.automatedApplications.title"),
      description: t("benefits.automatedApplications.description"),
      features: [
        t("benefits.automatedApplications.features.0"),
        t("benefits.automatedApplications.features.1"),
        t("benefits.automatedApplications.features.2"),
      ],
    },
    {
      ...benefitsData[2],
      title: t("benefits.resumeOptimization.title"),
      description: t("benefits.resumeOptimization.description"),
      features: [
        t("benefits.resumeOptimization.features.0"),
        t("benefits.resumeOptimization.features.1"),
        t("benefits.resumeOptimization.features.2"),
      ],
    },
    {
      ...benefitsData[3],
      title: t("benefits.interviewPrep.title"),
      description: t("benefits.interviewPrep.description"),
      features: [
        t("benefits.interviewPrep.features.0"),
        t("benefits.interviewPrep.features.1"),
        t("benefits.interviewPrep.features.2"),
      ],
    },
  ];
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5b6949]/10 text-[#5b6949] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            {t("benefits.badge")}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            {t("benefits.title")}
            <span className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] bg-clip-text text-transparent">
              {" "}
              {t("benefits.titleHighlight")}
            </span>
          </h2>
          <p className="text-gray-800 sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            {t("benefits.description")}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${benefit.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className={`w-8 h-8 ${benefit.textColor}`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {benefit.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${benefit.gradient} rounded-full`}
                        ></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-[#5b6949] rounded-2xl p-12 border-2 border-[#5b6949]">
            <h3 className="text-3xl font-bold text-white mb-4">
              {t("benefits.cta.title")}
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {t("benefits.cta.description")}
            </p>
            <Link href="/signin">
              <button className="bg-white text-[#5b6949] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl hover:scale-105">
                {t("benefits.cta.button")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
