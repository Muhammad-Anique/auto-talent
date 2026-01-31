import { Resume } from '@/lib/types';

/**
 * Professional Red Sidebar CV Template
 * Based on CV-21eu400-2 design
 * Features: Burgundy/red sidebar with cream main content area
 */

export function generateCV21eu4002Template(resume: Resume): string {
  const fullName = `${resume.first_name} ${resume.last_name}`;
  const targetRole = resume.target_role || 'Financial & Investment Planner';

  // Get profile picture or use placeholder
  const profileImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Ccircle cx="75" cy="75" r="75" fill="%23ccc"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="50" font-family="Arial"%3E' + resume.first_name.charAt(0) + resume.last_name.charAt(0) + '%3C/text%3E%3C/svg%3E';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} - Resume</title>
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
      display: flex;
      background: white;
      overflow: hidden;
    }

    /* Left Sidebar */
    .sidebar {
      width: 32%;
      background: linear-gradient(180deg, #8B3A3A 0%, #6B2D2D 100%);
      color: white;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
    }

    .profile-picture {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: 0 auto 20px;
      border: 3px solid white;
      object-fit: cover;
    }

    .sidebar-section {
      margin-bottom: 28px;
    }

    .sidebar-section h2 {
      font-size: 11pt;
      font-weight: bold;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      letter-spacing: 0.5px;
    }

    .contact-item {
      margin-bottom: 12px;
      font-size: 9pt;
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
    }

    .contact-item svg {
      width: 14px;
      height: 14px;
      margin-right: 10px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .contact-item a {
      color: white;
      text-decoration: none;
      word-break: break-all;
    }

    .languages-section {
      margin-top: 20px;
    }

    .languages-list {
      list-style: none;
    }

    .languages-item {
      margin-bottom: 8px;
      font-size: 9pt;
    }

    .languages-item strong {
      display: block;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .key-skills-list {
      list-style: none;
    }

    .key-skills-list li {
      margin-bottom: 8px;
      font-size: 9pt;
      padding-left: 18px;
      position: relative;
      line-height: 1.4;
    }

    .key-skills-list li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.9);
      font-weight: bold;
    }

    /* Main Content */
    .main-content {
      width: 68%;
      background: #FAF7F5;
      padding: 40px 30px;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 26pt;
      font-weight: normal;
      color: #333;
      margin-bottom: 2px;
      letter-spacing: 0.5px;
    }

    .header .role {
      font-size: 11pt;
      color: #8B3A3A;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .section {
      margin-bottom: 25px;
    }

    .section h2 {
      font-size: 12pt;
      font-weight: bold;
      color: #8B3A3A;
      margin-bottom: 12px;
      padding-bottom: 4px;
      letter-spacing: 0.3px;
    }

    .experience-item {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }

    .experience-item h3 {
      font-size: 11pt;
      font-weight: bold;
      color: #333;
      margin-bottom: 3px;
    }

    .experience-item .company {
      font-size: 10pt;
      color: #666;
      margin-bottom: 6px;
    }

    .experience-item .date {
      font-size: 9pt;
      color: #999;
      margin-bottom: 6px;
    }

    .experience-item ul {
      margin-left: 18px;
      margin-top: 4px;
    }

    .experience-item li {
      font-size: 9pt;
      color: #555;
      margin-bottom: 4px;
      line-height: 1.6;
    }

    .experience-item li:before {
      content: '•';
      color: #8B3A3A;
      font-weight: bold;
      margin-right: 8px;
      margin-left: -18px;
      position: absolute;
    }

    .education-main-item {
      margin-bottom: 15px;
    }

    .education-main-item h3 {
      font-size: 10pt;
      font-weight: bold;
      color: #333;
      margin-bottom: 3px;
    }

    .education-main-item .institution {
      font-size: 9pt;
      color: #666;
      margin-bottom: 2px;
    }

    .education-main-item .date {
      font-size: 9pt;
      color: #999;
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
    <!-- Left Sidebar -->
    <div class="sidebar">
      <img src="${profileImage}" alt="Profile Picture" class="profile-picture" />

      <!-- Contact Section -->
      <div class="sidebar-section">
        <h2>Contact</h2>
        ${resume.phone_number ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${resume.phone_number}</span>
        </div>
        ` : ''}
        ${resume.email ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          <span>${resume.email}</span>
        </div>
        ` : ''}
        ${resume.website ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>
          <a href="${resume.website}" target="_blank">${resume.website.replace(/^https?:\/\//, '')}</a>
        </div>
        ` : ''}
        ${resume.linkedin_url ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/></svg>
          <a href="${resume.linkedin_url}" target="_blank">LinkedIn</a>
        </div>
        ` : ''}
      </div>

      <!-- Languages Section -->
      <div class="sidebar-section languages-section">
        <h2>Languages</h2>
        <ul class="languages-list">
          <li class="languages-item">
            <strong>English</strong>
            Native
          </li>
          ${resume.current_language && resume.current_language !== 'en' ? `
          <li class="languages-item">
            <strong>${resume.current_language}</strong>
            Professional
          </li>
          ` : ''}
        </ul>
      </div>

      <!-- Key Skills Section -->
      ${resume.skills && resume.skills.length > 0 ? `
      <div class="sidebar-section">
        <h2>Key Skills</h2>
        <ul class="key-skills-list">
          ${resume.skills.map(skill =>
            skill.items.slice(0, 6).map(item => `<li>${item}</li>`).join('')
          ).join('')}
        </ul>
      </div>
      ` : ''}
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1>${fullName}</h1>
        <div class="role">${targetRole}</div>
      </div>

      <!-- Professional Experience Section -->
      ${resume.work_experience && resume.work_experience.length > 0 ? `
      <div class="section">
        <h2>Professional Experience</h2>
        ${resume.work_experience.map(exp => `
          <div class="experience-item">
            <h3>${exp.position}</h3>
            <div class="company">${exp.company}${exp.location ? ' | ' + exp.location : ''}</div>
            <div class="date">${exp.date}</div>
            ${exp.description && exp.description.length > 0 ? `
              <ul style="list-style: none; padding-left: 0;">
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
          <div class="education-main-item">
            <h3>${edu.degree}${edu.field ? ' in ' + edu.field : ''}</h3>
            <div class="institution">${edu.school}</div>
            <div class="date">${edu.date}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Projects Section -->
      ${resume.projects && resume.projects.length > 0 ? `
      <div class="section">
        <h2>Key Projects</h2>
        ${resume.projects.map(project => `
          <div class="experience-item">
            <h3>${project.name}</h3>
            ${project.date ? `<div class="date">${project.date}</div>` : ''}
            ${project.description && project.description.length > 0 ? `
              <ul style="list-style: none; padding-left: 0;">
                ${project.description.map(desc => `<li>${desc}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `.trim();
}
