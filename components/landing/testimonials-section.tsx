"use client";

import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    // English Testimonials (5)
    {
      name: "Alex R",
      role: "Recent Graduate",
      avatar: "AR",
      avatarImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "AutoTalent was a lifesaver! I got hired within 3 weeks of using the auto-apply feature. Absolute game-changer for my job search.",
      date: "Jan 15, 2025",
      highlights: ["lifesaver", "got hired", "game-changer"],
      lang: "en",
    },
    {
      name: "Sarah M",
      role: "Marketing Professional",
      avatar: "SM",
      avatarImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      rating: 5,
      text: "Like magic! I applied to 200+ jobs in one click and landed 5 interviews. AutoTalent completely transformed my job hunt.",
      date: "Jan 10, 2025",
      highlights: ["magic", "transformed"],
      lang: "en",
    },
    {
      name: "James L",
      role: "Software Engineer",
      avatar: "JL",
      avatarImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      rating: 5,
      text: "The AI interview assistant is incredible. I felt so prepared and confident. Got my dream job at a top tech company!",
      date: "Dec 28, 2024",
      highlights: ["incredible", "dream job"],
      lang: "en",
    },
    {
      name: "Emily K",
      role: "Career Changer",
      avatar: "EK",
      avatarImg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-pink-400 to-pink-500",
      rating: 5,
      text: "Switching careers felt impossible until I found AutoTalent. The resume builder created a perfect CV that got me hired fast!",
      date: "Jan 5, 2025",
      highlights: ["got me hired"],
      lang: "en",
    },
    {
      name: "Michael T",
      role: "Project Manager",
      avatar: "MT",
      avatarImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-indigo-400 to-indigo-500",
      rating: 5,
      text: "Best investment for my career. AutoTalent's tools are a total game-changer. Highly recommend to anyone job hunting!",
      date: "Jan 12, 2025",
      highlights: ["game-changer"],
      lang: "en",
    },
    // Swedish Testimonials (5)
    {
      name: "Erik S",
      role: "Nyexaminerad",
      avatar: "ES",
      avatarImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "AutoTalent var en livräddare! Fick jobb inom två veckor. En total game-changer för mitt jobbsökande.",
      date: "Jan 14, 2025",
      highlights: ["livräddare", "game-changer"],
      lang: "sv",
    },
    {
      name: "Anna L",
      role: "Marknadsförare",
      avatar: "AL",
      avatarImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      rating: 5,
      text: "Som magi! Sökte 150 jobb med ett klick och fick 4 intervjuer. Helt fantastiskt verktyg!",
      date: "Jan 8, 2025",
      highlights: ["magi", "fantastiskt"],
      lang: "sv",
    },
    {
      name: "Johan K",
      role: "Systemutvecklare",
      avatar: "JK",
      avatarImg: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      rating: 5,
      text: "AI-intervjuassistenten är otrolig. Kände mig superförberedd. Fick mitt drömjobb tack vare AutoTalent!",
      date: "Dec 20, 2024",
      highlights: ["otrolig", "drömjobb"],
      lang: "sv",
    },
    {
      name: "Lisa M",
      role: "Projektledare",
      avatar: "LM",
      avatarImg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-pink-400 to-pink-500",
      rating: 5,
      text: "Bästa investeringen för min karriär. Blev anställd på drömföretaget efter bara en månad!",
      date: "Jan 3, 2025",
      highlights: ["Blev anställd"],
      lang: "sv",
    },
    {
      name: "Oscar N",
      role: "Dataanalytiker",
      avatar: "ON",
      avatarImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-teal-400 to-teal-500",
      rating: 5,
      text: "AutoTalent förändrade allt. CV-byggaren skapade ett perfekt CV som öppnade alla dörrar. Magiskt!",
      date: "Jan 11, 2025",
      highlights: ["Magiskt"],
      lang: "sv",
    },
    // Arabic Testimonials (5)
    {
      name: "أحمد م",
      role: "خريج جديد",
      avatar: "أم",
      avatarImg: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-[#5b6949] to-[#5b6949]/80",
      rating: 5,
      text: "AutoTalent كان منقذاً لحياتي المهنية! حصلت على وظيفة خلال أسبوعين. أداة رائعة غيرت قواعد اللعبة!",
      date: "Jan 13, 2025",
      highlights: ["منقذاً", "غيرت قواعد اللعبة"],
      lang: "ar",
    },
    {
      name: "فاطمة ع",
      role: "مديرة تسويق",
      avatar: "فع",
      avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      rating: 5,
      text: "كالسحر! تقدمت لـ 200 وظيفة بنقرة واحدة وحصلت على 6 مقابلات. AutoTalent حول بحثي عن عمل تماماً!",
      date: "Jan 9, 2025",
      highlights: ["كالسحر"],
      lang: "ar",
    },
    {
      name: "محمد ك",
      role: "مهندس برمجيات",
      avatar: "مك",
      avatarImg: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-emerald-400 to-emerald-500",
      rating: 5,
      text: "مساعد المقابلات الذكي مذهل! شعرت بثقة كبيرة وحصلت على وظيفة أحلامي في شركة تقنية كبرى!",
      date: "Dec 25, 2024",
      highlights: ["مذهل", "وظيفة أحلامي"],
      lang: "ar",
    },
    {
      name: "نورة س",
      role: "محللة بيانات",
      avatar: "نس",
      avatarImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-pink-400 to-pink-500",
      rating: 5,
      text: "أفضل استثمار لمسيرتي المهنية. تم توظيفي بسرعة بفضل أدوات AutoTalent الرائعة!",
      date: "Jan 6, 2025",
      highlights: ["تم توظيفي"],
      lang: "ar",
    },
    {
      name: "خالد ر",
      role: "مدير مشاريع",
      avatar: "خر",
      avatarImg: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=faces&auto=format",
      avatarColor: "bg-gradient-to-br from-indigo-400 to-indigo-500",
      rating: 5,
      text: "AutoTalent غير كل شيء! منشئ السيرة الذاتية أنشأ سيرة مثالية فتحت لي كل الأبواب. سحري!",
      date: "Jan 10, 2025",
      highlights: ["سحري"],
      lang: "ar",
    },
  ];

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text;
    highlights.forEach((highlight) => {
      const regex = new RegExp(`(${highlight})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 text-gray-900 font-semibold px-0.5 rounded">$1</mark>',
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Trusted by 1M+ job seekers
          </h2>
          <p className="text-gray-800 sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Join thousands who&apos;ve transformed their careers with AutoTalent
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              dir={testimonial.lang === "ar" ? "rtl" : "ltr"}
              className={`group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#5b6949]/20 ${testimonial.lang === "ar" ? "text-right" : ""}`}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-16 h-16 text-[#5b6949]" />
              </div>

              {/* Header */}
              <div className="flex items-start gap-4 mb-4 relative">
                <div className="w-12 h-12 rounded-xl shrink-0 shadow-sm overflow-hidden">
                  <img
                    src={testimonial.avatarImg}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
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
                    testimonial.highlights,
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
