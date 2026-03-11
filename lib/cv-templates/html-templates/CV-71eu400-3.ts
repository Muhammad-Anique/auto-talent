import { Resume } from '@/lib/types';

/**
 * Dark Sidebar with Circular Photo CV Template
 * Based on Screenshot 4 design (Martin Sanchez style)
 * Features: Dark navy sidebar with circular photo, contact, education, skills, languages on left.
 * Right side has profile, work experience, reference. Green landscape banner at top.
 */

export function generateCV71eu4003Template(resume: Resume): string {
  const firstName = resume.first_name.toUpperCase();
  const lastName = resume.last_name.toUpperCase();
  const targetRole = resume.target_role || 'Professional';

  const profileImage = resume.profile_pic || 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

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
      display: flex;
      background: white;
      overflow: hidden;
    }

    /* Left Sidebar */
    .sidebar {
      width: 36%;
      background: #1c2b3a;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .sidebar-banner {
      width: 100%;
      height: 55px;
      background: linear-gradient(135deg, #2e7d32 0%, #43a047 30%, #66bb6a 55%, #a5d6a7 80%, #c8e6c9 100%);
      position: relative;
    }

    .sidebar-banner::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 25px;
      background: linear-gradient(to top, #1c2b3a, transparent);
    }

    .photo-wrapper {
      display: flex;
      justify-content: center;
      margin-top: -35px;
      position: relative;
      z-index: 1;
      margin-bottom: 10px;
    }

    .profile-picture {
      width: 95px;
      height: 95px;
      border-radius: 50%;
      border: 4px solid #1c2b3a;
      object-fit: cover;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .sidebar-name {
      text-align: center;
      padding: 0 18px;
      margin-bottom: 3px;
    }

    .sidebar-name h2 {
      font-size: 13pt;
      letter-spacing: 2px;
      font-weight: bold;
    }

    .sidebar-name h2 .first-name {
      font-weight: 300;
    }

    .sidebar-role {
      text-align: center;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #7ec8e3;
      margin-bottom: 18px;
      font-weight: 600;
    }

    .sidebar-body {
      padding: 0 18px 20px;
      flex: 1;
      overflow: hidden;
    }

    .sidebar-section {
      margin-bottom: 18px;
    }

    .sidebar-section h2 {
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      letter-spacing: 1.5px;
      color: #7ec8e3;
    }

    .contact-item {
      margin-bottom: 7px;
      font-size: 8pt;
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
    }

    .contact-item svg {
      width: 10px;
      height: 10px;
      margin-right: 7px;
      flex-shrink: 0;
      margin-top: 2px;
      fill: #7ec8e3;
    }

    .contact-item a {
      color: white;
      text-decoration: none;
      word-break: break-all;
    }

    .education-item {
      margin-bottom: 12px;
    }

    .education-item .date {
      font-size: 8pt;
      color: #7ec8e3;
      font-weight: 600;
      margin-bottom: 1px;
    }

    .education-item h3 {
      font-size: 8.5pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 1px;
    }

    .education-item .degree {
      font-size: 8pt;
      opacity: 0.8;
    }

    .education-item .details {
      font-size: 7.5pt;
      opacity: 0.6;
    }

    .skills-list {
      list-style: none;
    }

    .skills-list li {
      margin-bottom: 4px;
      font-size: 8pt;
      padding-left: 12px;
      position: relative;
      line-height: 1.4;
    }

    .skills-list li:before {
      content: '\\25B8';
      position: absolute;
      left: 0;
      color: #7ec8e3;
      font-size: 7pt;
    }

    .languages-list {
      list-style: none;
    }

    .languages-list li {
      margin-bottom: 5px;
      font-size: 8pt;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .languages-list .lang-name {
      font-weight: bold;
    }

    .languages-list .lang-level {
      opacity: 0.7;
      font-size: 7.5pt;
    }

    /* Main Content */
    .main-content {
      width: 64%;
      background: white;
      padding: 30px 28px;
    }

    .main-header {
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #1c2b3a;
    }

    .main-header h1 {
      font-size: 22pt;
      color: #1c2b3a;
      letter-spacing: 3px;
      margin-bottom: 3px;
    }

    .main-header h1 .first-name {
      font-weight: 300;
    }

    .main-header h1 .last-name {
      font-weight: bold;
    }

    .main-header .role {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section h2 {
      font-size: 10pt;
      font-weight: bold;
      color: #1c2b3a;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 2px solid #7ec8e3;
    }

    .profile-text {
      font-size: 8.5pt;
      line-height: 1.7;
      color: #555;
      text-align: justify;
    }

    .experience-item {
      margin-bottom: 14px;
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
      color: #1c2b3a;
    }

    .experience-item .date {
      font-size: 8pt;
      color: #999;
      white-space: nowrap;
    }

    .experience-item .company {
      font-size: 8.5pt;
      color: #666;
      font-style: italic;
      margin-bottom: 3px;
    }

    .experience-item ul {
      margin-left: 14px;
      margin-top: 3px;
      list-style: none;
    }

    .experience-item li {
      font-size: 8pt;
      color: #444;
      margin-bottom: 2px;
      line-height: 1.5;
      padding-left: 12px;
      position: relative;
    }

    .experience-item li:before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      color: #7ec8e3;
      font-size: 5pt;
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
      color: #1c2b3a;
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
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="sidebar-banner"></div>
      <div class="photo-wrapper">
        <img src="${profileImage}" alt="Profile Picture" class="profile-picture" />
      </div>
      <div class="sidebar-name">
        <h2><span class="first-name">${firstName}</span> ${lastName}</h2>
      </div>
      <div class="sidebar-role">${targetRole}</div>

      <div class="sidebar-body">
        <!-- Contact Section -->
        <div class="sidebar-section">
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
        <div class="sidebar-section">
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
        <div class="sidebar-section">
          <h2>Skills</h2>
          <ul class="skills-list">
            ${resume.skills.map(skill =>
              skill.items.slice(0, 8).map(item => `<li>${item}</li>`).join('')
            ).join('')}
          </ul>
        </div>
        ` : ''}

        <!-- Languages Section -->
        <div class="sidebar-section">
          <h2>Languages</h2>
          <ul class="languages-list">
            <li><span class="lang-name">English</span><span class="lang-level">(Native)</span></li>
            ${resume.current_language && resume.current_language !== 'en' ? `<li><span class="lang-name">${resume.current_language}</span><span class="lang-level">(Professional)</span></li>` : ''}
          </ul>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="main-header">
        <h1><span class="first-name">${firstName}</span> <span class="last-name">${lastName}</span></h1>
        <div class="role">${targetRole}</div>
      </div>

      <!-- Profile Section -->
      <div class="section">
        <h2>Profile</h2>
        <div class="profile-text">
          ${targetRole} with a strong background in ${resume.work_experience?.[0]?.company || 'diverse professional environments'}.
          Expertise in ${resume.skills?.[0]?.items?.[0] || 'strategic planning'},
          ${resume.skills?.[0]?.items?.[1] || 'leadership'}, and
          ${resume.skills?.[0]?.items?.[2] || 'innovation'}.
          Passionate about delivering measurable results and building high-performing teams that exceed objectives.
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
      <div class="section">
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
      <div class="section">
        <h2>Reference</h2>
        <div class="reference-grid">
          <div class="reference-item">
            <h3>Available upon request</h3>
            <div class="ref-title">Professional references provided during interview.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
