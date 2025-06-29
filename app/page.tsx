import Header from '@/components/header';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
// import BlurredCircle from '@/components/ui-global/BlurredCircle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center relative bg-gradient-to-b from-[#5b6949] via-blue-300 to-[#5b6949]/90">
      <Header />
      <section className="flex-grow flex items-center justify-center w-full z-50 mt-20 px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-6xl w-full">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2">
            <div className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://img.freepik.com/free-photo/business-job-interview-concept_1421-77.jpg"
                alt="Business job interview concept"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 h-full">
            <div className="bg-white backdrop-blur-md rounded-2xl p-10 w-full text-left shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 bg-gradient-to-r from-[#5b6949] to-[#5b6949]/90 bg-clip-text text-transparent">
                AI that builds your Resume, Cover Letter & HR Email
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-[#5b6949] text-xl"><CheckCircle2 /></span>
                  <span className="text-gray-700">Create professional resumes tailored to your dream job</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#5b6949] text-xl"><CheckCircle2 /></span>
                  <span className="text-gray-700">Generate compelling cover letters that stand out</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#5b6949] text-xl"><CheckCircle2 /></span>
                  <span className="text-gray-700">Craft effective HR emails for better communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#5b6949] text-xl"><CheckCircle2 /></span>
                  <span className="text-gray-700">Get instant AI assistance with our Chrome extension</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#5b6949] text-xl"><CheckCircle2 /></span>
                  <span className="text-gray-700">Auto-apply to jobs with tailored applications</span>
                </li>
              </ul>
              <a href="/signup">
                <button className="bg-[#5b6949] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#5b6949]/90 transition">
                  Get Started
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
