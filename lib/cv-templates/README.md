# CV Templates System

## Overview

The CV Templates System is a flexible, extensible architecture for generating professional resume designs in HTML/CSS format. It allows you to create multiple template designs that users can choose from when generating their designed resumes.

## Architecture

```
lib/cv-templates/
├── README.md                    # This documentation
├── template-registry.ts         # Central registry of all templates
└── html-templates/              # Individual template implementations
    ├── CV-11eu400-3.ts         # Professional Sidebar template
    ├── CV-21eu400-2.ts         # Executive Red template
    └── CV-31eu500-3.ts         # Modern Orange template

public/cv-templates/
└── thumbnails/                  # Template preview images
    ├── CV-11eu400-3.png
    ├── CV-21eu400-2.png
    └── CV-31eu500-3.png

example_cv_templates/            # Source PNG files for reference
├── CV-11eu400-3.png
├── CV-21eu400-2.png
└── CV-31eu500-3.png
```

## How It Works

### 1. Template Structure

Each template consists of:

- **Generator Function**: A TypeScript function that takes a `Resume` object and returns HTML/CSS as a string
- **Thumbnail Image**: A PNG preview of the template (stored in `public/cv-templates/thumbnails/`)
- **Registry Entry**: Metadata in `template-registry.ts` that describes the template

### 2. Template Generator Functions

Template generators follow this pattern:

```typescript
export function generateCV[ID]Template(resume: Resume): string {
  // 1. Extract and format resume data
  const fullName = `${resume.first_name} ${resume.last_name}`;
  const targetRole = resume.target_role || 'Professional';

  // 2. Return complete HTML document with embedded CSS
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>
        /* Template-specific CSS */
      </style>
    </head>
    <body>
      <!-- Template-specific HTML structure -->
    </body>
    </html>
  `.trim();
}
```

### 3. Template Registry

The registry (`template-registry.ts`) maintains a central list of all available templates:

```typescript
export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: 'CV-11eu400-3',                    // Unique identifier
    name: 'Professional Sidebar',          // Display name
    description: 'Modern two-column...',   // User-facing description
    thumbnail: '/cv-templates/...',        // Path to preview image
    generateHTML: generateCV11eu4003Template, // Generator function
    category: 'professional',              // Template category
    color: '#2d3e50',                      // Primary brand color
  },
  // ... more templates
];
```

## Current Templates

### CV-11eu400-3: Professional Sidebar
- **Layout**: Two-column (35% sidebar / 65% content)
- **Color Scheme**: Dark blue (#2d3e50) sidebar with light gray content area
- **Features**:
  - Profile picture in sidebar
  - Contact, education, skills, and languages in sidebar
  - Main content for header, profile, experience, projects
  - Professional, corporate aesthetic
- **Best For**: Corporate jobs, traditional industries

### CV-21eu400-2: Executive Red
- **Layout**: Two-column (32% sidebar / 68% content)
- **Color Scheme**: Burgundy/red (#8B3A3A) sidebar with cream background
- **Features**:
  - Gradient burgundy sidebar
  - Contact and key skills in sidebar
  - Professional experience and education in main area
  - Elegant, executive aesthetic
- **Best For**: Senior positions, finance, consulting

### CV-31eu500-3: Modern Orange
- **Layout**: Single-column
- **Color Scheme**: Orange (#E67E22) accents with white background
- **Features**:
  - Clean, minimal design
  - Orange accents for headers and bullets
  - Contact info in header
  - Two-column skills grid
  - Modern, vibrant aesthetic
- **Best For**: Creative roles, tech positions, startups

## Adding a New Template

### Step 1: Prepare Your Design

1. Create or obtain a PNG image of your desired CV design
2. Place it in `example_cv_templates/` for reference
3. Analyze the design to identify:
   - Layout structure (columns, sections)
   - Color scheme
   - Typography (fonts, sizes)
   - Spacing and alignment
   - Section order and hierarchy

### Step 2: Create the Template File

Create a new file in `lib/cv-templates/html-templates/`:

```bash
lib/cv-templates/html-templates/CV-[TEMPLATE-ID].ts
```

**Naming Convention**: `CV-[VERSION][TYPE][SIZE]-[VARIANT]`
- Example: `CV-31eu500-3` means version 3, EU, 500 series, variant 3

**Template Structure**:

```typescript
import { Resume } from '@/lib/types';

/**
 * [Template Name] CV Template
 * Based on CV-[ID] design
 * Features: [Key features description]
 */

