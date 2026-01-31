import { Document, Page } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';
import { ResumeLayout } from './ResumeLayout';

export const DefaultTemplate = ({ resume }: { resume: Resume }) => (
  <Document>
    <Page size="LETTER">
      <ResumeLayout
        resume={resume}
        layout={resume.template_layout || 'classic'}
        theme={{ color: '#111827' }}
      />
    </Page>
  </Document>
);
