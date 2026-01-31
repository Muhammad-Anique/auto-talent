import { Resume } from '@/lib/types';
import { generateCV11eu4003Template } from './html-templates/CV-11eu400-3';

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
    id: 'CV-11eu400-3',
    name: 'Professional Sidebar',
    description: 'Modern two-column layout with dark sidebar and clean content area',
    thumbnail: '/cv-templates/thumbnails/CV-11eu400-3.png',
    generateHTML: generateCV11eu4003Template,
    category: 'professional',
    color: '#2d3e50',
  },
  // Add more templates here as you create them
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
