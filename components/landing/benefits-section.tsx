"use client";

import { Clock, Target, Zap, Users } from "lucide-react";

const benefitsData = [
  {
    id: 1,
    title: "Hassle-Free Job Applications",
    description:
      "Forget the tedious and time-consuming task of job hunting. With Auto Apply, we handle the job application process from start to finish in just one click. Just provide us with your preferences and credentials, and we'll do the rest, applying to tailored jobs per week that match your career aspirations.",
    features: ["Time-Saving", "Stress Reduction", "Tailored Job Matches"],
    image:
      "https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/sign/images/3.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZjJjZDNkNS1jNjJmLTRiMjMtOGMwNS0zNDFlYWUyYzdlZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMy53ZWJwIiwiaWF0IjoxNzYxMTM4OTYwLCJleHAiOjE5MTg4MTg5NjB9.tBhGGRuGyEdu47vqFwGjh6XUoOgWqRc98b3rp97dq-Y",
    alt: "Hassle-Free Job Applications",
  },
  {
    id: 2,
    title: "Expert Market Scanning",
    description:
      "Our specialized algorithms scan job postings to find opportunities that best suit your skills and career goals. We ensure that no promising position passes you by, increasing your chances of landing your dream job faster.",
    features: [
      "Advanced Scanning Technology",
      "Find More Jobs Suited to Your Needs",
      "Boost Your Chances of Landing Your Ideal Position",
    ],
    image:
      "https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/sign/images/4.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZjJjZDNkNS1jNjJmLTRiMjMtOGMwNS0zNDFlYWUyYzdlZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvNC53ZWJwIiwiaWF0IjoxNzYxMTM4OTc4LCJleHAiOjE5MTg4MTg5Nzh9.X-nPZkdr_0dJwpthJdRVhfDEylqMsN4KmKLW6CPgd10",
    alt: "Expert Market Scanning",
  },
  {
    id: 3,
    title: "Enhanced Application Quality",
    description:
      "We don't just apply for you, we optimize your applications. Our artificial intelligence technology can enhance your resume and cover letters to match the job description perfectly, boosting your chances of getting noticed by employers and passing through Applicant Tracking Systems (ATS).",
    features: [
      "Resume Optimization",
      "Customized Cover Letter",
      "ATS-Friendly Job Application",
    ],
    image:
      "https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/sign/images/1.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZjJjZDNkNS1jNjJmLTRiMjMtOGMwNS0zNDFlYWUyYzdlZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMS53ZWJwIiwiaWF0IjoxNzYxMTM4ODcyLCJleHAiOjE5MTg4MTg4NzJ9.2JOSY4Z_DkjNLpZ8cRO4nlTpTLqHWoTHraGuQGIBbVQ",
    alt: "Enhanced Application Quality",
  },
  {
    id: 4,
    title: "Interview Preparation",
    description:
      "Once you've secured an interview, our AI Interview tool helps to ensure you excel no matter what you're faced with on the day. From mock interviews to question-specific guidance, we provide everything you need to make a good impression.",
    features: [
      "Mock Interviews",
      "Question Preparation",
      "Confidence Building",
    ],
    image:
      "https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/sign/images/2.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kZjJjZDNkNS1jNjJmLTRiMjMtOGMwNS0zNDFlYWUyYzdlZjMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMi53ZWJwIiwiaWF0IjoxNzYxMTM4OTY3LCJleHAiOjE5MTg4MTg5Njd9.K98fDuw1w2kTSX13u7RVmCERk9XKbsTenYVgO7SPNUA",
    alt: "Interview Preparation",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black text-gray-900 mb-4">
            Benefits of Auto Apply
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefitsData.map((benefit) => (
            <div
              key={benefit.id}
              className="bg-white rounded-xl p-6 shadow-2xl h-full"
            >
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {benefit.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full h-80 rounded-3xl mt-auto relative overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.alt}
                    className="rounded-3xl object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
