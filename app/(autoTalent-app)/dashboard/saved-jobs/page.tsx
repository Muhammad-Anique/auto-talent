'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

type Job = {
  id: string;
  title: string;
  location: string;
  postAt: string;
  url: string;
  company: {
    name: string;
    logo?: string;
  };
};

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<{ id: string; job: Job }[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTitle, setSearchTitle] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const supabase = createClient();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id, job, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load saved jobs:', error);
      } else {
        setSavedJobs(data || []);
      }

      setLoading(false);
    };

    fetchSavedJobs();
  }, []);

  const removeJob = async (id: string) => {
    const { error } = await supabase.from('saved_jobs').delete().eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      alert('Failed to remove job');
    } else {
      setSavedJobs((prev) => prev.filter((job) => job.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  // Extract unique companies and locations for dropdowns
  const companyOptions = Array.from(new Set(savedJobs.map((j) => j.job.company.name)));
  const locationOptions = Array.from(new Set(savedJobs.map((j) => j.job.location)));

  // Filter + sort logic
  const filteredJobs = savedJobs
    .filter(({ job }) =>
      job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      job.company.name.toLowerCase().includes(filterCompany.toLowerCase()) &&
      job.location.toLowerCase().includes(filterLocation.toLowerCase())
    )
    .sort((a, b) => {
      const titleA = a.job.title.toLowerCase();
      const titleB = b.job.title.toLowerCase();
      const dateA = new Date(a.job.postAt).getTime();
      const dateB = new Date(b.job.postAt).getTime();

      switch (sortBy) {
        case 'az':
          return titleA.localeCompare(titleB);
        case 'za':
          return titleB.localeCompare(titleA);
        case 'oldest':
          return dateA - dateB;
        default:
          return dateB - dateA;
      }
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Saved Jobs</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : savedJobs.length === 0 ? (
        <p className="text-center text-red-500">No saved jobs found.</p>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Search title..."
              className="p-3 border rounded-md"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />

            <select
              className="p-3 border rounded-md"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {companyOptions.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <select
              className="p-3 border rounded-md"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              className="p-3 border rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">Title A–Z</option>
              <option value="za">Title Z–A</option>
            </select>
          </div>

          {/* Job Cards */}
          <div className="grid gap-4">
            {filteredJobs.map(({ id, job }) => (
              <div
                key={id}
                className="relative bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4"
              >
                <button
                  onClick={() => removeJob(id)}
                  className="absolute top-2 right-2 text-xl text-red-600 hover:text-red-800"
                  title="Remove saved job"
                >
                  ❌
                </button>

                <Link
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center mb-2">
                    {job.company?.logo && (
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-10 h-10 object-contain mr-3"
                      />
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-blue-700">{job.title}</h2>
                      <p className="text-sm text-gray-700">{job.company.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{job.location}</p>
                  <p className="text-sm text-gray-500">Posted: {formatDate(job.postAt)}</p>
                </Link>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No jobs match your filters.</p>
          )}
        </>
      )}
    </div>
  );
}
