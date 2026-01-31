import { Resume } from '@/lib/types';

/**
 * Modern Orange Accent CV Template
 * Based on CV-31eu500-3 design
 * Features: Clean single-column layout with orange accent color
 */

export function generateCV31eu5003Template(resume: Resume): string {
  const firstName = resume.first_name;
  const lastName = resume.last_name.toUpperCase();
  const targetRole = resume.target_role || 'Professional';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${firstName} ${resume.last_name} - Resume</title>
  <style>
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
      width: 8.5in;
      height: 11in;
      background: white;
      padding: 50px 60px;
      overflow: hidden;
    }

    /* Header */
    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 32pt;
      font-weight: 300;
      color: #333;
      margin-bottom: 5px;
      letter-spacing: 1px;
    }

    .header h1 .last-name {
      color: #E67E22;
      font-weight: 600;
    }

    .header .role {
      font-size: 13pt;
      color: #666;
      margin-bottom: 15px;
      font-weight: 400;
    }

    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-size: 9pt;
      color: #666;
      border-bottom: 2px solid #E67E22;
      padding-bottom: 15px;
    }

    .contact-info .item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .contact-info svg {
      width: 12px;
      height: 12px;
      color: #E67E22;
    }

    .contact-info a {
      color: #666;
      text-decoration: none;
    }

    /* Section Styles */
    .section {
      margin-bottom: 25px;
    }

    .section h2 {
      font-size: 13pt;
      font-weight: bold;
      color: #E67E22;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .summary-text {
      font-size: 10pt;
      line-height: 1.7;
      color: #555;
      text-align: justify;
    }

    /* Experience Items */
    .experience-item {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .experience-item h3 {
      font-size: 11pt;
      font-weight: bold;
      color: #333;
    }

    .experience-item .date {
      font-size: 9pt;
      color: #E67E22;
      font-weight: 600;
      white-space: nowrap;
    }

    .experience-item .company {
      font-size: 10pt;
      color: #666;
      margin-bottom: 6px;
      font-style: italic;
    }

    .experience-item ul {
      margin-left: 20px;
      margin-top: 6px;
      list-style: none;
    }

    .experience-item li {
      font-size: 9pt;
      color: #555;
      margin-bottom: 5px;
      line-height: 1.6;
      padding-left: 15px;
      position: relative;
    }

    .experience-item li:before {
      content: '●';
      position: absolute;
      left: 0;
      color: #E67E22;
      font-size: 8pt;
    }

    /* Education Items */
    .education-item {
      margin-bottom: 15px;
    }

    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }

    .education-item h3 {
      font-size: 11pt;
      font-weight: bold;
      color: #333;
    }

    .education-item .date {
      font-size: 9pt;
      color: #E67E22;
      font-weight: 600;
    }

    .education-item .institution {
      font-size: 10pt;
      color: #666;
      font-style: italic;
    }

    .education-item .details {
      font-size: 9pt;
      color: #777;
      margin-top: 2px;
    }

    /* Skills Section */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 10px;
    }

    .skill-item {
      font-size: 9pt;
      color: #555;
      padding-left: 15px;
      position: relative;
    }

    .skill-item:before {
      content: '●';
      position: absolute;
      left: 0;
      color: #E67E22;
      font-size: 8pt;
    }

    /* Certifications */
    .cert-item {
      margin-bottom: 10px;
    }

    .cert-item h3 {
      font-size: 10pt;
      font-weight: bold;
      color: #333;
    }

    .cert-item .issuer {
      font-size: 9pt;
      color: #666;
      font-style: italic;
    }

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
    <!-- Header -->
    <div class="header">
      <h1>${firstName} <span class="last-name">${lastName}</span></h1>
      <div class="role">${targetRole}</div>
      <div class="contact-info">
        ${resume.phone_number ? `
        <div class="item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${resume.phone_number}</span>
        </div>
        ` : ''}
        ${resume.email ? `
        <div class="item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          <span>${resume.email}</span>
        </div>
        ` : ''}
        ${resume.location ? `
        <div class="item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          <span>${resume.location}</span>
        </div>
        ` : ''}
        ${resume.linkedin_url ? `
        <div class="item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/></svg>
          <a href="${resume.linkedin_url}" target="_blank">LinkedIn</a>
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Summary Section -->
    <div class="section">
      <h2>Professional Summary</h2>
      <div class="summary-text">
        ${targetRole} with extensive experience in ${resume.work_experience?.[0]?.company || 'leading organizations'}.
        Proven track record in ${resume.skills?.[0]?.items?.[0] || 'professional excellence'},
        ${resume.skills?.[0]?.items?.[1] || 'strategic planning'}, and
        ${resume.skills?.[0]?.items?.[2] || 'team leadership'}.
        Committed to delivering exceptional results and driving organizational success through innovation and strategic thinking.
      </div>
    </div>

    <!-- Work Experience Section -->
    ${resume.work_experience && resume.work_experience.length > 0 ? `
    <div class="section">
      <h2>Professional Experience</h2>
      ${resume.work_experience.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <h3>${exp.position}</h3>
            <span class="date">${exp.date}</span>
          </div>
          <div class="company">${exp.company}${exp.location ? ' - ' + exp.location : ''}</div>
          ${exp.description && exp.description.length > 0 ? `
            <ul>
              ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Education Section -->
    ${resume.education && resume.education.length > 0 ? `
    <div class="section">
      <h2>Education</h2>
      ${resume.education.map(edu => `
        <div class="education-item">
          <div class="education-header">
            <h3>${edu.degree}${edu.field ? ' in ' + edu.field : ''}</h3>
            <span class="date">${edu.date}</span>
          </div>
          <div class="institution">${edu.school}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Skills Section -->
    ${resume.skills && resume.skills.length > 0 ? `
    <div class="section">
      <h2>Core Competencies</h2>
      <div class="skills-grid">
        ${resume.skills.map(skill =>
          skill.items.map(item => `<div class="skill-item">${item}</div>`).join('')
        ).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Projects/Certifications Section -->
    ${resume.projects && resume.projects.length > 0 ? `
    <div class="section">
      <h2>Key Projects & Achievements</h2>
      ${resume.projects.map(project => `
        <div class="experience-item">
          <h3>${project.name}</h3>
          ${project.date ? `<div class="date">${project.date}</div>` : ''}
          ${project.description && project.description.length > 0 ? `
            <ul>
              ${project.description.map(desc => `<li>${desc}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
  </div>
</body>
</html>
  `.trim();
}
