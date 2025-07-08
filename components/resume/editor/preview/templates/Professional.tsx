import { Document, Page, View, Image, Text } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';
import { ResumeLayout } from './ResumeLayout';

// Patterned Header Template (matches image 3)
export const PatternedHeaderTemplate = ({ resume, variant = 'base' }: { resume: Resume; variant?: 'base' }) => (
  <Document>
    <Page size="LETTER" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header with pattern */}
      <View style={{ width: '100%', height: 90, backgroundColor: '#1a232a', marginBottom: 24, justifyContent: 'center', padding: 24 }}>
        {/* Optionally add a pattern image here if available */}
        {/* <Image src="/path/to/pattern.png" style={{ position: 'absolute', width: '100%', height: 90, left: 0, top: 0, opacity: 0.2 }} /> */}
        <View style={{ zIndex: 1 }}>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: 700 }}>{resume.first_name} {resume.last_name}</Text>
          <Text style={{ fontSize: 9, color: '#b0b8c1' }}>{resume.email} {resume.phone_number ? ' | ' + resume.phone_number : ''} {resume.location ? ' | ' + resume.location : ''}</Text>
        </View>
      </View>
      {/* Main Content */}
      <View style={{ padding: 24 }}>
        <ResumeLayout resume={resume} variant={variant} layout="classic" />
      </View>
    </Page>
  </Document>
);
