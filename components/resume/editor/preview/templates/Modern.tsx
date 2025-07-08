import { Document, Page, Image, View, Text } from '@react-pdf/renderer';

import { Resume } from '@/lib/types';
import { ResumeLayout } from './ResumeLayout';

// Sidebar Accent Template (matches image 2)
export const SidebarAccentTemplate = ({ resume, variant = 'base' }: { resume: Resume; variant?: 'base' }) => (
  <Document>
    <Page size="LETTER" style={{ flexDirection: 'row', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <View style={{ width: '32%', backgroundColor: '#2d3142', color: '#fff', padding: 24, minHeight: '100%' }}>
        {/* Name & Title */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: 700 }}>{resume.first_name} {resume.last_name}</Text>
        </View>
        {/* Contact Info */}
        <View style={{ fontSize: 9, marginBottom: 16 }}>
          {resume.email && <Text>{resume.email}</Text>}
          {resume.phone_number && <Text>{resume.phone_number}</Text>}
          {resume.location && <Text>{resume.location}</Text>}
        </View>
        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 10, fontWeight: 600, marginBottom: 4 }}>EDUCATION</Text>
            {resume.education.map((edu, i) => (
              <Text key={i} style={{ fontSize: 9 }}>{edu.degree} {edu.field} - {edu.school}</Text>
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
