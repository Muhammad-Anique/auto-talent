import { createClient } from '@/utils/supabase/server';

export interface UserContext {
  userId: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone_number: string | null;
    location: string | null;
    website: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    work_experience: unknown[];
    education: unknown[];
    skills: unknown[];
    projects: unknown[];
  } | null;
  recentResumes: Array<{
    id: string;
    name: string;
    target_role: string;
    is_base_resume: boolean;
    created_at: string;
  }>;
  recentCoverLetters: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  recentEmails: Array<{
    id: string;
    title: string;
    subject: string;
    created_at: string;
  }>;
  savedJobsCount: number;
  plan: string;
  profilePic: string | null;
}

export async function loadUserContext(): Promise<UserContext> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch all context in parallel
  const [profileRes, resumesRes, coverLettersRes, emailsRes, savedJobsRes, userRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name, email, phone_number, location, website, linkedin_url, github_url, work_experience, education, skills, projects')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('resumes')
      .select('id, name, target_role, is_base_resume, created_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10),
    supabase
      .from('cover_letters')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('email_hr')
      .select('id, title, subject, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('saved_jobs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('users')
      .select('plan_sub, profile_pic')
      .eq('id', user.id)
      .single(),
  ]);

  return {
    userId: user.id,
    profile: profileRes.data || null,
    recentResumes: resumesRes.data || [],
    recentCoverLetters: coverLettersRes.data || [],
    recentEmails: (emailsRes.data || []) as Array<{ id: string; title: string; subject: string; created_at: string }>,
    savedJobsCount: savedJobsRes.count || 0,
    plan: userRes.data?.plan_sub || 'free',
    profilePic: userRes.data?.profile_pic || null,
  };
}

export function formatUserContextForPrompt(ctx: UserContext): string {
  const parts: string[] = [];

  if (ctx.profile) {
    const p = ctx.profile;
    const name = [p.first_name, p.last_name].filter(Boolean).join(' ');
    const hasBasicInfo = !!(name || p.email);
    const hasExperience = Array.isArray(p.work_experience) && p.work_experience.length > 0;
    const hasEducation = Array.isArray(p.education) && p.education.length > 0;
    const profileIsEmpty = !hasBasicInfo && !hasExperience && !hasEducation;

    parts.push(`## User Profile`);

    if (profileIsEmpty) {
      parts.push(`⚠️ **PROFILE IS EMPTY** — The user has not set up their profile yet. Proactively offer to help them import their data (LinkedIn, PDF upload, paste text, or manual entry).`);
    } else {
      if (name) parts.push(`- Name: ${name}`);
      if (p.email) parts.push(`- Email: ${p.email}`);
      if (p.phone_number) parts.push(`- Phone: ${p.phone_number}`);
      if (p.location) parts.push(`- Location: ${p.location}`);
      if (p.linkedin_url) parts.push(`- LinkedIn: ${p.linkedin_url}`);
      if (p.github_url) parts.push(`- GitHub: ${p.github_url}`);
      if (p.website) parts.push(`- Website: ${p.website}`);
      if (ctx.profilePic) parts.push(`- Profile Picture URL: ${ctx.profilePic}`);

      if (Array.isArray(p.skills) && p.skills.length > 0) {
        parts.push(`- Skills: ${JSON.stringify(p.skills)}`);
      }
      if (hasExperience) {
        parts.push(`- Work Experience: ${p.work_experience.length} entries (use get_user_profile tool for details)`);
      }
      if (hasEducation) {
        parts.push(`- Education: ${p.education.length} entries`);
      }

      // Flag partial profile
      if (!hasExperience || !hasEducation) {
        const missing = [];
        if (!hasExperience) missing.push('work experience');
        if (!hasEducation) missing.push('education');
        if (!Array.isArray(p.skills) || p.skills.length === 0) missing.push('skills');
        parts.push(`- ⚠️ Missing: ${missing.join(', ')} — offer to help fill these in`);
      }
    }
  } else {
    parts.push(`## User Profile`);
    parts.push(`⚠️ **NO PROFILE FOUND** — The user has not created a profile yet. Proactively offer onboarding options.`);
  }

  if (ctx.recentResumes.length > 0) {
    parts.push(`\n## User's Resumes (${ctx.recentResumes.length} total)`);
    ctx.recentResumes.forEach(r => {
      parts.push(`- "${r.name}" (${r.target_role}) [${r.is_base_resume ? 'Base' : 'Tailored'}] id=${r.id}`);
    });
  }

  if (ctx.recentCoverLetters.length > 0) {
    parts.push(`\n## User's Cover Letters (${ctx.recentCoverLetters.length} total)`);
    ctx.recentCoverLetters.forEach(c => {
      parts.push(`- "${c.title}" id=${c.id}`);
    });
  }

  if (ctx.recentEmails.length > 0) {
    parts.push(`\n## User's Follow-Up Emails (${ctx.recentEmails.length} total)`);
    ctx.recentEmails.forEach(e => {
      parts.push(`- "${e.title}" (${e.subject}) id=${e.id}`);
    });
  }

  parts.push(`\n## Account`);
  parts.push(`- Plan: ${ctx.plan}`);
  parts.push(`- Saved Jobs: ${ctx.savedJobsCount}`);

  return parts.join('\n');
}
