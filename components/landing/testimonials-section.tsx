"use client";

import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex R",
      role: "Recent College Graduate",
      avatar: "AR",
      avatarColor: "bg-blue-100 text-blue-600",
      rating: 5,
      text: "AIApply was a lifeline. Their tools helped me identify key skills I needed to develop and connected me with the right opportunities. I landed my dream job within a month!",
      date: "Dec 17, 2024",
      highlights: ["lifeline"],
    },
    {
      name: "Carlos D.",
      role: "Mid-Career Professional",
      avatar: "CD",
      avatarColor: "bg-blue-100 text-blue-600",
      rating: 5,
      text: "The interview prep tool from AIApply was phenomenal. It used AI to analyze my speech patterns and provided personalized feedback, making me much more confident and articulate in my interviews. It really made a difference!",
      date: "Jan 10, 2025",
      highlights: ["made a difference"],
    },
    {
      name: "Gab",
      role: "",
      avatar: "G",
      avatarColor: "bg-green-100 text-green-600",
      rating: 5,
      text: "OMG. Game changer",
      date: "Nov 24, 2024",
      highlights: ["Game changer"],
    },
    {
      name: "Kathy",
      role: "",
      avatar: "K",
      avatarColor: "bg-purple-100 text-purple-600",
      rating: 5,
      text: "AIApply was excellent and really helped my job hunt - thank you!",
      date: "Mar 22, 2024",
      highlights: ["thank you!"],
    },
    {
      name: "Jess G",
      role: "",
      avatar: "JG",
      avatarColor: "bg-green-100 text-green-600",
      rating: 5,
      text: "SO GLAD I SUBSCRIBED!! Got a job in a week using the application kit and interview help.",
      date: "Jan 4, 2025",
      highlights: ["Got a job in a week"],
    },
    {
      name: "Maria G",
      role: "Career Changer",
      avatar: "MG",
      avatarColor: "bg-purple-100 text-purple-600",
      rating: 5,
      text: "Switching careers was daunting, but AIApply made it seamless. Their tailored resumes and job recommendations helped me transition smoothly into a new field. I've never felt more confident in my professional journey!",
      date: "Dec 15, 2024",
      highlights: ["seamless", "transition smoothly into a new field"],
    },
    {
      name: "Tim Kägy",
      role: "",
      avatar: "TK",
      avatarColor: "bg-blue-100 text-blue-600",
      rating: 5,
      text: "I used to dread writing cover letters, but this AI tool has made it a breeze. It's like it reads my mind and knows exactly what to say. Highly recommend!",
      date: "May 24, 2024",
      highlights: ["made it a breeze"],
    },
    {
      name: "Mia P",
      role: "",
      avatar: "MP",
      avatarColor: "bg-pink-100 text-pink-600",
      rating: 5,
      text: "Landed a $180k/year job after prepping with AIApply. Finally, a smart tool that understands my job search needs!",
      date: "Jul 22, 2024",
      highlights: ["$180k/year job"],
    },
    {
      name: "Jordan M",
      role: "Job Seeker in Tech",
      avatar: "JM",
      avatarColor: "bg-blue-100 text-blue-600",
      rating: 5,
      text: "AIApply's AI-driven resume builder helped me craft a resume that really stood out. I got callbacks from companies I've been eyeing for years. This tool is a game-changer for anyone job hunting in the tech industry!",
      date: "Jan 12, 2025",
      highlights: ["game-changer"],
    },
    {
      name: "Janee",
      role: "",
      avatar: "J",
      avatarColor: "bg-purple-100 text-purple-600",
      rating: 5,
      text: "Felt so alone, applying to hundreds of jobs and not hearing back. Finally used AIApply for cover letters and to revamp my resume and like magic starting getting invited to interviews!",
      date: "Jan 5, 2025",
      highlights: ["like magic"],
    },
    {
      name: "Nivi",
      role: "",
      avatar: "N",
      avatarColor: "bg-orange-100 text-orange-600",
      rating: 5,
      text: "Never thought I'd find a tool that makes job applications quite fun!",
      date: "Nov 29, 2024",
      highlights: ["job applications quite fun!"],
    },
    {
      name: "Ali K",
      role: "",
      avatar: "AK",
      avatarColor: "bg-indigo-100 text-indigo-600",
      rating: 5,
      text: "Was job hunting for months until I found you guys on Tik Tok. Finally, a tool that does the tedious work for me. Thanks AIApply.",
      date: "Jun 23, 2024",
      highlights: ["Thanks AIApply."],
    },
    {
      name: "Sally",
      role: "",
      avatar: "S",
      avatarColor: "bg-teal-100 text-teal-600",
      rating: 5,
      text: "AIApply's cover letter generator is a life-saver! It helped me create a professional and personalized cover letter that caught employers' attention.",
      date: "Dec 3, 2024",
      highlights: ["life-saver!"],
    },
    {
      name: "Liam T",
      role: "",
      avatar: "LT",
      avatarColor: "bg-red-100 text-red-600",
      rating: 5,
      text: "Transformed my job hunt. Seriously, it's like having a personal career coach!",
      date: "Oct 14, 2024",
      highlights: ["personal career coach!"],
    },
    {
      name: "Liam S",
      role: "Experienced Professional",
      avatar: "LS",
      avatarColor: "bg-blue-100 text-blue-600",
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
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      );
    });
    return highlightedText;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-gray-900 mb-4">
            1,000,000+ experienced job seekers
          </h2>
          <p className="text-4xl text-gray-700 font-normal">
            are using AIApply
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-fit break-inside-avoid mb-6"
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-10 h-10 ${testimonial.avatarColor} rounded-full flex items-center justify-center mr-3`}
                >
                  <span className="font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  {testimonial.role && (
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    testimonial.text,
                    testimonial.highlights
                  ),
                }}
              />
              <div className="text-sm text-gray-500">{testimonial.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
