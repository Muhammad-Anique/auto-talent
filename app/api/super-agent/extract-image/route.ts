import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { image } = await req.json();

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });
    }

    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const model = openai('gpt-4o');

    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract ALL text content from this resume/document image. Preserve the structure as much as possible — include names, contact info, job titles, companies, dates, descriptions, education, skills, projects, etc. Return only the extracted text, no commentary.',
            },
            {
              type: 'image',
              image,
            },
          ],
        },
      ],
    });

    return new Response(JSON.stringify({ success: true, text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Image extraction error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Image extraction failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
