"use client";

import {
  Clock,
  Target,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Brain,
  Search,
  FileText,
  MessageSquare,
} from "lucide-react";

const benefitsData = [
  {
    id: 1,
    title: "Intelligent Job Matching",
    description:
      "Our AI-powered system analyzes your skills, experience, and preferences to find the perfect job matches. No more endless scrolling through irrelevant postings.",
    features: ["Smart Algorithm", "Personalized Results", "Real-time Updates"],
    icon: Search,
    gradient: "from-[#5b6949] to-[#5b6949]",
    bgColor: "bg-[#5b6949]/10",
    textColor: "text-[#5b6949]",
  },
  {
    id: 2,
    title: "Automated Applications",
    description:
      "Apply to hundreds of jobs with a single click. Our system handles the entire application process while you focus on preparing for interviews.",
    features: [
      "One-Click Apply",
      "Bulk Applications",
      "Time-Saving Efficiency",
    ],
    icon: Zap,
    gradient: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
  },
  {
    id: 3,
    title: "Resume Optimization",
    description:
      "Get your resume tailored for each application. Our AI ensures your resume passes ATS systems and stands out to hiring managers.",
    features: [
      "ATS Optimization",
      "Custom Tailoring",
      "Professional Formatting",
    ],
    icon: FileText,
    gradient: "from-[#5b6949] to-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    id: 4,
    title: "Interview Preparation",
    description:
      "Ace your interviews with AI-powered mock sessions, personalized questions, and expert guidance tailored to your target role.",
    features: ["Mock Interviews", "Question Bank", "Performance Analytics"],
    icon: MessageSquare,
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5b6949]/10 text-[#5b6949] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Why Choose AutoTalent
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] bg-clip-text text-transparent">
              {" "}
              land your dream job
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines AI-powered automation with
            expert insights to streamline your entire job search process.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefitsData.map((benefit) => {
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
              Ready to transform your job search?
            </h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already automated their
              job search and landed their dream roles.
            </p>
            <button className="bg-white text-[#5b6949] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 mx-auto shadow-xl hover:shadow-2xl hover:scale-105">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
