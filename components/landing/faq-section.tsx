"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What information do I need to provide to get started?",
      answer:
        "You need to upload your resume and cover letter, which you can generate using our AI-powered tools. You'll also need to input your preferences, such as the job titles, industries, and locations you're interested in.",
    },
    {
      question: "How do Auto Apply credits work?",
      answer:
        "Auto Apply credits are used for each job application we submit on your behalf. You can purchase credit packages based on your needs. Each credit typically covers one job application, and you can track your usage in your dashboard.",
    },
    {
      question: "What happens to unused credits?",
      answer:
        "Unused credits remain in your account and don't expire. You can use them anytime in the future. If you need a refund for unused credits, please contact our support team within 30 days of purchase.",
    },
    {
      question: "How does Auto Apply AI save me time?",
      answer:
        "Our AI automatically scans thousands of job postings, matches them to your profile, and submits applications on your behalf. This eliminates the need for manual job searching and application submission, saving you hours each week.",
    },
    {
      question:
        "How does Auto Apply AI make sure job matches are tailored to my career goals?",
      answer:
        "Our AI analyzes your resume, skills, experience, and preferences to find jobs that align with your career goals. It considers factors like job requirements, company culture, location preferences, and salary expectations to ensure quality matches.",
    },
    {
      question: "Can I change the types of jobs I'm applying for?",
      answer:
        "Yes, you can update your job preferences anytime through your dashboard. You can modify job titles, industries, locations, salary ranges, and other criteria. Changes take effect immediately for new applications.",
    },
    {
      question: "I'm not getting interviews, am I doing something wrong?",
      answer:
        "Not necessarily! The job market can be competitive. We can help optimize your profile, improve your resume, and adjust your application strategy. Our support team can provide personalized advice to increase your interview chances.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
