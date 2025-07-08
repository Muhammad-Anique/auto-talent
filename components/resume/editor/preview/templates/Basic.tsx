import { Document, Page, Image, View, Text } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';
import { ResumeLayout } from './ResumeLayout';

// Sidebar Dark Template (matches image 1)
export const SidebarDarkTemplate = ({
  resume,
  variant = 'base',
  colors = {
    sidebar: '#223040',
    background: '#f8f9fa',
    text: '#fff',
    accent: '#4F8EF7', // Example accent color
  },
}: {
  resume: Resume;
  variant?: 'base';
  colors?: {
    sidebar?: string;
    background?: string;
    text?: string;
    accent?: string;
  };
}) => (
  <Document>
    <Page size="LETTER" style={{ flexDirection: 'row', backgroundColor: colors.background }}>
      {/* Sidebar */}
      <View style={{ width: '32%', backgroundColor: colors.sidebar, color: colors.text, padding: 24, minHeight: '100%' }}>
        {/* Name & Title */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 700, color: colors.accent }}>{resume.first_name} {resume.last_name}</Text>
        </View>
        {/* Contact Info */}
        <View style={{ fontSize: 9, marginBottom: 16 }}>
          {resume.email && <Text>{resume.email}</Text>}
          {resume.phone_number && <Text>{resume.phone_number}</Text>}
          {resume.location && <Text>{resume.location}</Text>}
        </View>
        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: colors.accent }}>SKILLS</Text>
            {resume.skills.map((cat, i) => (
              <Text key={i} style={{ fontSize: 9 }}>{cat.items.join(', ')}</Text>
            ))}
          </View>
        )}
      </View>
      {/* Main Content */}
      <View style={{ width: '68%', padding: 24 }}>
        <ResumeLayout resume={resume} variant={variant} layout="classic" />
      </View>
    </Page>
  </Document>
);

// Default Plain Template (simple, basic, plain text with headings)
export const DefaultTemplate = ({ resume }: { resume: Resume }) => (
  <Document>
    <Page size="LETTER" style={{ padding: 32, fontSize: 11, color: '#000', fontFamily: 'Helvetica' }}>
      {/* Name & Title */}
      <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{resume.first_name} {resume.last_name}</Text>
      {/* Contact Info */}
      <Text style={{ marginBottom: 12 }}>
        {resume.email && `${resume.email}  `}
        {resume.phone_number && `${resume.phone_number}  `}
        {resume.location && `${resume.location}`}
      </Text>
      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <>
          <Text style={{ fontWeight: 600, marginTop: 12, marginBottom: 4 }}>Skills</Text>
          {resume.skills.map((cat, i) => (
            <Text key={i}>{cat.items.join(', ')}</Text>
          ))}
        </>
      )}
      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <>
          <Text style={{ fontWeight: 600, marginTop: 12, marginBottom: 4 }}>Education</Text>
          {resume.education.map((edu, i) => (
            <Text key={i}>{edu.degree} {edu.field} - {edu.school} {edu.date && `(${edu.date})`}</Text>
          ))}
        </>
      )}
      {/* Work Experience */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <>
          <Text style={{ fontWeight: 600, marginTop: 12, marginBottom: 4 }}>Work Experience</Text>
          {resume.work_experience.map((exp, i) => (
            <Text key={i}>{exp.position} at {exp.company} {exp.date && `(${exp.date})`}</Text>
          ))}
        </>
      )}
      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <>
          <Text style={{ fontWeight: 600, marginTop: 12, marginBottom: 4 }}>Projects</Text>
          {resume.projects.map((proj, i) => (
            <Text key={i}>{proj.name}{proj.description && `: ${proj.description.join(' ')}`}</Text>
          ))}
        </>
      )}
    </Page>
  </Document>
);
