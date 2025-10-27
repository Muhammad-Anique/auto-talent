"use client";

import {
  Star,
  ArrowRight,
  Users,
  CheckCircle,
  Zap,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const heroData = {
  trustpilot: {
    rating: "Excellent",
    stars: 5,
    platform: "Trustpilot",
  },
  headline: {
    part1: "Transform Your",
    part2: "Job Search",
    highlight: "Job Search",
  },
  subheadline: "with AI-Powered Automation",
  description:
    "Stop spending hours on applications. Our intelligent platform finds, applies, and optimizes your job applications automatically, so you can focus on what matters most - landing your dream role.",
  cta: {
    primary: "Start Free Trial",
    secondary: "Watch Demo",
    href: "/signup",
  },
  socialProof: {
    userCount: "50,000+ professionals",
    stars: 5,
  },
  partners: {
    title: "Trusted by professionals at leading companies",
    companies: ["Microsoft", "Google", "Amazon", "Meta", "Netflix", "Stripe"],
  },
  features: [
    "AI-Powered Job Matching",
    "Automated Applications",
    "Resume Optimization",
    "Interview Prep",
  ],
};

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-emerald-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#5b6949]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#5b6949]/5 to-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-[#5b6949]/20 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(heroData.trustpilot.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-500 fill-current"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-black">
                {heroData.trustpilot.rating} on {heroData.trustpilot.platform}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {heroData.headline.part1}
              <br />
              <span className="bg-[#5b6949] via-[#5b6949] bg-clip-text text-transparent">
                {heroData.headline.highlight}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-[#5b6949] font-semibold mb-4">
              {heroData.subheadline}
            </p>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
              {heroData.description}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {heroData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[#5b6949]/20"
                >
                  <CheckCircle className="w-4 h-4 text-[#5b6949]" />
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href={heroData.cta.href}>
                <button className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-[#5b6949]/90 hover:to-[#5b6949]/90 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl">
                  {heroData.cta.primary}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="bg-white/80 backdrop-blur-sm text-[#5b6949] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2 border border-[#5b6949]/20 shadow-sm hover:shadow-md">
                {heroData.cta.secondary}
                <Zap className="w-5 h-5" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-[#5b6949] to-[#5b6949] rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(heroData.socialProof.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-500 fill-current"
                  />
                ))}
                <span className="text-black font-medium ml-2">
                  Trusted by {heroData.socialProof.userCount}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-yellow-50/30 rounded-3xl"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#5b6949]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-100/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10 space-y-6">
                {/* Dashboard Title */}
                <div className="text-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    Live Dashboard
                  </h3>
                  <p className="text-sm text-gray-500">
                    Real-time job application tracking
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
                      Active
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
                      Applications Sent
                    </div>
                    <div className="text-xs text-[#5b6949]/70 mt-1">
                      +23 this week
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
                      Interviews
                    </div>
                    <div className="text-xs text-yellow-500 mt-1">
                      4.9% success rate
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
                          Applied
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#5b6949] rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          Perfect Match
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
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
                          Pending
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">
                          High Match
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">1 day ago</div>
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
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-500 mb-8">
            {heroData.partners.title}
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            {heroData.partners.companies.map((company, index) => (
              <div key={index} className="text-gray-400 font-semibold text-sm">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
