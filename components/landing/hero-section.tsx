"use client";

import { Star, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const heroData = {
  trustpilot: {
    rating: "Excellent",
    stars: 5,
    platform: "Trustpilot",
  },
  headline: {
    part1: "Job Applications",
    part2: "on Auto Pilot",
    highlight: "on Auto Pilot",
  },
  description:
    "Let AIApply find and apply directly to hundreds of matching jobs for you, so you can focus on interviews not applications.",
  cta: {
    text: "Auto Apply Now",
    href: "/signup",
  },
  socialProof: {
    userCount: "1,005,991 users",
    stars: 5,
  },
  partners: {
    title: "Get hired by top companies worldwide",
    companies: ["coinbase", "Spotify", "Microsoft", "Meta", "SPACEX", "Stripe"],
  },
};

export function HeroSection() {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
      {/* Background with smooth gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-pink-300 to-pink-400"></div>

      {/* Soft curved shape overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="curveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="50%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 L0,60 Q300,0 600,40 T1200,20 L1200,120 Z"
            fill="url(#curveGradient)"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Trustpilot Rating */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="text-sm font-medium text-gray-900">
              {heroData.trustpilot.rating}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(heroData.trustpilot.stars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-green-500 fill-current" />
              ))}
            </div>
            <div className="flex items-center gap-1 ml-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 text-white fill-current" />
              </div>
              <span className="text-sm text-gray-600">
                {heroData.trustpilot.platform}
              </span>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          {heroData.headline.part1}
          <br />
          <span className="bg-gradient-to-r from-[#5b6949] to-green-600 bg-clip-text text-transparent">
            {heroData.headline.highlight}
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {heroData.description}
        </p>

        {/* CTA Button */}
        <div className="mb-8">
          <Link href={heroData.cta.href}>
            <button className="bg-[#5b6949] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#5b6949]/90 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg">
              {heroData.cta.text}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(heroData.socialProof.stars)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-orange-500 fill-current" />
            ))}
            <span className="text-gray-700 font-medium ml-2">
              Loved by {heroData.socialProof.userCount}
            </span>
          </div>
        </div>

        {/* Partner Companies */}
        <div className="mb-16">
          <p className="text-sm text-gray-500 mb-4">
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
