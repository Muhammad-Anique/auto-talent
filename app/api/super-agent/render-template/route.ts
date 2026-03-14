import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateCV11eu4003Template } from '@/lib/cv-templates/html-templates/CV1';
import { generateCV2Template } from '@/lib/cv-templates/html-templates/CV2';
import { generateCV3Template } from '@/lib/cv-templates/html-templates/CV3';
import { generateCV4Template } from '@/lib/cv-templates/html-templates/CV4';
import { generateCV5Template } from '@/lib/cv-templates/html-templates/CV5';
import { generateCV6Template } from '@/lib/cv-templates/html-templates/CV6';
import { generateCV7Template } from '@/lib/cv-templates/html-templates/CV7';
import type { Resume } from '@/lib/types';

const TEMPLATE_RENDERERS: Record<string, (resume: Resume) => string> = {
  CV1: generateCV11eu4003Template,
  CV2: generateCV2Template,
  CV3: generateCV3Template,
  CV4: generateCV4Template,
  CV5: generateCV5Template,
  CV6: generateCV6Template,
  CV7: generateCV7Template,
};

export async function POST(req: NextRequest) {
  try {
    const { templateId, resumeId } = await req.json();

    if (!templateId || !resumeId) {
      return NextResponse.json({ error: 'templateId and resumeId are required' }, { status: 400 });
    }

    const renderer = TEMPLATE_RENDERERS[templateId];
    if (!renderer) {
      return NextResponse.json({ error: `Unknown template: ${templateId}` }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (error || !resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const html = renderer(resume as Resume);
    return NextResponse.json({ html });
  } catch (err) {
    console.error('render-template error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
