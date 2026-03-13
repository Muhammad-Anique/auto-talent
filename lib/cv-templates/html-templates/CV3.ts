import { Resume } from '@/lib/types';

/**
 * CV3: Orange Accent Single-Column Resume
 * Single-column layout on white background with orange/red accent color.
 * Header: small circular profile photo (left) with name (first name in orange, last name in dark) and contact info.
 * Sections: Summary, Skill Highlights (2-col grid), Experience, Education, Certifications, Additional Info.
 * Fonts: Raleway (headings), Open Sans (body).
 * Accent: Orange #e8570e, Text dark #2c3e50.
 */

export function generateCV3Template(resume: Resume): string {
  const firstName = resume.first_name?.toUpperCase() || '';
  const lastName = resume.last_name?.toUpperCase() || '';
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
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Open Sans', sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #2c3e50;
    }

    .resume-container {
      width: 8.5in;
      height: 11in;
      background: white;
      overflow: hidden;
      padding: 0 40px;
    }

    /* ── Header ── */
    .header {
      display: flex;
      align-items: center;
      padding: 30px 0 20px;
    }

    .profile-picture-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 20px;
      border: 3px solid #e8570e;
    }

    .profile-picture {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }

    .header-info {
      flex: 1;
    }

    .header-name {
      font-family: 'Raleway', sans-serif;
      font-size: 28pt;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: 2px;
    }

    .header-name .first-name {
      color: #e8570e;
    }

    .header-name .last-name {
      color: #2c3e50;
    }

    .header-contact {
      margin-top: 6px;
      font-size: 8.5pt;
      color: #555;
      line-height: 1.6;
    }

    .header-contact a {
      color: #555;
      text-decoration: none;
    }

    /* ── Orange Divider ── */
    .main-divider {
      border: none;
      height: 3px;
      background: #e8570e;
      margin-bottom: 18px;
    }

    /* ── Sections ── */
    .section {
      margin-bottom: 16px;
    }

    .section h2 {
      font-family: 'Raleway', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: #e8570e;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #e8570e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* ── Summary ── */
    .summary-text {
      font-size: 9pt;
      line-height: 1.6;
      color: #4a5a6c;
      text-align: justify;
    }

    /* ── Skill Highlights ── */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 30px;
      list-style: none;
    }

    .skills-grid li {
      font-size: 9pt;
      color: #2c3e50;
      padding-left: 14px;
      position: relative;
    }

    .skills-grid li::before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      color: #e8570e;
      font-size: 6pt;
      top: 3px;
    }

    /* ── Experience ── */
    .experience-item {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }

    .experience-item h3 {
      font-family: 'Raleway', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      color: #2c3e50;
    }

    .experience-item .date {
      font-size: 8.5pt;
      color: #777;
      font-weight: 600;
      white-space: nowrap;
    }

    .experience-item .company {
      font-size: 9pt;
      color: #e8570e;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .experience-item ul {
      margin-left: 4px;
      margin-top: 3px;
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
      color: #e8570e;
      font-size: 5pt;
      top: 4px;
    }

    /* ── Education ── */
    .education-item {
      margin-bottom: 8px;
    }

    .education-item h3 {
      font-family: 'Raleway', sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      color: #2c3e50;
    }

    .education-item .edu-school {
      font-size: 8.5pt;
      color: #4a5a6c;
    }

    .education-item .edu-date {
      font-size: 8pt;
      color: #777;
    }

    /* ── Certifications ── */
    .cert-list {
      list-style: none;
    }

    .cert-list li {
      font-size: 9pt;
      color: #2c3e50;
      margin-bottom: 3px;
      padding-left: 14px;
      position: relative;
    }

    .cert-list li::before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      color: #e8570e;
      font-size: 6pt;
      top: 3px;
    }

    /* ── Additional Info ── */
    .additional-text {
      font-size: 9pt;
      line-height: 1.6;
      color: #4a5a6c;
    }

    .additional-text strong {
      color: #2c3e50;
    }

    /* ── Projects ── */
    .projects-item {
      margin-bottom: 10px;
    }

    .projects-item h3 {
      font-family: 'Raleway', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 3px;
    }

    .projects-item ul {
      margin-left: 4px;
      margin-top: 3px;
      list-style: none;
    }

    .projects-item li {
      font-size: 8.5pt;
      color: #4a5a6c;
      margin-bottom: 3px;
      padding-left: 14px;
      position: relative;
    }

    .projects-item li::before {
      content: '\\25CF';
      position: absolute;
      left: 0;
      color: #e8570e;
      font-size: 5pt;
      top: 4px;
    }

    @media print {
      .resume-container { width: 100%; height: 100%; }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Header -->
    <div class="header">
      <div class="profile-picture-wrapper">
        <img src="${profileImage}" alt="Profile Picture" class="profile-picture" />
      </div>
      <div class="header-info">
        <div class="header-name">
          <span class="first-name">${firstName}</span>
          <span class="last-name">${lastName}</span>
        </div>
        <div class="header-contact">
          ${resume.phone_number ? `+1 ${resume.phone_number}<br/>` : ''}
          ${resume.email ? `${resume.email}<br/>` : ''}
          ${resume.website ? `<a href="${resume.website}" target="_blank">${resume.website.replace(/^https?:\/\//, '')}</a><br/>` : ''}
          ${resume.linkedin_url ? `<a href="${resume.linkedin_url}" target="_blank">LinkedIn</a>` : ''}
          ${resume.github_url ? ` | <a href="${resume.github_url}" target="_blank">GitHub</a>` : ''}
        </div>
      </div>
    </div>

    <hr class="main-divider" />

    <!-- Summary -->
    <div class="section">
      <h2>Summary</h2>
      <div class="summary-text">
        Experienced ${resume.target_role?.toLowerCase() || 'professional'} with a proven track record of success in ${resume.work_experience?.[0]?.company || 'various organizations'}.
        Strong background in ${resume.skills?.[0]?.items?.[0] || 'professional development'} and ${resume.skills?.[0]?.items?.[1] || 'team collaboration'}.
        Dedicated to delivering high-quality results and driving organizational success through innovation and strategic thinking.
      </div>
    </div>

    <!-- Skill Highlights -->
    ${resume.skills && resume.skills.length > 0 ? `
    <div class="section">
      <h2>Skill Highlights</h2>
      <ul class="skills-grid">
        ${resume.skills.map(skill =>
          skill.items.map(item => `<li>${item}</li>`).join('')
        ).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Experience -->
    ${resume.work_experience && resume.work_experience.length > 0 ? `
    <div class="section">
      <h2>Experience</h2>
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
          <h3>${edu.degree}${edu.field ? ' in ' + edu.field : ''}</h3>
          <div class="edu-school">${edu.school}${edu.gpa ? ' | GPA: ' + edu.gpa : ''}</div>
          <div class="edu-date">${edu.date}</div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Projects -->
    ${resume.projects && resume.projects.length > 0 ? `
    <div class="section">
      <h2>Projects</h2>
      ${resume.projects.map(project => `
        <div class="projects-item">
          <h3>${project.name}${project.date ? ' — ' + project.date : ''}</h3>
          ${project.description && project.description.length > 0 ? `
            <ul>
              ${((Array.isArray(project.description) ? project.description : [project.description]).filter(Boolean)).map(desc => `<li>${desc}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}

    <!-- Additional Info -->
    <div class="section">
      <h2>Additional Information</h2>
      <div class="additional-text">
        ${resume.skills && resume.skills.length > 0 ? `
          ${resume.skills.map(skill =>
            `<strong>${skill.category || 'Skills'}:</strong> ${skill.items.join(', ')}`
          ).join('<br/>')}
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
