import { Resume } from '@/lib/types';
import { generateCV11eu4003Template } from './html-templates/CV-11eu400-3';
import { generateCV21eu4002Template } from './html-templates/CV-21eu400-2';
import { generateCV31eu5003Template } from './html-templates/CV-31eu500-3';
import { generateCV41eu4001Template } from './html-templates/CV-41eu400-1';
import { generateCV51eu4002Template } from './html-templates/CV-51eu400-2';
import { generateCV61eu5001Template } from './html-templates/CV-61eu500-1';
import { generateCV71eu4003Template } from './html-templates/CV-71eu400-3';

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
  {
    id: 'CV-21eu400-2',
    name: 'Executive Red',
    description: 'Elegant two-column layout with burgundy sidebar and cream background',
    thumbnail: '/cv-templates/thumbnails/CV-21eu400-2.png',
    generateHTML: generateCV21eu4002Template,
    category: 'professional',
    color: '#8B3A3A',
  },
  {
    id: 'CV-31eu500-3',
    name: 'Modern Orange',
    description: 'Clean single-column design with vibrant orange accents',
    thumbnail: '/cv-templates/thumbnails/CV-31eu500-3.png',
    generateHTML: generateCV31eu5003Template,
    category: 'modern',
    color: '#E67E22',
  },
  {
    id: 'CV-41eu400-1',
    name: 'Blue Leadership',
    description: 'Blue sidebar with profile photo, profile summary, and skills on the left',
    thumbnail: '/cv-templates/thumbnails/CV-41eu400-1.png',
    generateHTML: generateCV41eu4001Template,
    category: 'professional',
    color: '#1a5276',
  },
  {
    id: 'CV-51eu400-2',
    name: 'Teal Executive',
    description: 'Dark navy sidebar with landscape banner, circular photo, and teal accents',
    thumbnail: '/cv-templates/thumbnails/CV-51eu400-2.png',
    generateHTML: generateCV51eu4002Template,
    category: 'modern',
    color: '#1b2a3d',
  },
  {
    id: 'CV-61eu500-1',
    name: 'Olive Classic',
    description: 'White background with olive green accents and two-column body layout',
    thumbnail: '/cv-templates/thumbnails/CV-61eu500-1.png',
    generateHTML: generateCV61eu5001Template,
    category: 'minimal',
    color: '#3d5c2e',
  },
  {
    id: 'CV-71eu400-3',
    name: 'Navy Portrait',
    description: 'Dark sidebar with circular portrait, green banner, and clean right column',
    thumbnail: '/cv-templates/thumbnails/CV-71eu400-3.png',
    generateHTML: generateCV71eu4003Template,
    category: 'creative',
    color: '#1c2b3a',
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