export function generateCV[ID]Template(resume: Resume): string {
  // 1. Extract data from resume object
  const fullName = `${resume.first_name} ${resume.last_name}`;
  const targetRole = resume.target_role || 'Professional';

  // 2. Create profile image placeholder or use actual image
  const profileImage = 'data:image/svg+xml,...'; // SVG placeholder

  // 3. Return complete HTML with embedded CSS
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} - Resume</title>
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #333;
    }

    .resume-container {
      width: 8.5in;  /* US Letter width */
      height: 11in;  /* US Letter height */
      background: white;
      overflow: hidden;
    }

    /* Your custom styles here */

    @media print {
      .resume-container {
        width: 100%;
        height: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Your HTML structure here -->

    <!-- Use conditional rendering for optional sections -->
    ${resume.email ? `<div>${resume.email}</div>` : ''}

    <!-- Use map for arrays -->
    ${resume.work_experience.map(exp => `
      <div class="experience-item">
        <h3>${exp.position}</h3>
        <div>${exp.company}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();
}
```

### Step 3: Add Thumbnail Image

Copy your template thumbnail to the public folder:

```bash
cp example_cv_templates/CV-[ID].png public/cv-templates/thumbnails/CV-[ID].png
```

**Thumbnail Guidelines**:
- Format: PNG
- Dimensions: Recommended 300-400px width
- Shows full page layout
- Clear, high-quality preview

### Step 4: Register the Template

Update `lib/cv-templates/template-registry.ts`:

```typescript
// 1. Import your generator function
import { generateCV[ID]Template } from './html-templates/CV-[ID]';

// 2. Add to CV_TEMPLATES array
export const CV_TEMPLATES: CVTemplate[] = [
  // ... existing templates
  {
    id: 'CV-[ID]',
    name: 'Your Template Name',
    description: 'Brief description of the template style and features',
    thumbnail: '/cv-templates/thumbnails/CV-[ID].png',
    generateHTML: generateCV[ID]Template,
    category: 'modern', // or 'professional', 'creative', 'minimal'
    color: '#HEX-COLOR', // Primary brand color
  },
];
```

### Step 5: Test Your Template

1. **Visual Testing**: Generate a resume with your template and verify:
   - Layout matches design
   - All sections render correctly
   - Colors are accurate
   - Typography is consistent
   - Page doesn't overflow (fits in 8.5" × 11")

2. **Data Testing**: Test with various resume data:
   - Empty sections (should gracefully hide)
   - Long text (should not break layout)
   - Multiple items in arrays
   - Special characters in names/text

3. **Print Testing**: Test PDF generation:
   - Export to PDF using html2pdf.js
   - Verify layout in PDF matches preview
   - Check page breaks
   - Verify colors in print

## Resume Data Structure

Your template has access to the complete `Resume` object:

```typescript
interface Resume {
  // Basic Info
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  github_url?: string;

  // Professional Info
  target_role?: string;
  current_language?: string;
  is_base_resume: boolean;

  // Template Settings
  designed_template_id?: string;
  template_layout?: 'classic' | 'modern' | 'creative';

  // Resume Sections
  work_experience: {
    position: string;
    company: string;
    location?: string;
    date: string;
    description: string[];
  }[];

  education: {
    school: string;
    degree: string;
    field?: string;
    date: string;
  }[];

  skills: {
    category: string;
    items: string[];
  }[];

  projects: {
    name: string;
    date?: string;
    description: string[];
  }[];

  // Document Settings
  document_settings?: {
    font_size?: number;
    line_spacing?: number;
    margin?: number;
  };
}
```

## Best Practices

### 1. Responsive Design
- Use `8.5in × 11in` for US Letter size
- Use relative units (%, em) where appropriate
- Test both screen view and print output

### 2. Graceful Degradation
- Always provide fallbacks for optional data
- Hide empty sections rather than showing placeholders
- Use conditional rendering: `${data ? 'render' : ''}`

### 3. Maintainability
- Keep CSS organized by component
- Comment complex sections
- Use semantic HTML
- Follow consistent naming conventions

### 4. Performance
- Keep HTML/CSS embedded in single file
- Minimize inline styles (use classes)
- Optimize for pdf generation

### 5. Accessibility
- Use semantic HTML tags (`<h1>`, `<section>`, etc.)
- Ensure sufficient color contrast
- Use readable font sizes (9-11pt for body text)

## Design Guidelines

### Typography
- **Headings**: 11-14pt, bold
- **Body Text**: 9-11pt, normal
- **Small Text**: 8-9pt (dates, meta info)
- **Line Height**: 1.4-1.7 for readability

### Colors
- Use professional color palettes
- Ensure text is readable (contrast ratio ≥ 4.5:1)
- Limit to 2-3 main colors
- Use color consistently for similar elements

### Layout
- Maintain consistent spacing
- Use proper hierarchy
- Keep margins balanced
- Ensure page doesn't overflow

### Content
- Support all resume sections
- Handle missing data gracefully
- Respect user's content ordering
- Don't add fictional content

## Troubleshooting

### Template Not Appearing
- ✅ Check template is registered in `template-registry.ts`
- ✅ Verify import statement is correct
- ✅ Ensure thumbnail path is correct
- ✅ Clear cache and rebuild

### Layout Issues
- ✅ Check container dimensions (`8.5in × 11in`)
- ✅ Verify CSS box-sizing is set to `border-box`
- ✅ Test with different content lengths
- ✅ Check for CSS conflicts

### PDF Generation Issues
- ✅ Keep layout simple (complex CSS may not render)
- ✅ Use web-safe fonts
- ✅ Test with html2pdf.js specifically
- ✅ Avoid absolute positioning where possible

### Data Not Showing
- ✅ Check Resume interface for correct property names
- ✅ Verify conditional rendering logic
- ✅ Test with actual resume data
- ✅ Check for typos in property access

## Template Categories

### Professional
Clean, corporate designs suitable for traditional industries (finance, law, consulting)

### Modern
Contemporary designs with bold colors and modern layouts (tech, startups, creative agencies)

### Creative
Artistic, unique layouts for creative roles (design, marketing, media)

### Minimal
Simple, clean designs focusing on content (academic, research, technical)

## Contributing

When contributing new templates:

1. Follow the structure outlined in this README
2. Test thoroughly with various data
3. Provide a clear, descriptive name
4. Include high-quality thumbnail
5. Document any special features
6. Ensure it works in both preview and PDF export

## Version History

- **v1.0** - Initial system with CV-11eu400-3
- **v1.1** - Added CV-21eu400-2 and CV-31eu500-3
- **v1.2** - Created comprehensive documentation

---

**Maintained by**: Auto-Talent Development Team
**Last Updated**: 2026-01-31
