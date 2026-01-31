'use server';

import { generateObject } from 'ai';
import { initializeAIClient, type AIConfig } from '@/utils/ai-tools';
import { Resume } from '@/lib/types';
import { z } from 'zod';
import { updateResume } from '../resumes/actions';
import { RESUME_TRANSLATION_SYSTEM_MESSAGE } from '@/lib/prompts';
import { TRANSLATION_LANGUAGES } from '@/lib/translation-config';

// Schema for translated resume content
const translatedResumeSchema = z.object({
  work_experience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    location: z.string().optional(),
    date: z.string(),
    description: z.array(z.string()),
    technologies: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    location: z.string().optional(),
    date: z.string(),
    gpa: z.union([z.number(), z.string()]).optional(),
    achievements: z.array(z.string()).optional(),
  })),
  skills: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.array(z.string()),
    date: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    url: z.string().optional(),
    github_url: z.string().optional(),
  })),
  target_role: z.string(),
  cover_letter_content: z.string().optional(),
  follow_up_email_content: z.string().optional(),
});

export async function translateResume(
  resume: Resume,
  targetLanguage: string,
  config?: AIConfig
): Promise<Resume> {
  try {
    const isPro = true;

    // Use environment API key for Pro users
    const effectiveConfig = isPro ? {
      model: "gpt-4o-mini",
      apiKeys: [{
        service: "openai",
        key: process.env.OPENAI_API_KEY!,
      }],
    } : config;

    if (!effectiveConfig) {
      throw new Error('No API configuration provided');
    }

    const aiClient = initializeAIClient(effectiveConfig, isPro);

    // Get target language name
    const targetLangName = TRANSLATION_LANGUAGES[targetLanguage as keyof typeof TRANSLATION_LANGUAGES]?.name || targetLanguage;

    // Prepare content for translation
    const contentToTranslate = {
      work_experience: resume.work_experience,
      education: resume.education,
      skills: resume.skills,
      projects: resume.projects,
      target_role: resume.target_role,
      cover_letter_content: resume.has_cover_letter && resume.cover_letter ?
        (resume.cover_letter as { content?: string })?.content || '' : undefined,
      follow_up_email_content: resume.has_follow_up_email && resume.follow_up_email ?
        (resume.follow_up_email as { content?: string })?.content || '' : undefined,
    };

    // Special handling for RTL languages
    const isRTL = ['ar'].includes(targetLanguage);
    const rtlNote = isRTL ? '\n7. IMPORTANT: This is a RIGHT-TO-LEFT language. Ensure all translated text uses proper Unicode characters and is readable. DO NOT use escape sequences or encoded characters - return actual readable text.' : '';

    const prompt = `Translate the following resume content to ${targetLangName}.

CRITICAL INSTRUCTIONS:
1. DO NOT translate: names, emails, phone numbers, URLs, locations, company names, dates, or numbers
2. DO translate: job titles (position field), descriptions, skills categories, education degree/field, project descriptions, cover letter content, follow-up email content
3. PRESERVE all markdown formatting (especially **bold** syntax using ** not other characters)
4. Maintain professional resume language appropriate for ${targetLangName}
5. Keep all array structures and data types intact
6. Use industry-standard professional terminology in ${targetLangName}${rtlNote}
8. Return ACTUAL readable text in ${targetLangName}, not escape sequences or encoded strings
9. Each description array item should be a complete, readable sentence in ${targetLangName}

EXAMPLE for Arabic:
Instead of: "\\u0645\\u0647\\u0646\\u062f\\u0633"
Return: "مهندس برمجيات"

Resume content to translate:
${JSON.stringify(contentToTranslate, null, 2)}

Return the translated resume with the EXACT same structure, using actual ${targetLangName} characters (not escape sequences).`;

    const { object } = await generateObject({
      model: aiClient,
      schema: translatedResumeSchema,
      system: RESUME_TRANSLATION_SYSTEM_MESSAGE.content as string,
      prompt,
    });

    // Debug logging for RTL languages
    if (isRTL) {
      console.log('=== Translation Debug (RTL) ===');
      console.log('Target Language:', targetLangName);
      console.log('Sample work experience position:', object.work_experience[0]?.position);
      console.log('Sample skill category:', object.skills[0]?.category);
      console.log('Sample description:', object.work_experience[0]?.description[0]);
      console.log('===============================');
    }

    // Update resume with translated content
    const updatedResumeData: Partial<Resume> = {
      work_experience: object.work_experience,
      education: object.education,
      skills: object.skills,
      projects: object.projects,
      target_role: object.target_role,
    };

    // Update cover letter if it exists and was translated
    if (resume.has_cover_letter && object.cover_letter_content) {
      updatedResumeData.cover_letter = {
        ...(resume.cover_letter as Record<string, unknown> || {}),
        content: object.cover_letter_content,
      };
    }

    // Update follow-up email if it exists and was translated
    if (resume.has_follow_up_email && object.follow_up_email_content) {
      updatedResumeData.follow_up_email = {
        ...(resume.follow_up_email as Record<string, unknown> || {}),
        content: object.follow_up_email_content,
      };
    }

    // Try to save to database with current_language
    try {
      updatedResumeData.current_language = targetLanguage;
      const updatedResume = await updateResume(resume.id, updatedResumeData);
      return updatedResume;
    } catch (error) {
      // If update fails due to missing column, retry without current_language
      console.warn('Failed to update current_language, retrying without it. Please run the migration.');
      delete updatedResumeData.current_language;
      const updatedResume = await updateResume(resume.id, updatedResumeData);

      // Return resume with language set in memory (not persisted)
      return {
        ...updatedResume,
        current_language: targetLanguage,
      };
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to translate resume');
  }
}
