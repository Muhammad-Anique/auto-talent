import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '@/lib/types';
import { ResumeLayout } from './ResumeLayout';

const watermarkStyles = StyleSheet.create({
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  watermarkText: {
    fontSize: 60,
    color: 'rgba(0, 0, 0, 0.08)',
    transform: 'rotate(-45deg)',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
});

interface DefaultTemplateProps {
  resume: Resume;
  withWatermark?: boolean;
}

export const DefaultTemplate = ({ resume, withWatermark = false }: DefaultTemplateProps) => (
  <Document>
    <Page size="LETTER">
      <ResumeLayout
        resume={resume}
        layout={resume.template_layout || 'classic'}
        theme={{ color: '#111827' }}
      />
      {withWatermark && (
        <View style={watermarkStyles.watermarkContainer} fixed>
          <Text style={watermarkStyles.watermarkText}>AutoTalent</Text>
        </View>
      )}
    </Page>
  </Document>
);
