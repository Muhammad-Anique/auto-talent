"use client";

import {
  Clock,
  TrendingUp,
  Eye,
  ExternalLink,
  Info,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

export function DashboardSection() {
  const jobApplications = [
    {
      company: "Tesla",
      status: "Applied",
      statusColor: "bg-green-100 text-green-800",
      updatedAt: "Just now",
      jobTitle: "Engineering Manager",
      fitScore: "89 Perfect fit",
      hasInfo: false,
      action: "buttons",
    },
    {
      company: "SpaceX",
      status: "Waiting",
      statusColor: "bg-purple-100 text-purple-800",
      updatedAt: "Just now",
      jobTitle: "UX Designer",
      fitScore: "95 Perfect fit",
      hasInfo: false,
      action: "dash",
    },
    {
      company: "Netflix",
      status: "Applied",
      statusColor: "bg-green-100 text-green-800",
      updatedAt: "2 hours ago",
      jobTitle: "Senior Product Manager",
      fitScore: "95 Perfect fit",
      hasInfo: true,
      action: "buttons",
    },
    {
      company: "Stripe",
      status: "Waiting",
      statusColor: "bg-purple-100 text-purple-800",
      updatedAt: "4 hours ago",
      jobTitle: "Engineering Manager",
      fitScore: "92 Perfect fit",
      hasInfo: true,
      action: "dash",
    },
    {
      company: "Overstory",
      status: "Applied",
      statusColor: "bg-green-100 text-green-800",
      updatedAt: "1 day ago",
      jobTitle: "Head of Global HR",
      fitScore: "88 Perfect fit",
      hasInfo: true,
      action: "buttons",
    },
    {
      company: "Airbnb",
      status: "Waiting",
      statusColor: "bg-purple-100 text-purple-800",
      updatedAt: "2 days ago",
      jobTitle: "UX Design Lead",
      fitScore: "94 Perfect fit",
      hasInfo: true,
      action: "dash",
    },
    {
      company: "Meta",
      status: "Applied",
      statusColor: "bg-green-100 text-green-800",
      updatedAt: "3 days ago",
      jobTitle: "Technical Program Manager",
      fitScore: "91 Perfect fit",
      hasInfo: true,
      action: "buttons",
    },
    {
      company: "Google",
      status: "Waiting",
      statusColor: "bg-purple-100 text-purple-800",
      updatedAt: "5 days ago",
      jobTitle: "Staff Software Engineer",
      fitScore: "96 Perfect fit",
      hasInfo: true,
      action: "dash",
    },
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-transparent -mt-16 relative z-20">
      <div className="max-w-4xl mx-auto">
        {/* Background with gradient shapes */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-200 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full opacity-30 blur-xl"></div>

          {/* Main Dashboard Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header Stats */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-lg font-bold text-gray-900">
                      Applying
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Jobs</div>
                    <div className="text-lg font-bold text-gray-900">
                      42/500
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Updated</div>
                    <div className="text-lg font-bold text-gray-900">
                      5 seconds ago
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Table Section */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Jobs</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Date</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort</span>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        COMPANY NAME
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        UPDATED AT
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        JOB POSTING
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobApplications.map((job, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900">
                            {job.company}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${job.statusColor}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {job.updatedAt}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">
                              {job.jobTitle}
                            </span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-600">
                              {job.fitScore}
                            </span>
                            {job.hasInfo && (
                              <Info className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {job.action === "buttons" ? (
                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
                                Reject
                              </button>
                              <button className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors">
                                Approve
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
