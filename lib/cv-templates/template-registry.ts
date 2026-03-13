import { Resume } from '@/lib/types';
import { generateCV11eu4003Template } from './html-templates/CV1';
import { generateCV2Template } from './html-templates/CV2';
import { generateCV3Template } from './html-templates/CV3';
import { generateCV4Template } from './html-templates/CV4';
import { generateCV5Template } from './html-templates/CV5';
import { generateCV6Template } from './html-templates/CV6';
import { generateCV7Template } from './html-templates/CV7';

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  generateHTML: (resume: Resume) => string;
  category: 'modern' | 'professional' | 'creative' | 'minimal';
  color: string;
}

/**
 * Registry of all available CV templates
 * To add a new template:
 * 1. Create the HTML/CSS generator function in html-templates/
 * 2. Add the template thumbnail to public/cv-templates/thumbnails/
 * 3. Register the template here
 */
export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'CV1',
    name: 'Professional Sidebar',
    description: 'Modern two-column layout with dark sidebar and clean content area',
    thumbnail: '/cv-templates/thumbnails/CV1.png',
    generateHTML: generateCV11eu4003Template,
    category: 'professional',
    color: '#2d3e50',
  },
  {
    id: 'CV2',
    name: 'Red Sidebar',
    description: 'Elegant two-column layout with dark red sidebar, profile photo, and clean typography',
    thumbnail: '/cv-templates/thumbnails/CV2.png',
    generateHTML: generateCV2Template,
    category: 'professional',
    color: '#7B1A2C',
  },
  {
    id: 'CV3',
    name: 'Orange Accent',
    description: 'Clean single-column layout with orange accent, profile photo header, and skill highlights grid',
    thumbnail: '/cv-templates/thumbnails/CV3.png',
    generateHTML: generateCV3Template,
    category: 'modern',
    color: '#e8570e',
  },
  {
    id: 'CV4',
    name: 'Teal Blue Sidebar',
    description: 'Modern two-column layout with teal-blue sidebar, bold name header, and clean experience section',
    thumbnail: '/cv-templates/thumbnails/CV4.png',
    generateHTML: generateCV4Template,
    category: 'modern',
    color: '#2e86ab',
  },
  {
    id: 'CV5',
    name: 'Charcoal Color Strip',
    description: 'Two-column layout with charcoal sidebar, large rectangular photo, and decorative color strip header',
    thumbnail: '/cv-templates/thumbnails/CV5.png',
    generateHTML: generateCV5Template,
    category: 'modern',
    color: '#2a9d8f',
  },
  {
    id: 'CV6',
    name: 'Dark Slate Sidebar',
    description: 'Two-column layout with dark slate sidebar, circular photo, and deep blue teal accents',
    thumbnail: '/cv-templates/thumbnails/CV6.png',
    generateHTML: generateCV6Template,
    category: 'professional',
    color: '#1a7a8a',
  },
  {
    id: 'CV7',
    name: 'Slate Header Strip',
    description: 'Header strip layout with grayish-navy banner, slate sidebar, circular photo straddling header and sidebar',
    thumbnail: '/cv-templates/thumbnails/CV7.png',
    generateHTML: generateCV7Template,
    category: 'professional',
    color: '#3b4856',
  },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): CVTemplate | undefined {
  return CV_TEMPLATES.find(template => template.id === id);
}

/**
 * Get all templates by category
 */
export function getTemplatesByCategory(category: CVTemplate['category']): CVTemplate[] {
  return CV_TEMPLATES.filter(template => template.category === category);
}

/**
 * Get default template
 */
export function getDefaultTemplate(): CVTemplate {
  return CV_TEMPLATES[0];
}
