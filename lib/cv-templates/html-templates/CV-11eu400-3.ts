import { Resume } from '@/lib/types';

/**
 * Professional Two-Column CV Template
 * Based on CV-11eu400-3 design
 * Features: Dark blue sidebar with light gray main content area
 */

export function generateCV11eu4003Template(resume: Resume): string {
  const fullName = `${resume.first_name} ${resume.last_name}`.toUpperCase();
  const targetRole = resume.target_role?.toUpperCase() || 'PROFESSIONAL';

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
      width: 35%;
      background: #2d3e50;
      color: white;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
    }

    .profile-picture {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto 20px;
      border: 4px solid white;
      object-fit: cover;
    }

    .sidebar-section {
      margin-bottom: 25px;
    }

    .sidebar-section h2 {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      letter-spacing: 1px;
    }

    .contact-item {
      margin-bottom: 10px;
      font-size: 9pt;
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
    }

    .contact-item svg {
      width: 12px;
      height: 12px;
      margin-right: 8px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .contact-item a {
      color: white;
      text-decoration: none;
      word-break: break-all;
    }

    .education-item {
      margin-bottom: 15px;
    }

    .education-item h3 {
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .education-item .degree {
      font-size: 9pt;
      margin-bottom: 2px;
    }

    .education-item .date {
      font-size: 8pt;
      opacity: 0.8;
    }

    .skills-list {
      list-style: none;
    }

    .skills-list li {
      margin-bottom: 8px;
      font-size: 9pt;
      padding-left: 15px;
      position: relative;
    }

    .skills-list li:before {
      content: '●';
      position: absolute;
      left: 0;
      color: rgba(255, 255, 255, 0.7);
    }

    .languages-list {
      list-style: none;
    }

    .languages-list li {
      margin-bottom: 6px;
      font-size: 9pt;
    }

    /* Main Content */
    .main-content {
      width: 65%;
      background: #f5f5f5;
      padding: 30px 25px;
    }

    .header {
      margin-bottom: 25px;
      background: white;
      padding: 20px;
      border-left: 4px solid #2d3e50;
    }

    .header h1 {
      font-size: 22pt;
      font-weight: bold;
      color: #2d3e50;
      margin-bottom: 5px;
      letter-spacing: 2px;
    }

    .header .role {
      font-size: 12pt;
      color: #666;
      letter-spacing: 1px;
    }

    .section {
      margin-bottom: 20px;
      background: white;
      padding: 18px 20px;
    }

    .section h2 {
      font-size: 13pt;
      font-weight: bold;
      color: #2d3e50;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid #2d3e50;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .profile-text {
      font-size: 9pt;
      line-height: 1.6;
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
      margin-bottom: 4px;
    }

    .experience-item h3 {
      font-size: 11pt;
      font-weight: bold;
      color: #2d3e50;
    }

    .experience-item .company {
      font-size: 10pt;
      color: #666;
      margin-bottom: 4px;
    }

    .experience-item .date {
      font-size: 9pt;
      color: #888;
      font-weight: normal;
      white-space: nowrap;
    }

    .experience-item ul {
      margin-left: 18px;
      margin-top: 6px;
    }

    .experience-item li {
      font-size: 9pt;
      color: #555;
      margin-bottom: 4px;
      line-height: 1.5;
    }

    .projects-item {
      margin-bottom: 12px;
    }

    .projects-item h3 {
      font-size: 10pt;
      font-weight: bold;
      color: #2d3e50;
      margin-bottom: 4px;
    }

    .projects-item ul {
      margin-left: 18px;
      margin-top: 4px;
    }

    .projects-item li {
      font-size: 9pt;
      color: #555;
      margin-bottom: 3px;
    }

    .reference-item {
      margin-bottom: 12px;
    }

    .reference-item h3 {
      font-size: 10pt;
      font-weight: bold;
      color: #2d3e50;
    }

    .reference-item .title {
      font-size: 9pt;
      color: #666;
      margin-bottom: 2px;
    }

    .reference-item .contact {
      font-size: 9pt;
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
    <!-- Left Sidebar -->
    <div class="sidebar">
      <img src="${profileImage}" alt="Profile Picture" class="profile-picture" />

      <!-- Contact Section -->
      <div class="sidebar-section">
        <h2>Contact</h2>
        ${resume.email ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          <span>${resume.email}</span>
        </div>
        ` : ''}
        ${resume.phone_number ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${resume.phone_number}</span>
        </div>
        ` : ''}
        ${resume.location ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          <span>${resume.location}</span>
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
        ${resume.github_url ? `
        <div class="contact-item">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/></svg>
          <a href="${resume.github_url}" target="_blank">GitHub</a>
        </div>
        ` : ''}
      </div>

      <!-- Education Section -->
      ${resume.education && resume.education.length > 0 ? `
      <div class="sidebar-section">
        <h2>Education</h2>
        ${resume.education.map(edu => `
          <div class="education-item">
            <h3>${edu.school}</h3>
            <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
            <div class="date">${edu.date}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Skills Section -->
      ${resume.skills && resume.skills.length > 0 ? `
      <div class="sidebar-section">
        <h2>Skills</h2>
        <ul class="skills-list">
          ${resume.skills.map(skill =>
            skill.items.map(item => `<li>${item}</li>`).join('')
          ).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Languages Section -->
      <div class="sidebar-section">
        <h2>Languages</h2>
        <ul class="languages-list">
          <li>English - Native</li>
          ${resume.current_language && resume.current_language !== 'en' ? `<li>${resume.current_language} - Professional</li>` : ''}
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1>${fullName}</h1>
        <div class="role">${targetRole}</div>
      </div>

      <!-- Profile Section -->
      <div class="section">
        <h2>Profile</h2>
        <div class="profile-text">
          Experienced ${targetRole.toLowerCase()} with a proven track record of success in ${resume.work_experience?.[0]?.company || 'various organizations'}.
          Strong background in ${resume.skills?.[0]?.items?.[0] || 'professional development'} and ${resume.skills?.[0]?.items?.[1] || 'team collaboration'}.
          Dedicated to delivering high-quality results and driving organizational success through innovation and strategic thinking.
        </div>
      </div>

      <!-- Work Experience Section -->
      ${resume.work_experience && resume.work_experience.length > 0 ? `
      <div class="section">
        <h2>Work Experience</h2>
        ${resume.work_experience.map(exp => `
          <div class="experience-item">
            <div class="experience-header">
              <h3>${exp.position}</h3>
              <span class="date">${exp.date}</span>
            </div>
            <div class="company">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
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
      <div class="section">
        <h2>Projects</h2>
        ${resume.projects.map(project => `
          <div class="projects-item">
            <h3>${project.name}${project.date ? ` - ${project.date}` : ''}</h3>
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
      <div class="section">
        <h2>Reference</h2>
        <div class="reference-item">
          <h3>Available upon request</h3>
          <div class="title">Professional references will be provided during the interview process.</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
