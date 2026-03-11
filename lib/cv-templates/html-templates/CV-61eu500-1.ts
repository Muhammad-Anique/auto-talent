import { Resume } from '@/lib/types';

/**
 * Olive Accent Two-Column CV Template
 * Based on Screenshot 3 design (Benjamin Torres style)
 * Features: White background, olive/dark green accent stripe at top with landscape,
 * left column with contact/education/skills, right column with profile/experience/reference
 */

export function generateCV61eu5001Template(resume: Resume): string {
  const fullName = `${resume.first_name.toUpperCase()} ${resume.last_name.toUpperCase()}`;
  const targetRole = resume.target_role || 'Professional';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.first_name} ${resume.last_name} - Resume</title>
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
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* Top banner */
    .top-banner {
      height: 55px;
      background: linear-gradient(135deg, #2e7d32 0%, #4caf50 30%, #81c784 55%, #c8e6c9 75%, #e8f5e9 100%);
      position: relative;
    }

    /* Header */
    .header {
      padding: 25px 35px 20px;
      display: flex;
      align-items: baseline;
      gap: 12px;
      border-bottom: 3px solid #3d5c2e;
    }

    .header h1 {
      font-size: 24pt;
      font-weight: bold;
      color: #2c2c2c;
      letter-spacing: 2px;
    }

    .header .role {
      font-size: 10pt;
      color: #3d5c2e;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    /* Two-column layout */
    .body-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Left Column */
    .left-column {
      width: 35%;
      padding: 25px 20px 25px 35px;
      border-right: 1px solid #e0e0e0;
    }

    .left-section {
      margin-bottom: 22px;
    }

    .left-section h2 {
      font-size: 10pt;
      font-weight: bold;
      color: #3d5c2e;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #3d5c2e;
    }

    .contact-item {
      margin-bottom: 7px;
      font-size: 8.5pt;
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
      color: #555;
    }

    .contact-item svg {
      width: 11px;
      height: 11px;
      margin-right: 8px;
      flex-shrink: 0;
      margin-top: 2px;
      fill: #3d5c2e;
    }

    .contact-item a {
      color: #555;
      text-decoration: none;
    }

    .education-item {
      margin-bottom: 14px;
    }

    .education-item .date {
      font-size: 8.5pt;
      color: #3d5c2e;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .education-item h3 {
      font-size: 9pt;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .education-item .degree {
      font-size: 8.5pt;
      color: #666;
      margin-bottom: 1px;
    }

    .education-item .details {
      font-size: 8pt;
      color: #888;
    }

    .skills-list {
      list-style: none;
    }

    .skills-list li {
      margin-bottom: 5px;
      font-size: 8.5pt;
      color: #555;
      padding-left: 14px;
      position: relative;
      line-height: 1.4;
    }

    .skills-list li:before {
      content: '\\25B8';
      position: absolute;
      left: 0;
      color: #3d5c2e;
      font-size: 8pt;
    }

    /* Right Column */
    .right-column {
      width: 65%;
      padding: 25px 35px 25px 25px;
    }

    .right-section {
      margin-bottom: 22px;
    }

    .right-section h2 {
      font-size: 10pt;
      font-weight: bold;
      color: #3d5c2e;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #3d5c2e;
    }

    .profile-text {
      font-size: 9pt;
      line-height: 1.7;
      color: #555;
      text-align: justify;
    }

    .experience-item {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }

    .experience-item h3 {
      font-size: 10pt;
      font-weight: bold;
      color: #333;
    }

    .experience-item .date {
      font-size: 8.5pt;
      color: #3d5c2e;
      font-weight: 600;
      white-space: nowrap;
    }

    .experience-item .company {
      font-size: 9pt;
      color: #666;
      font-style: italic;
      margin-bottom: 4px;
    }

    .experience-item ul {
      margin-left: 16px;
      margin-top: 4px;
      list-style: none;
    }

    .experience-item li {
      font-size: 8.5pt;
      color: #444;
      margin-bottom: 3px;
      line-height: 1.5;
      padding-left: 12px;
      position: relative;
    }

    .experience-item li:before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      color: #3d5c2e;
      font-size: 6pt;
      top: 3px;
    }

    .reference-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .reference-item h3 {
      font-size: 9pt;
      font-weight: bold;
      color: #333;
    }

    .reference-item .ref-title {
      font-size: 8pt;
      color: #666;
    }

    .reference-item .ref-contact {
      font-size: 8pt;
      color: #888;
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
    <!-- Top Banner -->
    <div class="top-banner"></div>

    <!-- Header -->
    <div class="header">
      <h1>${fullName}</h1>
      <div class="role">${targetRole}</div>
    </div>

    <!-- Body Content -->
    <div class="body-content">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Contact Section -->
        <div class="left-section">
          <h2>Contact</h2>
          ${resume.phone_number ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
            <span>${resume.phone_number}</span>
          </div>
          ` : ''}
          ${resume.email ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            <span>${resume.email}</span>
          </div>
          ` : ''}
          ${resume.location ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            <span>${resume.location}</span>
          </div>
          ` : ''}
          ${resume.website ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>
            <a href="${resume.website}" target="_blank">${resume.website.replace('https://', '').replace('http://', '')}</a>
          </div>
          ` : ''}
          ${resume.linkedin_url ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/></svg>
            <a href="${resume.linkedin_url}" target="_blank">LinkedIn</a>
          </div>
          ` : ''}
        </div>

        <!-- Education Section -->
        ${resume.education && resume.education.length > 0 ? `
        <div class="left-section">
          <h2>Education</h2>
          ${resume.education.map(edu => `
            <div class="education-item">
              <div class="date">${edu.date}</div>
              <h3>${edu.school}</h3>
              <div class="degree">${edu.degree}${edu.field ? ' in ' + edu.field : ''}</div>
              ${edu.gpa ? `<div class="details">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Skills Section -->
        ${resume.skills && resume.skills.length > 0 ? `
        <div class="left-section">
          <h2>Skills</h2>
          <ul class="skills-list">
            ${resume.skills.map(skill =>
              skill.items.slice(0, 10).map(item => `<li>${item}</li>`).join('')
            ).join('')}
          </ul>
        </div>
        ` : ''}
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Profile Section -->
        <div class="right-section">
          <h2>Profile</h2>
          <div class="profile-text">
            ${targetRole} with extensive experience in ${resume.work_experience?.[0]?.company || 'leading organizations'}.
            Strong expertise in ${resume.skills?.[0]?.items?.[0] || 'strategic planning'},
            ${resume.skills?.[0]?.items?.[1] || 'project management'}, and
            ${resume.skills?.[0]?.items?.[2] || 'team collaboration'}.
            Committed to delivering impactful results and advancing organizational objectives through innovative approaches.
          </div>
        </div>

        <!-- Work Experience Section -->
        ${resume.work_experience && resume.work_experience.length > 0 ? `
        <div class="right-section">
          <h2>Work Experience</h2>
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

        <!-- Projects Section -->
        ${resume.projects && resume.projects.length > 0 ? `
        <div class="right-section">
          <h2>Projects</h2>
          ${resume.projects.map(project => `
            <div class="experience-item">
              <div class="experience-header">
                <h3>${project.name}</h3>
                ${project.date ? `<span class="date">${project.date}</span>` : ''}
              </div>
              ${project.description && project.description.length > 0 ? `
                <ul>
                  ${project.description.map(desc => `<li>${desc}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Reference Section -->
        <div class="right-section">
          <h2>Reference</h2>
          <div class="reference-grid">
            <div class="reference-item">
              <h3>Available upon request</h3>
              <div class="ref-title">Professional references will be provided during the interview process.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
