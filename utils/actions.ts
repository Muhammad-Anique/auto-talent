'use server'

import { createClient } from "@/utils/supabase/server";
import { Profile, Resume } from "@/lib/types";

interface DashboardData {
  profile: Profile | null;
  baseResumes: Resume[];
  tailoredResumes: Resume[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('User not authenticated');
  }

  try {
    // Fetch profile data and user's profile_pic
    let profile;
    const [profileResult, userResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('users')
        .select('profile_pic')
        .eq('id', user.id)
        .single()
    ]);

    const { data, error: profileError } = profileResult;
    profile = data;

    // Merge user's profile_pic into profile if profile doesn't have one
    if (profile && !profile.profile_pic && userResult.data?.profile_pic) {
      profile.profile_pic = userResult.data.profile_pic;
    }

    // If profile doesn't exist, create one
    if (profileError?.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          user_id: user.id,
          first_name: null,
          last_name: null,
          email: user.email,
          phone_number: null,
          location: null,
          website: null,
          linkedin_url: null,
          github_url: null,
          work_experience: [],
          education: [],
          skills: [],
          projects: [],
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw new Error('Error creating user profile');
      }

      profile = newProfile;
    } else if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw new Error('Error fetching dashboard data');
    }

    // Fetch resumes data
    const { data: resumes, error: resumesError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id);

    if (resumesError) {
      console.error('Error fetching resumes:', resumesError);
      throw new Error('Error fetching dashboard data');
    }

    const baseResumes = resumes?.filter(resume => resume.is_base_resume) ?? [];
    const tailoredResumes = resumes?.filter(resume => !resume.is_base_resume) ?? [];

    const baseResumesData = baseResumes.map(resume => ({
      ...resume,
      type: 'base' as const
    }));

    const tailoredResumesData = tailoredResumes.map(resume => ({
      ...resume,
      type: 'tailored' as const
    }));

    return {
      profile,
      baseResumes: baseResumesData,
      tailoredResumes: tailoredResumesData
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'User not authenticated') {
      return {
        profile: null,
        baseResumes: [],
        tailoredResumes: []
      };
    }
    throw error;
  }
}




