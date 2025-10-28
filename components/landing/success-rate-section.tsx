"use client";

import {
  FileText,
  Mail,
  ClipboardList,
  User,
  Mic,
  Languages,
} from "lucide-react";

const toolsData = [
  {
    id: 1,
    icon: FileText,
    title: "AI-Powered Resume Creator",
    description:
      "Streamline your job search with our AI-driven resume builder. It customizes your resume for each application.",
  },
  {
    id: 2,
    icon: Mail,
    title: "Intelligent Cover Letter Generator",
    description:
      "Our AI generates personalized cover letters for each job application, helping you stand out and increasing your likelihood of landing interviews.",
  },
  {
    id: 3,
    icon: ClipboardList,
    title: "Automated Job Applications",
    description:
      "Let our AI automatically apply to thousands of job opportunities for you. This saves you valuable time and speeds up the hiring process.",
  },
  {
    id: 4,
    icon: User,
    title: "AI Interview Simulator",
    description:
      "Prepare for job interviews with AI-generated simulations that provide feedback and help you build confidence before the real thing.",
  },
  {
    id: 5,
    icon: Mic,
    title: "Real-Time Interview Assistance",
    description:
      "Receive instant feedback and support during interviews with our AI-powered Interview Buddy, ensuring you answer questions effectively.",
  },
  {
    id: 6,
    icon: Languages,
    title: "Resume Translator",
    description:
      "Automatically translate your resume into multiple languages, expanding your job search globally and improving your chances of landing a role.",
  },
];

const sectionData = {
  title: {
    part1: "You are",
    highlight: "80% More Likely",
    part2: "to",
    part3: "Secure a Job with Auto Apply",
  },
  description:
    "Leverage Our Cutting-Edge AI Tools Designed Specifically for Job Seekers",
};

export function SuccessRateSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-4">
          {sectionData.title.part1}{" "}
          <span className="text-[#5b6949]">{sectionData.title.highlight}</span>{" "}
          {sectionData.title.part2}
        </h2>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
          {sectionData.title.part3}
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 px-4">
          {sectionData.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {toolsData.map((tool, index) => {
            const IconComponent = tool.icon;
            const isEven = index % 2 === 0;
            return (
              <div
                key={tool.id}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-12 h-12 ${
                    isEven
                      ? "bg-gradient-to-r from-[#5b6949]/10 to-[#5b6949]/20"
                      : "bg-gradient-to-r from-yellow-100 to-yellow-200"
                  } rounded-lg flex items-center justify-center mb-4 mx-auto`}
                >
                  <IconComponent
                    className={`w-6 h-6 ${
                      isEven ? "text-[#5b6949]" : "text-yellow-600"
                    }`}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-700">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
