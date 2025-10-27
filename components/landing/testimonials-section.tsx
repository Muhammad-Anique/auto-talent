"use client";

import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex R",
      role: "Recent College Graduate",
      avatar: "AR",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "AIApply was a lifeline. Their tools helped me identify key skills I needed to develop and connected me with the right opportunities. I landed my dream job within a month!",
      date: "Dec 17, 2024",
      highlights: ["lifeline"],
    },
    {
      name: "Carlos D.",
      role: "Mid-Career Professional",
      avatar: "CD",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "The interview prep tool from AIApply was phenomenal. It used AI to analyze my speech patterns and provided personalized feedback, making me much more confident and articulate in my interviews. It really made a difference!",
      date: "Jan 10, 2025",
      highlights: ["made a difference"],
    },
    {
      name: "Gab",
      role: "",
      avatar: "G",
      avatarColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      rating: 5,
      text: "OMG. Game changer",
      date: "Nov 24, 2024",
      highlights: ["Game changer"],
    },
    {
      name: "Kathy",
      role: "",
      avatar: "K",
      avatarColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      rating: 5,
      text: "AIApply was excellent and really helped my job hunt - thank you!",
      date: "Mar 22, 2024",
      highlights: ["thank you!"],
    },
    {
      name: "Jess G",
      role: "",
      avatar: "JG",
      avatarColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      rating: 5,
      text: "SO GLAD I SUBSCRIBED!! Got a job in a week using the application kit and interview help.",
      date: "Jan 4, 2025",
      highlights: ["Got a job in a week"],
    },
    {
      name: "Maria G",
      role: "Career Changer",
      avatar: "MG",
      avatarColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      rating: 5,
      text: "Switching careers was daunting, but AIApply made it seamless. Their tailored resumes and job recommendations helped me transition smoothly into a new field. I've never felt more confident in my professional journey!",
      date: "Dec 15, 2024",
      highlights: ["seamless", "transition smoothly into a new field"],
    },
    {
      name: "Tim Kägy",
      role: "",
      avatar: "TK",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "I used to dread writing cover letters, but this AI tool has made it a breeze. It's like it reads my mind and knows exactly what to say. Highly recommend!",
      date: "May 24, 2024",
      highlights: ["made it a breeze"],
    },
    {
      name: "Mia P",
      role: "",
      avatar: "MP",
      avatarColor: "bg-gradient-to-br from-pink-400 to-pink-500",
      rating: 5,
      text: "Landed a $180k/year job after prepping with AIApply. Finally, a smart tool that understands my job search needs!",
      date: "Jul 22, 2024",
      highlights: ["$180k/year job"],
    },
    {
      name: "Jordan M",
      role: "Job Seeker in Tech",
      avatar: "JM",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "AIApply's AI-driven resume builder helped me craft a resume that really stood out. I got callbacks from companies I've been eyeing for years. This tool is a game-changer for anyone job hunting in the tech industry!",
      date: "Jan 12, 2025",
      highlights: ["game-changer"],
    },
    {
      name: "Janee",
      role: "",
      avatar: "J",
      avatarColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      rating: 5,
      text: "Felt so alone, applying to hundreds of jobs and not hearing back. Finally used AIApply for cover letters and to revamp my resume and like magic starting getting invited to interviews!",
      date: "Jan 5, 2025",
      highlights: ["like magic"],
    },
    {
      name: "Nivi",
      role: "",
      avatar: "N",
      avatarColor: "bg-gradient-to-br from-orange-400 to-orange-500",
      rating: 5,
      text: "Never thought I'd find a tool that makes job applications quite fun!",
      date: "Nov 29, 2024",
      highlights: ["job applications quite fun!"],
    },
    {
      name: "Ali K",
      role: "",
      avatar: "AK",
      avatarColor: "bg-gradient-to-br from-indigo-400 to-indigo-500",
      rating: 5,
      text: "Was job hunting for months until I found you guys on Tik Tok. Finally, a tool that does the tedious work for me. Thanks AIApply.",
      date: "Jun 23, 2024",
      highlights: ["Thanks AIApply."],
    },
    {
      name: "Sally",
      role: "",
      avatar: "S",
      avatarColor: "bg-gradient-to-br from-teal-400 to-teal-500",
      rating: 5,
      text: "AIApply's cover letter generator is a life-saver! It helped me create a professional and personalized cover letter that caught employers' attention.",
      date: "Dec 3, 2024",
      highlights: ["life-saver!"],
    },
    {
      name: "Liam T",
      role: "",
      avatar: "LT",
      avatarColor: "bg-gradient-to-br from-red-400 to-red-500",
      rating: 5,
      text: "Transformed my job hunt. Seriously, it's like having a personal career coach!",
      date: "Oct 14, 2024",
      highlights: ["personal career coach!"],
    },
    {
      name: "Liam S",
      role: "Experienced Professional",
      avatar: "LS",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "AIApply's comprehensive approach to job searching is unmatched. From resume optimization to interview preparation, every tool is designed to give you the edge you need in today's competitive market.",
      date: "Feb 8, 2025",
      highlights: ["unmatched"],
    },
  ];

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text;
    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded">$1</mark>'
      );
    });
    return highlightedText;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#5b6949]/10 rounded-full mb-6">
            <Quote className="w-5 h-5 text-[#5b6949]" />
            <span className="text-[#5b6949] font-semibold text-sm">
              Testimonials
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Trusted by 1M+ job seekers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands who've transformed their careers with AIApply
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#5b6949]/20"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-16 h-16 text-[#5b6949]" />
              </div>

              {/* Header */}
              <div className="flex items-start gap-4 mb-4 relative">
                <div
                  className={`w-12 h-12 ${testimonial.avatarColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <span className="font-bold text-white text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 mb-0.5">
                    {testimonial.name}
                  </div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-500 truncate">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-gray-700 mb-4 leading-relaxed relative z-10"
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    testimonial.text,
                    testimonial.highlights
                  ),
                }}
              />

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">{testimonial.date}</div>
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5b6949] to-[#5b6949]/90 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
            <span>Join thousands of successful applicants</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
