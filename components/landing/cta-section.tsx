"use client";

import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

const ctaData = {
  title: "Do More Than Just Look for Work",
  description: "Submit more applications in less time with AI Apply.",
  button: {
    text: "Auto Apply Now",
    href: "/signup",
  },
  trustpilot: {
    rating: "Excellent",
    stars: 5,
    platform: "Trustpilot",
  },
  socialProof: {
    userCount: "1,005,991 users",
    stars: 5,
  },
};

export function CTASection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA Card */}
        <div className="bg-[#5b6949] rounded-2xl p-12 text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {ctaData.title}
          </h2>

          {/* Description */}
          <p className="text-xl text-white/90 mb-8">{ctaData.description}</p>

          {/* CTA Button */}
          <Link href={ctaData.button.href}>
            <button className="bg-green-400 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-500 transition-colors flex items-center gap-2 mx-auto mb-8">
              {ctaData.button.text}
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>

          {/* Social Proof Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Trustpilot Rating */}
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                {ctaData.trustpilot.rating}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(ctaData.trustpilot.stars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-green-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-white text-sm">
                {ctaData.trustpilot.platform}
              </span>
            </div>

            {/* User Count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(ctaData.socialProof.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-white fill-current" />
                ))}
                <span className="text-white font-medium ml-2">
                  Loved by {ctaData.socialProof.userCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
