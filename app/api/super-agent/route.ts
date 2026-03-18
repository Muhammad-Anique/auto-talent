import { CoreMessage, LanguageModelV1, smoothStream, streamText, generateObject, tool as createTool } from 'ai';
import { z } from 'zod';
import { createOpenAI } from '@ai-sdk/openai';
import { createClient } from '@/utils/supabase/server';
import { loadUserContext, formatUserContextForPrompt } from '@/lib/super-agent/context';
import { buildSuperAgentSystemPrompt } from '@/lib/super-agent/prompt';
import { RESUME_TEMPLATE_INSTRUCTIONS, COVER_LETTER_TEMPLATE_INSTRUCTIONS, EMAIL_TEMPLATE_INSTRUCTIONS } from '@/lib/super-agent/artifact-templates';
import { RESUME_FORMATTER_SYSTEM_MESSAGE } from '@/lib/prompts';
import { sanitizeUnknownStrings } from '@/lib/utils';
import { SupabaseClient } from '@supabase/supabase-js';
import { ApifyClient } from 'apify-client';
import { checkCanPerformAction, recordUsage } from '@/utils/actions/subscriptions/usage';

function buildTools(supabase: SupabaseClient, userId: string) {
  return {
    get_user_profile: createTool({
      description: 'Get the current user profile including name, contact info, work experience, education, skills, and projects.',
      parameters: z.object({}),
      execute: async () => {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
        return data || { error: 'Profile not found' };
      },
    }),

    get_resumes: createTool({
      description: "List all of the user's resumes with their IDs, names, target roles, and creation dates.",
      parameters: z.object({
        limit: z.number().optional().describe('Max number of resumes to return. Default 10.'),
      }),
      execute: async ({ limit = 10 }) => {
        const { data } = await supabase
          .from('resumes')
          .select('id, name, target_role, is_base_resume, first_name, last_name, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(limit);
        return data || [];
      },
    }),

    get_resume_detail: createTool({
      description: 'Get the full content of a specific resume by ID, including all sections.',
      parameters: z.object({
        resume_id: z.string().describe('The UUID of the resume to fetch'),
      }),
      execute: async ({ resume_id }) => {
        const { data } = await supabase.from('resumes').select('*').eq('id', resume_id).eq('user_id', userId).single();
        return data || { error: 'Resume not found' };
      },
    }),

    get_cover_letters: createTool({
      description: "List all of the user's cover letters with their IDs, titles, and creation dates.",
      parameters: z.object({
        limit: z.number().optional().describe('Max number to return. Default 10.'),
      }),
      execute: async ({ limit = 10 }) => {
        const { data } = await supabase
          .from('cover_letters')
          .select('id, title, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        return data || [];
      },
    }),

    get_cover_letter_detail: createTool({
      description: 'Get the full content of a specific cover letter by ID.',
      parameters: z.object({
        cover_letter_id: z.string().describe('The UUID of the cover letter to fetch'),
      }),
      execute: async ({ cover_letter_id }) => {
        const { data } = await supabase.from('cover_letters').select('*').eq('id', cover_letter_id).eq('user_id', userId).single();
        return data || { error: 'Cover letter not found' };
      },
    }),

    get_emails: createTool({
      description: "List all of the user's follow-up emails/HR emails with their IDs, titles, subjects, and creation dates.",
      parameters: z.object({
        limit: z.number().optional().describe('Max number to return. Default 10.'),
      }),
      execute: async ({ limit = 10 }) => {
        const { data } = await supabase
          .from('email_hr')
          .select('id, title, subject, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        return data || [];
      },
    }),

    get_email_detail: createTool({
      description: 'Get the full content of a specific follow-up email by ID.',
      parameters: z.object({
        email_id: z.string().describe('The UUID of the email to fetch'),
      }),
      execute: async ({ email_id }) => {
        const { data } = await supabase.from('email_hr').select('*').eq('id', email_id).eq('user_id', userId).single();
        return data || { error: 'Email not found' };
      },
    }),

    get_saved_jobs: createTool({
      description: "Get user's saved jobs for context about what positions they're interested in.",
      parameters: z.object({
        limit: z.number().optional().describe('Max number to return. Default 10.'),
      }),
      execute: async ({ limit = 10 }) => {
        const { data } = await supabase
          .from('saved_jobs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        return data || [];
      },
    }),

    get_interview_questions: createTool({
      description: "List user's interview question sets.",
      parameters: z.object({
        limit: z.number().optional().describe('Max number to return. Default 10.'),
      }),
      execute: async ({ limit = 10 }) => {
        const { data } = await supabase
          .from('interview_questions')
          .select('id, title, description, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit);
        return data || [];
      },
    }),

    // Artifact tools — results handled client-side via onToolCall in useChat
    create_artifact: createTool({
      description: 'Create an HTML artifact to display in the artifact panel. Use this for generating resumes, cover letters, emails, or any document. The HTML must be a COMPLETE self-contained document with embedded CSS. Make it visually beautiful and professional. ALWAYS use this tool when generating any document.',
      parameters: z.object({
        type: z.enum(['resume', 'cover_letter', 'email', 'document']).describe('The type of artifact'),
        title: z.string().describe('Short title for the artifact'),
        html: z.string().describe('Complete HTML document with embedded CSS. Must include <!DOCTYPE html>, <html>, <head> with <style>, and <body>. Print-ready (8.5x11in). Professional fonts and colors.'),
        language: z.string().optional().describe('Language code. Defaults to "en".'),
        resume_id: z.string().optional().describe('If generating a resume from a specific saved resume, provide its UUID here to enable template switching on the client.'),
      }),
      // No execute — handled client-side via onToolCall in useChat so the artifact panel updates reactively
    }),

    update_artifact: createTool({
      description: 'Update the currently displayed HTML artifact. Provide the COMPLETE updated HTML.',
      parameters: z.object({
        title: z.string().optional().describe('Updated title, if changed'),
        html: z.string().describe('The complete updated HTML document'),
        language: z.string().optional().describe('Updated language code'),
      }),
      // No execute — handled client-side
    }),

    translate_artifact: createTool({
      description: 'Translate the current artifact into a different language. Preserves all HTML structure and styling.',
      parameters: z.object({
        target_language: z.string().describe('Target language name (e.g. "French", "German", "Arabic")'),
        target_language_code: z.string().describe('ISO language code (e.g. "fr", "de", "ar")'),
        html: z.string().describe('The complete translated HTML document'),
      }),
      // No execute — handled client-side
    }),

    // Save tools
    save_resume: createTool({
      description: 'Save a resume to the database. Only use when user explicitly asks to save.',
      parameters: z.object({
        name: z.string().describe('Resume name/title'),
        target_role: z.string().describe('Target job role'),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string(),
        phone_number: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        linkedin_url: z.string().optional(),
        github_url: z.string().optional(),
        work_experience: z.array(z.object({
          company: z.string(),
          position: z.string(),
          location: z.string().optional(),
          date: z.string(),
          description: z.array(z.string()),
          technologies: z.array(z.string()).optional(),
        })).optional(),
        education: z.array(z.object({
          school: z.string(),
          degree: z.string(),
          field: z.string(),
          location: z.string().optional(),
          date: z.string(),
          gpa: z.string().optional(),
          achievements: z.array(z.string()).optional(),
        })).optional(),
        skills: z.array(z.object({
          category: z.string(),
          items: z.array(z.string()),
        })).optional(),
        projects: z.array(z.object({
          name: z.string(),
          description: z.array(z.string()),
          date: z.string().optional(),
          technologies: z.array(z.string()).optional(),
          url: z.string().optional(),
          github_url: z.string().optional(),
        })).optional(),
      }),
      execute: async (args) => {
        const { data, error } = await supabase
          .from('resumes')
          .insert({ user_id: userId, is_base_resume: true, ...args })
          .select('id, name')
          .single();
        if (error) return { error: error.message };
        return { success: true, id: data.id, name: data.name };
      },
    }),

    save_cover_letter: createTool({
      description: 'Save a cover letter to the database.',
      parameters: z.object({
        title: z.string().describe('Title for the cover letter'),
        context: z.string().describe('The cover letter HTML content'),
      }),
      execute: async (args) => {
        const { data, error } = await supabase
          .from('cover_letters')
          .insert({ user_id: userId, ...args })
          .select('id, title')
          .single();
        if (error) return { error: error.message };
        return { success: true, id: data.id, title: data.title };
      },
    }),

    save_email: createTool({
      description: 'Save a follow-up email to the database.',
      parameters: z.object({
        title: z.string().describe('Title for the email'),
        subject: z.string().describe('Email subject line'),
        content: z.string().describe('The email HTML content'),
      }),
      execute: async (args) => {
        const { data, error } = await supabase
          .from('email_hr')
          .insert({ user_id: userId, ...args })
          .select('id, title')
          .single();
        if (error) return { error: error.message };
        return { success: true, id: data.id, title: data.title };
      },
    }),

    score_resume: createTool({
      description: 'Analyze and score a resume for ATS compatibility.',
      parameters: z.object({
        resume_id: z.string().optional().describe('Resume ID to score.'),
      }),
      execute: async () => ({ message: 'Resume scoring analysis complete.' }),
    }),

    // ─── Profile Onboarding Tools ────────────────────────────

    import_linkedin_profile: createTool({
      description: 'Import a user profile from LinkedIn by scraping their public profile URL. This takes 30-60 seconds. Use when user provides a LinkedIn URL.',
      parameters: z.object({
        linkedin_url: z.string().describe('The full LinkedIn profile URL (e.g. https://linkedin.com/in/username)'),
      }),
      execute: async ({ linkedin_url }) => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';
          const res = await fetch(`${baseUrl}/api/scrape-linkedin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileUrl: linkedin_url }),
          });
          const result = await res.json();
          if (!result.success) return { error: result.message || 'Failed to scrape LinkedIn profile' };
          return { success: true, profile_data: result.data };
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'LinkedIn import failed' };
        }
      },
    }),

    extract_profile_from_text: createTool({
      description: 'Extract structured profile data from raw resume text (from PDF or pasted text). Uses AI to parse name, contact info, work experience, education, skills, and projects into structured format.',
      parameters: z.object({
        resume_text: z.string().describe('The raw text content from a resume PDF, image, or pasted text'),
      }),
      execute: async ({ resume_text }) => {
        try {
          const openaiClient = createOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            compatibility: 'strict',
          });
          const extractionModel = openaiClient('gpt-4o') as LanguageModelV1;

          const { object } = await generateObject({
            model: extractionModel,
            schema: z.object({
              content: z.object({
                first_name: z.string().optional(),
                last_name: z.string().optional(),
                email: z.string().optional(),
                phone_number: z.string().optional(),
                location: z.string().optional(),
                website: z.string().optional(),
                linkedin_url: z.string().optional(),
                github_url: z.string().optional(),
                work_experience: z.array(z.object({
                  company: z.string(),
                  position: z.string(),
                  date: z.string(),
                  location: z.string().optional(),
                  description: z.array(z.string()),
                  technologies: z.array(z.string()).optional(),
                })).optional(),
                education: z.array(z.object({
                  school: z.string(),
                  degree: z.string(),
                  field: z.string(),
                  date: z.string(),
                  location: z.string().optional(),
                  gpa: z.string().optional(),
                  achievements: z.array(z.string()).optional(),
                })).optional(),
                skills: z.array(z.object({
                  category: z.string(),
                  items: z.array(z.string()),
                })).optional(),
                projects: z.array(z.object({
                  name: z.string(),
                  description: z.array(z.string()),
                  technologies: z.array(z.string()).optional(),
                  date: z.string().optional(),
                  url: z.string().optional(),
                  github_url: z.string().optional(),
                })).optional(),
              }),
            }),
            prompt: `Please analyze this resume text and extract all relevant information into a structured profile format.
Include all sections (personal info, work experience, education, skills, projects) if present.
Ensure all arrays (like description, technologies, achievements) are properly formatted as arrays.
For any missing or unclear information, use optional fields rather than making assumptions.

Resume Text:
${resume_text}`,
            system: RESUME_FORMATTER_SYSTEM_MESSAGE.content as string,
          });

          return { success: true, profile_data: sanitizeUnknownStrings(object.content) };
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Profile extraction failed' };
        }
      },
    }),

    // ─── Job Search Tools ────────────────────────────────

    search_jobs: createTool({
      description: 'Search for jobs on LinkedIn and Indeed using Apify scrapers. Returns a list of job postings matching the search criteria. Use this when the user asks to find jobs, search for positions, or explore opportunities.',
      parameters: z.object({
        keywords: z.string().describe('Job search keywords (e.g. "Python Engineer", "Frontend Developer", "Data Scientist")'),
        location: z.string().optional().describe('Location to search in (e.g. "New York", "Remote", "San Francisco, CA")'),
        job_type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional().describe('Type of employment'),
        experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional().describe('Experience level filter'),
        remote_only: z.boolean().optional().describe('If true, only return remote positions'),
        source: z.enum(['linkedin', 'indeed', 'both']).optional().describe('Which job board to search. Default "linkedin".'),
        max_results: z.number().optional().describe('Maximum number of results to return. Default 15.'),
      }),
      execute: async ({ keywords, location, job_type, experience_level, remote_only, source = 'linkedin', max_results = 15 }) => {
        try {
          // Check job search credit
          const jsCheck = await checkCanPerformAction('job_search');
          if (!jsCheck.allowed) {
            return { error: 'Job search credit limit reached. Upgrade your plan to continue searching.' };
          }
          await recordUsage('job_search');

          const apifyToken = process.env.APIFY_API_TOKEN;
          if (!apifyToken) return { error: 'Apify API token not configured' };

          const client = new ApifyClient({ token: apifyToken });
          const jobs: Array<Record<string, unknown>> = [];

          // LinkedIn job search
          if (source === 'linkedin' || source === 'both') {
            const params = new URLSearchParams();
            if (keywords) params.append('keywords', keywords);
            if (location) params.append('location', location);

            // Workplace type
            if (remote_only) params.append('f_WT', '2');

            // Job type mapping
            const jobTypeMap: Record<string, string> = { 'full-time': 'F', 'part-time': 'P', 'contract': 'C', 'internship': 'I' };
            if (job_type && jobTypeMap[job_type]) params.append('f_JT', jobTypeMap[job_type]);

            // Experience level mapping
            const expMap: Record<string, string> = { 'entry': '2', 'mid': '4', 'senior': '4', 'executive': '5' };
            if (experience_level && expMap[experience_level]) params.append('f_E', expMap[experience_level]);

            params.append('sortBy', 'DD');
            const searchUrl = `https://www.linkedin.com/jobs/search/?${params.toString()}`;

            const run = await client.actor('curious_coder~linkedin-jobs-scraper').call({
              count: Math.max(max_results, 10),
              scrapeCompany: true,
              urls: [searchUrl],
            }, { waitSecs: 120 });

            const { items } = await client.dataset(run.defaultDatasetId).listItems();
            const linkedinJobs = (items || []).slice(0, max_results).map((item: Record<string, unknown>) => ({
              title: item.title,
              company: item.companyName || item.company,
              location: item.location || item.formattedLocation,
              job_type: item.employmentType || job_type || 'Full-time',
              date_posted: item.postedDate || item.listedAt,
              description: typeof item.description === 'string' ? item.description.substring(0, 500) + '...' : '',
              application_link: item.jobUrl || item.url || item.link,
              salary: item.salary || item.salaryInfo || null,
              source: 'LinkedIn',
            }));
            jobs.push(...linkedinJobs);
          }

          // Indeed job search
          if (source === 'indeed' || source === 'both') {
            const indeedInput: Record<string, unknown> = {
              position: keywords,
              country: 'US',
              maxItems: max_results,
            };
            if (location) indeedInput.location = location;
            if (job_type) indeedInput.jobType = job_type;

            try {
              const run = await client.actor('shahidirfan/indeed-job-scraper').call(indeedInput, { waitSecs: 120 });
              const { items } = await client.dataset(run.defaultDatasetId).listItems();
              const indeedJobs = (items || []).slice(0, max_results).map((item: Record<string, unknown>) => ({
                title: item.positionName || item.title,
                company: item.company,
                location: item.location,
                job_type: item.jobType || job_type || 'Full-time',
                date_posted: item.postingDate || item.date,
                description: typeof item.description === 'string' ? item.description.substring(0, 500) + '...' : '',
                application_link: item.url || item.externalUrl,
                salary: item.salary || null,
                source: 'Indeed',
              }));
              jobs.push(...indeedJobs);
            } catch (indeedErr) {
              // If Indeed fails, still return LinkedIn results
              if (source === 'both' && jobs.length > 0) {
                console.error('Indeed scraper failed:', indeedErr);
              } else {
                throw indeedErr;
              }
            }
          }

          return {
            success: true,
            total: jobs.length,
            jobs,
            search_params: { keywords, location, job_type, experience_level, remote_only, source },
          };
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Job search failed' };
        }
      },
    }),

    save_job: createTool({
      description: 'Save a job listing to the user\'s saved jobs. Use when user explicitly asks to save or bookmark a job from search results.',
      parameters: z.object({
        title: z.string().describe('Job title'),
        company: z.string().describe('Company name'),
        location: z.string().optional().describe('Job location'),
        job_type: z.string().optional().describe('Employment type'),
        description: z.string().optional().describe('Job description snippet'),
        application_link: z.string().optional().describe('URL to apply'),
        salary: z.string().optional().describe('Salary info if available'),
        source: z.string().optional().describe('Job board source (LinkedIn, Indeed)'),
      }),
      execute: async (args) => {
        try {
          const { data, error } = await supabase
            .from('saved_jobs')
            .insert({ user_id: userId, ...args })
            .select('id, title, company')
            .single();
          if (error) return { error: error.message };
          return { success: true, id: data.id, title: data.title, company: data.company };
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Failed to save job' };
        }
      },
    }),

    update_user_profile: createTool({
      description: 'Update the user profile in the database with extracted or confirmed profile data. Use this after the user confirms the extracted profile looks correct. Can do a full overwrite or merge with existing data.',
      parameters: z.object({
        mode: z.enum(['merge', 'overwrite']).describe('"merge" appends to existing arrays and only fills empty fields. "overwrite" replaces all provided fields.'),
        profile_data: z.object({
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          email: z.string().optional(),
          phone_number: z.string().optional(),
          location: z.string().optional(),
          website: z.string().optional(),
          linkedin_url: z.string().optional(),
          github_url: z.string().optional(),
          work_experience: z.array(z.object({
            company: z.string(),
            position: z.string(),
            date: z.string(),
            location: z.string().optional(),
            description: z.array(z.string()),
            technologies: z.array(z.string()).optional(),
          })).optional(),
          education: z.array(z.object({
            school: z.string(),
            degree: z.string(),
            field: z.string(),
            date: z.string(),
            location: z.string().optional(),
            gpa: z.string().optional(),
            achievements: z.array(z.string()).optional(),
          })).optional(),
          skills: z.array(z.object({
            category: z.string(),
            items: z.array(z.string()),
          })).optional(),
          projects: z.array(z.object({
            name: z.string(),
            description: z.array(z.string()),
            technologies: z.array(z.string()).optional(),
            date: z.string().optional(),
            url: z.string().optional(),
            github_url: z.string().optional(),
          })).optional(),
        }).describe('The profile data to save'),
      }),
      execute: async ({ mode, profile_data }) => {
        try {
          if (mode === 'overwrite') {
            const { data, error } = await supabase
              .from('profiles')
              .update(profile_data)
              .eq('user_id', userId)
              .select()
              .single();
            if (error) return { error: error.message };
            return { success: true, message: 'Profile updated successfully', profile: data };
          } else {
            // Merge mode: only fill empty simple fields, append to arrays
            const { data: current, error: fetchErr } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', userId)
              .single();
            if (fetchErr) return { error: fetchErr.message };

            const updateData: Record<string, unknown> = {};
            const simpleFields = ['first_name', 'last_name', 'email', 'phone_number', 'location', 'website', 'linkedin_url', 'github_url'] as const;
            simpleFields.forEach(field => {
              if ((profile_data as Record<string, unknown>)[field] !== undefined && !current[field]) {
                updateData[field] = (profile_data as Record<string, unknown>)[field];
              }
            });

            const arrayFields = ['work_experience', 'education', 'skills', 'projects'] as const;
            arrayFields.forEach(field => {
              const newItems = (profile_data as Record<string, unknown[]>)[field];
              if (newItems?.length) {
                updateData[field] = [...(current[field] || []), ...newItems];
              }
            });

            if (Object.keys(updateData).length === 0) {
              return { success: true, message: 'No new data to merge — profile already has this information' };
            }

            const { data, error } = await supabase
              .from('profiles')
              .update(updateData)
              .eq('user_id', userId)
              .select()
              .single();
            if (error) return { error: error.message };
            return { success: true, message: 'Profile merged successfully', profile: data };
          }
        } catch (err) {
          return { error: err instanceof Error ? err.message : 'Profile update failed' };
        }
      },
    }),
  };
}

export async function POST(req: Request) {
  try {
    const { messages, resumeContext }: { messages: CoreMessage[]; resumeContext?: string } = await req.json();

    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Check agent message credit
    const creditCheck = await checkCanPerformAction('agent_message');
    if (!creditCheck.allowed) {
      return new Response(
        JSON.stringify({ error: 'You\'ve used all your agent message credits. Upgrade your plan to continue.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    await recordUsage('agent_message');

    // Load user context
    const userContext = await loadUserContext();
    const userContextString = formatUserContextForPrompt(userContext);

    // Build system prompt
    let systemPrompt = buildSuperAgentSystemPrompt(userContextString);
    systemPrompt += `\n\n# TEMPLATE DESIGN INSTRUCTIONS\n${RESUME_TEMPLATE_INSTRUCTIONS}\n${COVER_LETTER_TEMPLATE_INSTRUCTIONS}\n${EMAIL_TEMPLATE_INSTRUCTIONS}`;

    if (resumeContext) {
      systemPrompt += `\n\n# CURRENT RESUME CONTEXT\n${resumeContext}`;
    }

    // Initialize OpenAI
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      compatibility: 'strict',
    });

    const model = openai('gpt-4o') as LanguageModelV1;

    // Build tools with execute handlers
    const tools = buildTools(supabase, user.id);

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      maxSteps: 10,
      tools,
      experimental_transform: smoothStream(),
    });

    return result.toDataStreamResponse({
      sendUsage: false,
      getErrorMessage: (error) => {
        if (!error) return 'Unknown error occurred';
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });
  } catch (error) {
    console.error('Error in super-agent route:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
