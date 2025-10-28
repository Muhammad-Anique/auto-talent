"use client";

import { Clock, ArrowRight, Eye } from "lucide-react";

const resumeExamples = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Perfect for developers, programmers, and tech professionals",
    updatedAt: "2 days ago",
    preview: {
      name: "John Smith",
      position: "Software Engineer",
      experience: [
        { company: "Senior Developer • Tech Corp", period: "2020 - Present" },
        { company: "Full Stack Engineer • StartupXYZ", period: "2018 - 2020" },
      ],
      skills: ["React", "Node.js", "Python", "AWS"],
      gradient: "from-[#5b6949]/10 to-[#5b6949]/20",
    },
  },
  {
    id: 2,
    title: "Marketing Manager",
    description: "Ideal for marketing professionals and brand strategists",
    updatedAt: "3 days ago",
    preview: {
      name: "Sarah Johnson",
      position: "Marketing Manager",
      experience: [
        { company: "Marketing Lead • BrandCo", period: "2019 - Present" },
        { company: "Digital Marketing Agency", period: "2017 - 2018" },
      ],
      skills: ["SEO", "Analytics", "Content", "Social"],
      gradient: "from-yellow-50 to-yellow-100",
    },
  },
  {
    id: 3,
    title: "Data Analyst",
    description: "Tailored for data scientists and business analysts",
    updatedAt: "1 week ago",
    preview: {
      name: "Michael Chen",
      position: "Data Analyst",
      experience: [
        { company: "Senior Analyst • DataCorp", period: "2021 - Present" },
        { company: "Data Scientist • Analytics Inc", period: "2019 - 2021" },
      ],
      skills: ["SQL", "Python", "Tableau", "Excel"],
      gradient: "from-emerald-50 to-emerald-100",
    },
  },
  {
    id: 4,
    title: "UX Designer",
    description: "Crafted for designers and user experience professionals",
    updatedAt: "5 days ago",
    preview: {
      name: "Emma Rodriguez",
      position: "UX Designer",
      experience: [
        { company: "Senior UX Designer • DesignHub", period: "2021 - Present" },
        { company: "Product Designer • CreativeStudio", period: "2019 - 2021" },
      ],
      skills: ["Figma", "Sketch", "Prototyping", "Research"],
      gradient: "from-orange-50 to-orange-100",
    },
  },
  {
    id: 5,
    title: "Sales Manager",
    description: "Designed for sales professionals and business development",
    updatedAt: "4 days ago",
    preview: {
      name: "David Wilson",
      position: "Sales Manager",
      experience: [
        {
          company: "Regional Sales Manager • SalesCorp",
          period: "2020 - Present",
        },
        { company: "Account Executive • GrowthCo", period: "2018 - 2020" },
      ],
      skills: ["CRM", "Salesforce", "Negotiation", "B2B"],
      gradient: "from-orange-50 to-orange-100",
    },
  },
  {
    id: 6,
    title: "Project Manager",
    description: "Perfect for project managers and team leaders",
    updatedAt: "1 day ago",
    preview: {
      name: "Lisa Thompson",
      position: "Project Manager",
      experience: [
        { company: "Senior PM • TechVentures", period: "2019 - Present" },
        { company: "Project Coordinator • BuildCorp", period: "2017 - 2019" },
      ],
      skills: ["Agile", "Scrum", "Jira", "PMP"],
      gradient: "from-yellow-50 to-yellow-100",
    },
  },
];

export function ResumeExamplesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5b6949]/10 text-[#5b6949] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Eye className="w-4 h-4" />
            Professional Templates
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Resume examples that
            <span className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] bg-clip-text text-transparent">
              {" "}
              get results
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Get inspired by professional resume examples tailored to your
            industry. Each template is designed to pass ATS systems and impress
            hiring managers.
          </p>
        </div>

        {/* Resume Examples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {resumeExamples.map((example) => (
            <a
              key={example.id}
              href="/signin"
              className="bg-white rounded-2xl overflow-hidden cursor-pointer group block hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* CV Preview Area */}
              <div
                className={`h-[200px] bg-gradient-to-br ${example.preview.gradient} p-4 pb-8 relative overflow-hidden flex justify-center items-center`}
              >
                <div className="h-48 w-[280px] max-w-[280px] grid [&>*]:[grid-column:1/1] [&>*]:[grid-row:1/1] absolute bottom-0 -mb-6">
                  {/* Background layer */}
                  <div className="bg-white rounded-tl-lg rounded-tr-lg shadow-sm transform rotate-3 translate-x-1 translate-y-1 transition-transform duration-300 group-hover:rotate-6 group-hover:translate-x-2"></div>

                  {/* CV Content */}
                  <div className="bg-white text-gray-700 h-full rounded-tl-lg rounded-tr-lg px-3 py-2 text-[.5rem] leading-tight shadow-2xl z-10 transition-transform duration-300 group-hover:-rotate-2">
                    <div className="text-center mb-2">
                      <div className="font-bold text-[0.6rem]">
                        {example.preview.name}
                      </div>
                      <div className="text-gray-600">
                        {example.preview.position}
                      </div>
                    </div>

                    <div className="border-t pt-1 mb-1">
                      <div className="font-semibold text-[0.5rem] mb-1">
                        Experience
                      </div>
                      <div className="space-y-1">
                        {example.preview.experience.map((exp, index) => (
                          <div key={index}>
                            <div className="font-medium">{exp.company}</div>
                            <div className="text-gray-500">{exp.period}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-1">
                      <div className="font-semibold text-[0.5rem] mb-1">
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {example.preview.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-indigo-100 px-1 py-0.5 rounded text-[0.35rem]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{example.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {example.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated {example.updatedAt}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white font-semibold rounded-xl hover:from-[#5b6949]/90 hover:to-[#5b6949]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            View All Resume Examples
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
