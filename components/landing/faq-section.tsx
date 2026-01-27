"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLocale();

  const faqs = [
    { question: t("faq.questions.q1.question"), answer: t("faq.questions.q1.answer") },
    { question: t("faq.questions.q2.question"), answer: t("faq.questions.q2.answer") },
    { question: t("faq.questions.q3.question"), answer: t("faq.questions.q3.answer") },
    { question: t("faq.questions.q4.question"), answer: t("faq.questions.q4.answer") },
    { question: t("faq.questions.q5.question"), answer: t("faq.questions.q5.answer") },
    { question: t("faq.questions.q6.question"), answer: t("faq.questions.q6.answer") },
    { question: t("faq.questions.q7.question"), answer: t("faq.questions.q7.answer") },
    { question: t("faq.questions.q8.question"), answer: t("faq.questions.q8.answer") },
    { question: t("faq.questions.q9.question"), answer: t("faq.questions.q9.answer") },
    { question: t("faq.questions.q10.question"), answer: t("faq.questions.q10.answer") },
    { question: t("faq.questions.q11.question"), answer: t("faq.questions.q11.answer") },
    { question: t("faq.questions.q12.question"), answer: t("faq.questions.q12.answer") },
    { question: t("faq.questions.q13.question"), answer: t("faq.questions.q13.answer") },
    { question: t("faq.questions.q14.question"), answer: t("faq.questions.q14.answer") },
    { question: t("faq.questions.q15.question"), answer: t("faq.questions.q15.answer") },
    { question: t("faq.questions.q16.question"), answer: t("faq.questions.q16.answer") },
    { question: t("faq.questions.q17.question"), answer: t("faq.questions.q17.answer") },
    { question: t("faq.questions.q18.question"), answer: t("faq.questions.q18.answer") },
    { question: t("faq.questions.q19.question"), answer: t("faq.questions.q19.answer") },
    { question: t("faq.questions.q20.question"), answer: t("faq.questions.q20.answer") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            {t("faq.title")}
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-gray-800 sm:text-lg font-semibold text-gray-900 pr-3 sm:pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <p className="text-sm sm:text-gray-800 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
