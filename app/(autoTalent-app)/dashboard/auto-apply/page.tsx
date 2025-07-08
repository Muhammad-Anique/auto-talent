"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";

export default function AutoApplyDashboard() {
  const { setIsLoading } = useLoading();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // Placeholder data
  const credits = 10;
  const jobsProgress = 0;
  const jobsTotal = 10;
  const lastUpdate = "1min ago";
  const status = "Pending";

  // Placeholder for jobs list
  type Job = {
    company: string;
    status: string;
    fitScore: string | number;
    updatedAt: string;
    link: string;
  };
  const jobs: Job[] = [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl mt-2">{status}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Jobs Progress</CardDescription>
              <CardTitle className="text-2xl mt-2">{jobsProgress}/{jobsTotal}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">0% Completed</div>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Last Update</CardDescription>
              <CardTitle className="text-2xl mt-2">{lastUpdate}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Login Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Login Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-gray-100 p-6 mb-2">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m0 0H9m3 0h3" />
                </svg>
              </div>
              <div className="text-gray-500 text-sm text-center max-w-xs">
                You will be assigned a new email address in the next 72 hours to track follow-ups on applications.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="px-2 py-1 text-left">Company Name</th>
                    <th className="px-2 py-1 text-left">Status</th>
                    <th className="px-2 py-1 text-left">Job Fit score</th>
                    <th className="px-2 py-1 text-left">Updated At</th>
                    <th className="px-2 py-1 text-left">Job Posting</th>
                    <th className="px-2 py-1 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="font-semibold text-lg">Start Auto Applying</span>
                          <span className="text-gray-500 text-sm mb-2">You have {credits} credits ready to use!</span>
                          <ol className="text-gray-500 text-sm list-decimal list-inside mb-4 text-left max-w-xs mx-auto">
                            <li>Set your job preferences!</li>
                            <li>We’ll automatically apply to matching jobs</li>
                            <li>Each application uses 1 credit</li>
                          </ol>
                          <Button onClick={() => router.push("/dashboard/auto-apply/form")}>Complete Form</Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{job.company}</td>
                        <td className="px-2 py-1">{job.status}</td>
                        <td className="px-2 py-1">{job.fitScore}</td>
                        <td className="px-2 py-1">{job.updatedAt}</td>
                        <td className="px-2 py-1">{job.link}</td>
                        <td className="px-2 py-1">Action</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 