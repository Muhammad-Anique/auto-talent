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
    title: "AI Resume Builder",
    description:
      "Tailored resumes for each application",
  },
  {
    id: 2,
    icon: Mail,
    title: "Cover Letter Generator",
    description:
      "Personalized letters to boost response rate",
  },
  {
    id: 3,
    icon: ClipboardList,
    title: "Auto Apply to Jobs",
    description:
      "Apply to hundreds of jobs in one click",
  },
  {
    id: 4,
    icon: User,
    title: "Interview Simulator",
    description:
      "Practice with mock interviews",
  },
  {
    id: 5,
    icon: Mic,
    title: "Real-Time AI Interview Assistant",
    description:
      "Get real-time help during interviews",
  },
  {
    id: 6,
    icon: Languages,
    title: "Resume Translator",
    description:
      "Translate resume into multiple languages",
  },
];

const sectionData = {
  title: "Everything You Need to Land Your Dream Job – Fast",
  description: "",
};

export function SuccessRateSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 sm:mb-12 leading-tight px-4">
          {sectionData.title.split(" – ")[0]}
          <span className="text-[#5b6949]"> – {sectionData.title.split(" – ")[1]}</span>
        </h2>

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
