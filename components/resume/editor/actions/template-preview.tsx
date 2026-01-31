'use client';

import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import { ResumeLayout } from '../preview/templates/ResumeLayout';
import type { Resume, TemplateLayout } from '@/lib/types';

// Dummy resume data for preview
const DUMMY_RESUME: Resume = {
  id: 'preview',
  user_id: 'preview',
  name: 'Preview Resume',
  target_role: 'Software Engineer',
  is_base_resume: true,
  current_language: 'en',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone_number: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'johndoe.com',
  linkedin_url: 'linkedin.com/in/johndoe',
  github_url: 'github.com/johndoe',
  work_experience: [
    {
      company: 'Tech Company Inc.',
      position: 'Senior Software Engineer',
      date: '2021 - Present',
      description: [
        'Led development of microservices architecture serving 1M+ users',
        'Reduced API response time by 40% through optimization',
        'Mentored team of 5 junior developers'
      ]
    },
    {
      company: 'Startup Labs',
      position: 'Software Engineer',
      date: '2019 - 2021',
      description: [
        'Built scalable web applications using React and Node.js',
        'Implemented CI/CD pipelines reducing deployment time by 60%'
      ]
    }
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      date: '2015 - 2019',
      achievements: ['GPA: 3.8/4.0', 'Dean\'s List']
    }
  ],
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript', 'TypeScript', 'Python', 'Java']
    },
    {
      category: 'Frameworks',
      items: ['React', 'Node.js', 'Next.js', 'Express']
    },
    {
      category: 'Tools',
      items: ['Git', 'Docker', 'AWS', 'PostgreSQL']
    }
  ],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: [
        'Built full-stack e-commerce platform with React and Node.js',
        'Integrated Stripe payment processing and user authentication'
      ],
      date: '2023',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      url: 'project-demo.com',
      github_url: 'github.com/johndoe/ecommerce'
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  has_cover_letter: false,
  has_follow_up_email: false,
  document_settings: {
    document_font_size: 10,
    document_line_height: 1.5,
    document_margin_vertical: 36,
    document_margin_horizontal: 36,
    header_name_size: 24,
    header_name_bottom_spacing: 24,
    skills_margin_top: 2,
    skills_margin_bottom: 2,
    skills_margin_horizontal: 0,
    skills_item_spacing: 2,
    experience_margin_top: 2,
    experience_margin_bottom: 2,
    experience_margin_horizontal: 0,
    experience_item_spacing: 4,
    projects_margin_top: 2,
    projects_margin_bottom: 2,
    projects_margin_horizontal: 0,
    projects_item_spacing: 4,
    education_margin_top: 2,
    education_margin_bottom: 2,
    education_margin_horizontal: 0,
    education_item_spacing: 4,
    footer_width: 95,
  }
};

interface TemplatePreviewProps {
  template: TemplateLayout;
}

export function TemplatePreview({ template }: TemplatePreviewProps) {
  return (
    <div className="w-full h-full">
      <PDFViewer width="100%" height="800px" showToolbar={false}>
        <Document>
          <Page size="LETTER">
            <ResumeLayout
              resume={DUMMY_RESUME}
              layout={template}
              theme={{ color: '#111827' }}
            />
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}
