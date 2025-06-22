'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

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

export default function JobsPage() {
  const [keywords, setKeywords] = useState('');
  const [locationId, setLocationId] = useState('');
  const [datePosted, setDatePosted] = useState('anyTime');
  const [sort, setSort] = useState('mostRelevant');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Fetch saved jobs for current user
    const fetchSavedJobs = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job')
        .eq('user_id', userId);

      if (data) {
        const savedIds = data.map((entry) => entry.job.id);
        setSavedJobs(savedIds);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/linkedin/job?keywords=${encodeURIComponent(
          keywords
        )}&locationId=${locationId}&datePosted=${datePosted}&sort=${sort}`
      );
      const data = await res.json();

      const jobList = data?.data?.data ?? [];
      console.log('Fetched jobs:', jobList);
      setJobs(jobList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async (job: Job) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      alert('Please log in to save jobs.');
      return;
    }

    if (savedJobs.includes(job.id)) {
      return;
    }

    const { error } = await supabase.from('saved_jobs').insert({
      user_id: userId,
      job: job,
    });

    if (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job.');
    } else {
      setSavedJobs((prev) => [...prev, job.id]);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toDateString();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Search LinkedIn Jobs</h1>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Keywords (e.g. golang, frontend)"
          className="p-3 border rounded-md col-span-2"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location ID (e.g. 92000000)"
          className="p-3 border rounded-md"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          required
        />
        <select
          value={datePosted}
          onChange={(e) => setDatePosted(e.target.value)}
          className="p-3 border rounded-md"
        >
          <option value="anyTime">Any Time</option>
          <option value="pastWeek">Past Week</option>
          <option value="pastMonth">Past Month</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 border rounded-md"
        >
          <option value="mostRelevant">Most Relevant</option>
          <option value="mostRecent">Most Recent</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition md:col-span-5"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-gray-600">Loading jobs...</p>}

      {!loading && searched && jobs.length === 0 && (
        <p className="text-center text-red-500">No jobs found.</p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="relative block bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4"
            >
              {/* Save icon */}
              <button
                onClick={() => saveJob(job)}
                className="absolute top-2 right-2 text-xl"
                title="Save job"
              >
                {savedJobs.includes(job.id) ? '❤️' : '💾'}
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
      )}
    </div>
  );
}
