"use client";

import { Star, Facebook, Instagram, Twitter, Music } from "lucide-react";

const footerData = {
  company: {
    logo: {
      icon: Star,
      text: "aiApply",
    },
    language: "us English",
    links: [
      "Post a Job on AIApply",
      "Privacy Policy",
      "Terms of Service",
      "Affiliate Program",
      "Student discount",
    ],
    badge: {
      title: "Google Cloud Partner",
      icon: "Google",
    },
  },
  tools: {
    title: "TOOLS",
    links: [
      "Auto Apply To Jobs",
      "AI Cover Letter",
      "AI Resume Builder",
      "Mock Job Interview",
      "Interview Buddy",
      "Resume Translator",
      "Job Board",
      "LinkedIn to Resume",
      "Resume Examples",
      "Cover Letter Examples",
      "AI Resume Scanner",
    ],
  },
  blog: {
    title: "BLOG",
    links: [
      "How to write a resignation letter",
      "Structuring your resume objective for a career change",
      "Should my resume be in reverse chronological order?",
      "How to make a resume for your first job",
      "All Posts",
    ],
  },
  social: [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Music, href: "#" },
  ],
  copyright: "© 2025 AIApply Limited, All rights reserved",
};

export function FooterSection() {
  return (
    <footer className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Upper Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Company Information */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <footerData.company.logo.icon className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {footerData.company.logo.text}
              </span>
            </div>

            {/* Language Button */}
            <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
              {footerData.company.language}
            </button>

            {/* Company Links */}
            <div className="space-y-2">
              {footerData.company.links.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Google Cloud Partner Badge */}
            <div className="bg-white border border-gray-300 rounded-lg p-3 inline-block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 rounded flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {footerData.company.badge.title}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Column - Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 uppercase">
              {footerData.tools.title}
            </h3>
            <div className="space-y-2">
              {footerData.tools.links.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Blog */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 uppercase">
              {footerData.blog.title}
            </h3>
            <div className="space-y-2">
              {footerData.blog.links.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="block text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-300 mb-6"></div>

        {/* Lower Section - Copyright and Social Media */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="text-gray-700 text-sm">{footerData.copyright}</div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            {footerData.social.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
