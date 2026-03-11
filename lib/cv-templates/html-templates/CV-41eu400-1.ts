import { Resume } from '@/lib/types';

/**
 * Blue Sidebar CV Template
 * Based on Screenshot 1 design
 * Features: Blue left sidebar with profile photo, PROFILE and SKILLS sections on left,
 * EXPERIENCE section on right with detailed work history
 */

export function generateCV41eu4001Template(resume: Resume): string {
  const fullName = `${resume.first_name} ${resume.last_name}`;
  const targetRole = resume.target_role || 'Professional';

  const profileImage = resume.profile_pic || 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

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
      width: 38%;
      background: #1a5276;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 30px 22px 25px;
      text-align: center;
    }

    .profile-picture {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      margin: 0 auto 18px;
      border: 4px solid rgba(255, 255, 255, 0.4);
      object-fit: cover;
      display: block;
    }

    .sidebar-name {
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    .sidebar-role {
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.85;
      font-weight: 600;
    }

    .sidebar-body {
      padding: 0 22px 30px;
      flex: 1;
    }

    .sidebar-section {
      margin-bottom: 22px;
    }

    .sidebar-section h2 {
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.25);
      letter-spacing: 1.5px;
    }

    .profile-text {
      font-size: 8.5pt;
      line-height: 1.6;
      opacity: 0.9;
      text-align: justify;
    }

    .contact-item {
      margin-bottom: 8px;
      font-size: 8.5pt;
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
    }

    .contact-item svg {
      width: 11px;
      height: 11px;
      margin-right: 8px;
      flex-shrink: 0;
      margin-top: 2px;
      fill: rgba(255, 255, 255, 0.8);
    }

    .contact-item a {
      color: white;
      text-decoration: none;
      word-break: break-all;
    }

    .skills-list {
      list-style: none;
    }

    .skills-list li {
      margin-bottom: 5px;
      font-size: 8.5pt;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      display: inline-block;
      margin-right: 4px;
    }

    .education-item {
      margin-bottom: 12px;
    }

    .education-item h3 {
      font-size: 9pt;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .education-item .degree {
      font-size: 8.5pt;
      opacity: 0.85;
      margin-bottom: 1px;
    }

    .education-item .date {
      font-size: 8pt;
      opacity: 0.7;
    }

    /* Main Content */
    .main-content {
      width: 62%;
      background: white;
      padding: 35px 30px;
    }

    .main-header {
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 3px solid #1a5276;
    }

    .main-header h1 {
      font-size: 24pt;
      font-weight: bold;
      color: #1a5276;
      letter-spacing: 1px;
      margin-bottom: 3px;
    }

    .main-header .role {
      font-size: 11pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section h2 {
      font-size: 12pt;
      font-weight: bold;
      color: #1a5276;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-bottom: 4px;
      border-bottom: 1px solid #ddd;
    }

    .experience-item {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }

    .experience-item h3 {
      font-size: 10.5pt;
      font-weight: bold;
      color: #1a5276;
    }

    .experience-item .date {
      font-size: 8.5pt;
      color: #1a5276;
      font-weight: 600;
      white-space: nowrap;
    }

    .experience-item .company {
      font-size: 9.5pt;
      color: #666;
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
      content: '\\2022';
      position: absolute;
      left: 0;
      color: #1a5276;
      font-weight: bold;
    }

    .projects-item {
      margin-bottom: 12px;
    }

    .projects-item h3 {
      font-size: 10pt;
      font-weight: bold;
      color: #1a5276;
      margin-bottom: 3px;
    }

    .projects-item ul {
      margin-left: 16px;
      margin-top: 3px;
      list-style: none;
    }

    .projects-item li {
      font-size: 8.5pt;
      color: #444;
      margin-bottom: 3px;
      padding-left: 12px;
      position: relative;
    }

    .projects-item li:before {
      content: '\\2022';
      position: absolute;
      left: 0;
      color: #1a5276;
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
      <div class="sidebar-header">
        <img src="${profileImage}" alt="Profile Picture" class="profile-picture" />
        <div class="sidebar-name">${fullName}</div>
        <div class="sidebar-role">${targetRole}</div>
      </div>

      <div class="sidebar-body">
        <!-- Profile Section -->
        <div class="sidebar-section">
          <h2>Profile</h2>
          <div class="profile-text">
            ${targetRole} with a proven track record in ${resume.work_experience?.[0]?.company || 'various organizations'}.
            Skilled in ${resume.skills?.[0]?.items?.[0] || 'professional development'} and ${resume.skills?.[0]?.items?.[1] || 'team collaboration'}.
            Committed to delivering high-quality results and driving success.
          </div>
        </div>

        <!-- Contact Section -->
        <div class="sidebar-section">
          <h2>Contact</h2>
          ${resume.email ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            <span>${resume.email}</span>
          </div>
          ` : ''}
          ${resume.phone_number ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
            <span>${resume.phone_number}</span>
          </div>
          ` : ''}
          ${resume.location ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            <span>${resume.location}</span>
          </div>
          ` : ''}
          ${resume.linkedin_url ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/></svg>
            <a href="${resume.linkedin_url}" target="_blank">LinkedIn</a>
          </div>
          ` : ''}
          ${resume.github_url ? `
          <div class="contact-item">
            <svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/></svg>
            <a href="${resume.github_url}" target="_blank">GitHub</a>
          </div>
          ` : ''}
        </div>

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

        <!-- Education Section -->
        ${resume.education && resume.education.length > 0 ? `
        <div class="sidebar-section">
          <h2>Education</h2>
          ${resume.education.map(edu => `
            <div class="education-item">
              <h3>${edu.school}</h3>
              <div class="degree">${edu.degree}${edu.field ? ' in ' + edu.field : ''}</div>
              <div class="date">${edu.date}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="main-header">
        <h1>${fullName}</h1>
        <div class="role">${targetRole}</div>
      </div>

      <!-- Work Experience Section -->
      ${resume.work_experience && resume.work_experience.length > 0 ? `
      <div class="section">
        <h2>Experience</h2>
        ${resume.work_experience.map(exp => `
          <div class="experience-item">
            <div class="experience-header">
              <h3>${exp.position}</h3>
              <span class="date">${exp.date}</span>
            </div>
            <div class="company">${exp.company}${exp.location ? ' | ' + exp.location : ''}</div>
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
            <h3>${project.name}${project.date ? ' - ' + project.date : ''}</h3>
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
  </div>
</body>
</html>
  `.trim();
}
