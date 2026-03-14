import { tool as createTool } from 'ai';
import { z } from 'zod';

// ─── READ TOOLS ───────────────────────────────────────────

export const getUserProfile = createTool({
  description: 'Get the current user profile including name, contact info, work experience, education, skills, and projects.',
  parameters: z.object({}),
});

export const getResumes = createTool({
  description: 'List all of the user\'s resumes with their IDs, names, target roles, and creation dates.',
  parameters: z.object({
    limit: z.number().optional().describe('Max number of resumes to return. Default 10.'),
  }),
});

export const getResumeDetail = createTool({
  description: 'Get the full content of a specific resume by ID, including all sections.',
  parameters: z.object({
    resume_id: z.string().describe('The UUID of the resume to fetch'),
  }),
});

export const getCoverLetters = createTool({
  description: 'List all of the user\'s cover letters with their IDs, titles, and creation dates.',
  parameters: z.object({
    limit: z.number().optional().describe('Max number to return. Default 10.'),
  }),
});

export const getCoverLetterDetail = createTool({
  description: 'Get the full content of a specific cover letter by ID.',
  parameters: z.object({
    cover_letter_id: z.string().describe('The UUID of the cover letter to fetch'),
  }),
});

export const getEmails = createTool({
  description: 'List all of the user\'s follow-up emails/HR emails with their IDs, titles, subjects, and creation dates.',
  parameters: z.object({
    limit: z.number().optional().describe('Max number to return. Default 10.'),
  }),
});

export const getEmailDetail = createTool({
  description: 'Get the full content of a specific follow-up email by ID.',
  parameters: z.object({
    email_id: z.string().describe('The UUID of the email to fetch'),
  }),
});

export const getSavedJobs = createTool({
  description: 'Get user\'s saved jobs for context about what positions they\'re interested in.',
  parameters: z.object({
    limit: z.number().optional().describe('Max number to return. Default 10.'),
  }),
});

export const getInterviewQuestions = createTool({
  description: 'List user\'s interview question sets.',
  parameters: z.object({
    limit: z.number().optional().describe('Max number to return. Default 10.'),
  }),
});

// ─── ARTIFACT TOOLS ───────────────────────────────────────

export const createArtifact = createTool({
  description: `Create an HTML artifact to display in the artifact panel. Use this for generating resumes, cover letters, emails, or any document the user requests. The HTML must be a COMPLETE self-contained document with embedded CSS styling. Make it visually beautiful and professional. The artifact will render in a sandboxed iframe. ALWAYS use this tool when generating any document - never output raw HTML in chat.`,
  parameters: z.object({
    type: z.enum(['resume', 'cover_letter', 'email', 'document']).describe('The type of artifact being created'),
    title: z.string().describe('A short title for the artifact (e.g. "Software Engineer Resume", "Cover Letter for Google")'),
    html: z.string().describe('Complete HTML document with embedded CSS. Must include <!DOCTYPE html>, <html>, <head> with <style>, and <body>. Make it print-ready (8.5x11in or A4). Use professional fonts, colors, and spacing.'),
    language: z.string().optional().describe('Language code (e.g. "en", "fr", "de", "ar"). Defaults to "en".'),
    resume_id: z.string().optional().describe('If this artifact is based on a specific resume from the database, provide its UUID here. This enables client-side template switching.'),
  }),
});

export const updateArtifact = createTool({
  description: 'Update the currently displayed HTML artifact. Use this when the user asks to modify, edit, or improve the current document. Provide the COMPLETE updated HTML.',
  parameters: z.object({
    title: z.string().optional().describe('Updated title, if changed'),
    html: z.string().describe('The complete updated HTML document'),
    language: z.string().optional().describe('Updated language code, if changed'),
  }),
});

export const translateArtifact = createTool({
  description: 'Translate the current artifact into a different language. Preserves all HTML structure and styling, only translates text content.',
  parameters: z.object({
    target_language: z.string().describe('Target language name (e.g. "French", "German", "Arabic", "Spanish", "Chinese")'),
    target_language_code: z.string().describe('ISO language code (e.g. "fr", "de", "ar", "es", "zh")'),
    html: z.string().describe('The complete translated HTML document with all text content translated'),
  }),
});

// ─── WRITE/SAVE TOOLS ─────────────────────────────────────

export const saveResume = createTool({
  description: 'Save a resume to the database. Creates a new resume entry from structured data.',
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
});

export const saveCoverLetter = createTool({
  description: 'Save a cover letter to the database.',
  parameters: z.object({
    title: z.string().describe('Title for the cover letter'),
    context: z.string().describe('The cover letter HTML content'),
  }),
});

export const saveEmail = createTool({
  description: 'Save a follow-up email to the database.',
  parameters: z.object({
    title: z.string().describe('Title for the email'),
    subject: z.string().describe('Email subject line'),
    content: z.string().describe('The email HTML content'),
  }),
});

// ─── ANALYSIS TOOLS ───────────────────────────────────────

export const scoreResume = createTool({
  description: 'Analyze and score a resume for ATS compatibility, providing detailed feedback and improvement suggestions.',
  parameters: z.object({
    resume_id: z.string().optional().describe('Resume ID to score. If not provided, scores the current artifact if it\'s a resume.'),
  }),
});

// ─── ALL TOOLS EXPORT ─────────────────────────────────────

export const superAgentTools = {
  get_user_profile: getUserProfile,
  get_resumes: getResumes,
  get_resume_detail: getResumeDetail,
  get_cover_letters: getCoverLetters,
  get_cover_letter_detail: getCoverLetterDetail,
  get_emails: getEmails,
  get_email_detail: getEmailDetail,
  get_saved_jobs: getSavedJobs,
  get_interview_questions: getInterviewQuestions,
  create_artifact: createArtifact,
  update_artifact: updateArtifact,
  translate_artifact: translateArtifact,
  save_resume: saveResume,
  save_cover_letter: saveCoverLetter,
  save_email: saveEmail,
  score_resume: scoreResume,
};
