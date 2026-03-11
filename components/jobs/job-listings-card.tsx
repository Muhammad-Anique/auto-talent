'use client';

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, MapPin, Clock, DollarSign, Trash2 } from "lucide-react";
import { getJobListings, deleteJob } from "@/utils/actions/jobs/actions";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";


type WorkLocationType = 'remote' | 'in_person' | 'hybrid';
type EmploymentType = 'full_time' | 'part_time' | 'co_op' | 'internship';

interface Job {
  id: string;
  company_name: string;
  position_title: string;
  location: string | null;
  work_location: WorkLocationType | null;
  employment_type: EmploymentType | null;
  salary_range: string | null;
  created_at: string;
  keywords: string[] | null;
}

export function JobListingsCard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [workLocation, setWorkLocation] = useState<WorkLocationType | undefined>();
  const [employmentType, setEmploymentType] = useState<EmploymentType | undefined>();

  // Fetch admin status
  useEffect(() => {
    async function checkAdminStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        setIsAdmin(profile?.is_admin ?? false);
      }
    }

    checkAdminStatus();
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getJobListings({
        page: currentPage,
        pageSize: 6,
        filters: {
          workLocation,
          employmentType
        }
      });
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, workLocation, employmentType]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const formatWorkLocation = (workLocation: Job['work_location']) => {
    if (!workLocation) return 'Not specified';
    return workLocation.replace('_', ' ');
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="relative">
      <Card className="relative p-8 bg-white border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2.5 rounded-xl bg-[#5b6949]/10 border border-[#5b6949]/20">
                <Briefcase className="w-6 h-6 text-[#5b6949]" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">
                Job Listings
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Select
                value={workLocation}
                onValueChange={(value: WorkLocationType) => setWorkLocation(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-zinc-200 shadow-sm hover:border-[#5b6949]/50 transition-colors">
                  <MapPin className="w-4 h-4 mr-2 text-[#5b6949]" />
                  <SelectValue placeholder="Work Location" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={employmentType}
                onValueChange={(value: EmploymentType) => setEmploymentType(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-white border-zinc-200 shadow-sm hover:border-[#5b6949]/50 transition-colors">
                  <Briefcase className="w-4 h-4 mr-2 text-[#5b6949]" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-200">
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="co_op">Co-op</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 space-y-4 animate-pulse bg-zinc-50 border-zinc-200 rounded-xl">
                    <div className="h-5 bg-zinc-200 rounded-md w-3/4" />
                    <div className="h-4 bg-zinc-100 rounded-md w-1/2" />
                    <div className="h-4 bg-zinc-100 rounded-md w-2/3" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-zinc-100 rounded-full w-16" />
                      <div className="h-6 bg-zinc-100 rounded-full w-20" />
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="group relative p-5 space-y-4 bg-white border border-zinc-200 rounded-xl hover:border-[#5b6949]/30 hover:shadow-md transition-all duration-300 overflow-hidden">
                  {/* Subtle top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#5b6949]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="font-semibold text-base line-clamp-2 text-zinc-900 group-hover:text-[#5b6949] transition-colors duration-200">
                        {job.position_title}
                      </h3>
                      <div className="flex items-center text-zinc-600 text-sm">
                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-zinc-400 flex-shrink-0" />
                        <span className="line-clamp-1">{job.company_name}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors h-8 w-8 flex-shrink-0"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{job.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="capitalize">{formatWorkLocation(job.work_location)}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-[#5b6949]" />
                        <span className="text-zinc-700 font-medium">{job.salary_range}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>

                  {job.keywords && job.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-[11px] bg-[#5b6949]/8 text-[#5b6949] border border-[#5b6949]/15 hover:bg-[#5b6949]/15 transition-colors px-2 py-0.5"
                        >
                          {keyword}
                        </Badge>
                      ))}
                      {job.keywords.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-[11px] bg-zinc-100 text-zinc-500 border border-zinc-200 px-2 py-0.5"
                        >
                          +{job.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 pt-2"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="bg-white border-zinc-200 hover:border-[#5b6949]/50 hover:bg-[#5b6949]/5 text-zinc-700 transition-all disabled:opacity-40 px-6"
            >
              Previous
            </Button>
            <span className="text-sm text-zinc-500 font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="bg-white border-zinc-200 hover:border-[#5b6949]/50 hover:bg-[#5b6949]/5 text-zinc-700 transition-all disabled:opacity-40 px-6"
            >
              Next
            </Button>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
