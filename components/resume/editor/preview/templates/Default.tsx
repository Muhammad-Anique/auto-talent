import { Document, Page } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';
import { HeaderSection, SkillsSection, ExperienceSection, ProjectsSection, EducationSection, createResumeStyles } from './ResumeLayout';

const minimalStyles = createResumeStyles({
  document_font_size: 11,
  document_line_height: 1.2,
  document_margin_vertical: 32,
  document_margin_horizontal: 32,
  header_name_size: 18,
  header_name_bottom_spacing: 12,
  skills_margin_top: 8,
  skills_margin_bottom: 8,
  skills_margin_horizontal: 0,
  skills_item_spacing: 2,
  experience_margin_top: 8,
  experience_margin_bottom: 8,
  experience_margin_horizontal: 0,
  experience_item_spacing: 4,
  projects_margin_top: 8,
  projects_margin_bottom: 8,
  projects_margin_horizontal: 0,
  projects_item_spacing: 4,
  education_margin_top: 8,
  education_margin_bottom: 8,
  education_margin_horizontal: 0,
  education_item_spacing: 4,
  footer_width: 95,
});

export const DefaultTemplate = ({ resume }: { resume: Resume }) => (
  <Document>
    <Page size="LETTER" style={minimalStyles.page}>
      <HeaderSection resume={resume} styles={minimalStyles} />
      <SkillsSection skills={resume.skills} styles={minimalStyles} />
      <ExperienceSection experiences={resume.work_experience} styles={minimalStyles} />
      <ProjectsSection projects={resume.projects} styles={minimalStyles} />
      <EducationSection education={resume.education} styles={minimalStyles} />
    </Page>
  </Document>
);
