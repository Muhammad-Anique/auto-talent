import { Resume } from '@/lib/types';

/**
 * CV2: Dark Red Sidebar Resume
 * Two-column layout: dark red/maroon sidebar (35%) with circular profile photo (red border),
 * name, role, profile summary, contact, languages, key skills.
 * Right side: white content with professional experience and education.
 * Fonts: Playfair Display (headings), Source Sans Pro (body).
 * Accent: Red #8B1A1A (sidebar), #C0392B (accent), Text dark #2c3e50.
 */

export function generateCV2Template(resume: Resume): string {
  const fullName = `${resume.first_name} ${resume.last_name}`;
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #2c3e50;
    }

    .resume-container {
      width: 8.5in;
      height: 11in;
      display: flex;
      background: white;
      overflow: hidden;
    }

    /* ── Left Sidebar ── */
    .sidebar {
      width: 35%;
      background: #7B1A2C;
      color: #ffffff;
      padding: 0 20px 30px;
      display: flex;
      flex-direction: column;
    }

    .profile-area {
      text-align: center;
      padding: 30px 0 15px;
    }

    .profile-picture-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin: 0 auto 15px;
      border: 4px solid #C0392B;
      overflow: hidden;
    }

    .profile-picture {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }

    .sidebar-name {
      font-family: 'Playfair Display', serif;
      font-size: 16pt;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
    }

    .sidebar-role {
      font-family: 'Source Sans Pro', sans-serif;
      font-size: 9pt;
      color: rgba(255,255,255,0.8);
      font-weight: 400;
      margin-bottom: 10px;
    }

    .sidebar-profile-text {
      font-size: 8pt;
      line-height: 1.5;
      color: rgba(255,255,255,0.75);
      text-align: left;
    }

    .sidebar-section {
      margin-bottom: 18px;
    }

    .sidebar-section h2 {
      font-family: 'Playfair Display', serif;
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1.5px solid rgba(255,255,255,0.3);
      letter-spacing: 1.5px;
      color: #ffffff;
    }

    .contact-item {
      margin-bottom: 7px;
      font-size: 8.5pt;
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
      color: rgba(255,255,255,0.85);
    }

    .contact-item svg {
      width: 12px;
      height: 12px;
      margin-right: 8px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .contact-item a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      word-break: break-all;
    }

    .language-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 8.5pt;
      color: rgba(255,255,255,0.85);
    }

    .language-item .lang-name {
      font-weight: 600;
      color: #ffffff;
    }

    .language-item .lang-level {
      color: rgba(255,255,255,0.6);
      font-size: 8pt;
    }

    .skills-list {
      list-style: none;
    }

    .skills-list li {
      margin-bottom: 5px;
      font-size: 8.5pt;
      padding-left: 14px;
      position: relative;
      color: rgba(255,255,255,0.85);
    }

    .skills-list li::before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      font-size: 6pt;
      top: 2px;
      color: #E8A0A0;
    }

    /* ── Main Content ── */
    .main-content {
      width: 65%;
      background: white;
      display: flex;
      flex-direction: column;
    }

    .main-body {
      padding: 30px 28px 22px;
      flex: 1;
      overflow: hidden;
    }

    .section {
      margin-bottom: 20px;
    }

    .section h2 {
      font-family: 'Playfair Display', serif;
      font-size: 13pt;
      font-weight: 700;
      color: #7B1A2C;
      margin-bottom: 12px;
      padding-bottom: 5px;
      border-bottom: 2px solid #7B1A2C;
      letter-spacing: 1px;
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
      font-weight: 700;
      color: #2c3e50;
    }

    .experience-item .company {
      font-size: 9pt;
      color: #7B1A2C;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .experience-item .date {
      font-size: 8pt;
      color: #7f8c8d;
      font-weight: 600;
      white-space: nowrap;
    }

    .experience-item ul {
      margin-left: 4px;
      margin-top: 4px;
      list-style: none;
    }

    .experience-item li {
      font-size: 8.5pt;
      color: #4a5a6c;
      margin-bottom: 3px;
      line-height: 1.5;
      padding-left: 14px;
      position: relative;
    }

    .experience-item li::before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      color: #7B1A2C;
      font-size: 5pt;
      top: 4px;
    }

    /* Education */
    .education-item {
      margin-bottom: 10px;
    }

    .education-item .edu-icon {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #C0392B;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: middle;
    }

    .education-item h3 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #2c3e50;
      display: inline;
    }

    .education-item .edu-school {
      font-size: 8.5pt;
      color: #4a5a6c;
      margin-top: 2px;
      padding-left: 14px;
    }

    .education-item .edu-date {
      font-size: 8pt;
      color: #7f8c8d;
      padding-left: 14px;
    }

    @media print {
      .resume-container { width: 100%; height: 100%; }
      .sidebar {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="profile-area">
        <div class="profile-picture-wrapper">
          <img src="${profileImage}" alt="Profile Picture" class="profile-picture" />
        </div>
        <div class="sidebar-name">${fullName}</div>
        <div class="sidebar-role">${targetRole}</div>
        <div class="sidebar-profile-text">
          Experienced ${resume.target_role?.toLowerCase() || 'professional'} with a proven track record of success in ${resume.work_experience?.[0]?.company || 'various organizations'}.
          Strong background in ${resume.skills?.[0]?.items?.[0] || 'professional development'} and ${resume.skills?.[0]?.items?.[1] || 'team collaboration'}.
        </div>
      </div>

      <!-- Contact -->
      <div class="sidebar-section">
        <h2>Contact</h2>
        ${resume.location ? `
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>${resume.location}</span>
        </div>
        ` : ''}
        ${resume.email ? `
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>${resume.email}</span>
        </div>
        ` : ''}
        ${resume.phone_number ? `
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <span>${resume.phone_number}</span>
        </div>
        ` : ''}
        ${resume.linkedin_url ? `
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          <a href="${resume.linkedin_url}" target="_blank">LinkedIn</a>
        </div>
        ` : ''}
        ${resume.github_url ? `
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          <a href="${resume.github_url}" target="_blank">GitHub</a>
        </div>
        ` : ''}
        ${resume.website ? `
        <div class="contact-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          <a href="${resume.website}" target="_blank">${resume.website.replace(/^https?:\/\//, '')}</a>
        </div>
        ` : ''}
      </div>

      <!-- Languages -->
      <div class="sidebar-section">
        <h2>Languages</h2>
        <div class="language-item">
          <span class="lang-name">English</span>
          <span class="lang-level">Fluent</span>
        </div>
        ${resume.current_language && resume.current_language !== 'en' ? `
        <div class="language-item">
          <span class="lang-name">${resume.current_language}</span>
          <span class="lang-level">Professional</span>
        </div>
        ` : ''}
      </div>

      <!-- Key Skills -->
      ${resume.skills && resume.skills.length > 0 ? `
      <div class="sidebar-section">
        <h2>Key Skills</h2>
        <ul class="skills-list">
          ${resume.skills.map(skill =>
            skill.items.map(item => `<li>${item}</li>`).join('')
          ).join('')}
        </ul>
      </div>
      ` : ''}
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="main-body">
        <!-- Work Experience -->
        ${resume.work_experience && resume.work_experience.length > 0 ? `
        <div class="section">
          <h2>Professional Experience</h2>
          ${resume.work_experience.map(exp => `
            <div class="experience-item">
              <div class="experience-header">
                <h3>${exp.position}</h3>
                <span class="date">${exp.date}</span>
              </div>
              <div class="company">${exp.company}${exp.location ? ', ' + exp.location : ''}</div>
              ${exp.description && exp.description.length > 0 ? `
                <ul>
                  ${((Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean)).map(desc => `<li>${desc}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Education -->
        ${resume.education && resume.education.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${resume.education.map(edu => `
            <div class="education-item">
              <span class="edu-icon"></span>
              <h3>${edu.degree}${edu.field ? ' in ' + edu.field : ''}</h3>
              <div class="edu-school">${edu.school}</div>
              <div class="edu-date">${edu.date}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Projects -->
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
                  ${((Array.isArray(project.description) ? project.description : [project.description]).filter(Boolean)).map(desc => `<li>${desc}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
