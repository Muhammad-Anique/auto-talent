import { memo } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Resume } from "@/lib/types";

// Template with colored sidebar
interface ColoredSidebarTemplateProps {
  resume: Resume;
  primaryColor: string;
  layout: 'modern' | 'professional' | 'minimal' | 'left-aligned' | 'sidebar' | 'compact' | 'executive' | 'corporate';
}

export const ColoredSidebarTemplate = memo(function ColoredSidebarTemplate({
  resume,
  primaryColor,
  layout
}: ColoredSidebarTemplateProps) {
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
    },
    sidebar: {
      width: '35%',
      backgroundColor: primaryColor,
      padding: 30,
      color: '#ffffff',
    },
    mainContent: {
      width: '65%',
      padding: 30,
      backgroundColor: '#ffffff',
    },
    profilePhoto: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginBottom: 20,
      alignSelf: 'center',
    },
    name: {
      fontSize: 24,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
      marginBottom: 8,
      textAlign: 'center',
    },
    title: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 20,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sidebarSection: {
      marginBottom: 20,
    },
    sidebarHeading: {
      fontSize: 12,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
      marginBottom: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottom: '2px solid rgba(255,255,255,0.3)',
      paddingBottom: 5,
    },
    sidebarText: {
      fontSize: 9,
      color: 'rgba(255,255,255,0.95)',
      marginBottom: 4,
      lineHeight: 1.4,
    },
    contactItem: {
      fontSize: 9,
      color: 'rgba(255,255,255,0.95)',
      marginBottom: 8,
      lineHeight: 1.3,
    },
    mainHeading: {
      fontSize: 16,
      fontFamily: 'Helvetica-Bold',
      color: primaryColor,
      marginBottom: 15,
      marginTop: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottom: `2px solid ${primaryColor}`,
      paddingBottom: 5,
    },
    experienceItem: {
      marginBottom: 15,
    },
    jobTitle: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
      marginBottom: 3,
    },
    company: {
      fontSize: 10,
      color: primaryColor,
      marginBottom: 2,
    },
    date: {
      fontSize: 9,
      color: '#666666',
      marginBottom: 5,
    },
    bulletPoint: {
      fontSize: 9,
      color: '#333333',
      marginLeft: 15,
      marginBottom: 3,
      lineHeight: 1.4,
    },
    skillCategory: {
      marginBottom: 12,
    },
    skillTitle: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
      marginBottom: 5,
    },
    skillItems: {
      fontSize: 9,
      color: 'rgba(255,255,255,0.9)',
      lineHeight: 1.5,
    },
  });

  return (
    <View style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Profile Photo Placeholder */}
        <View style={styles.profilePhoto} />

        {/* Name and Title */}
        <Text style={styles.name}>{resume.first_name} {resume.last_name}</Text>
        <Text style={styles.title}>{resume.target_role}</Text>

        {/* Contact Information */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarHeading}>Contact</Text>
          {resume.phone_number && <Text style={styles.contactItem}>{resume.phone_number}</Text>}
          {resume.email && <Text style={styles.contactItem}>{resume.email}</Text>}
          {resume.location && <Text style={styles.contactItem}>{resume.location}</Text>}
          {resume.linkedin_url && <Text style={styles.contactItem}>{resume.linkedin_url}</Text>}
          {resume.website && <Text style={styles.contactItem}>{resume.website}</Text>}
        </View>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Skills</Text>
            {resume.skills.map((skill, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillTitle}>{skill.category}</Text>
                <Text style={styles.skillItems}>{skill.items.join(' • ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.sidebarText}>{edu.degree} {edu.field}</Text>
                <Text style={[styles.sidebarText, { fontSize: 8, color: 'rgba(255,255,255,0.8)' }]}>
                  {edu.school}
                </Text>
                <Text style={[styles.sidebarText, { fontSize: 8, color: 'rgba(255,255,255,0.7)' }]}>
                  {edu.date}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Experience */}
        {resume.work_experience && resume.work_experience.length > 0 && (
          <View>
            <Text style={styles.mainHeading}>Professional Experience</Text>
            {resume.work_experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.date}>{exp.date}</Text>
                {exp.description && exp.description.map((bullet, bulletIndex) => (
                  <Text key={bulletIndex} style={styles.bulletPoint}>• {bullet}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View>
            <Text style={styles.mainHeading}>Projects</Text>
            {resume.projects.map((project, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{project.name}</Text>
                {project.technologies && (
                  <Text style={styles.company}>{project.technologies.join(' • ')}</Text>
                )}
                {project.date && <Text style={styles.date}>{project.date}</Text>}
                {project.description && project.description.map((bullet, bulletIndex) => (
                  <Text key={bulletIndex} style={styles.bulletPoint}>• {bullet}</Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
});

// Classic white template (no sidebar, no colors)
export const ClassicTemplate = memo(function ClassicTemplate({ resume }: { resume: Resume }) {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
    },
    name: {
      fontSize: 28,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
      marginBottom: 5,
    },
    title: {
      fontSize: 13,
      color: '#666666',
      marginBottom: 10,
    },
    contact: {
      fontSize: 10,
      color: '#666666',
      textAlign: 'center',
    },
    sectionHeading: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
      marginTop: 20,
      marginBottom: 10,
      textTransform: 'uppercase',
      borderBottom: '1.5pt solid #cccccc',
      paddingBottom: 3,
    },
    experienceItem: {
      marginBottom: 12,
    },
    jobTitle: {
      fontSize: 11,
      fontFamily: 'Helvetica-Bold',
      color: '#1a1a1a',
    },
    company: {
      fontSize: 10,
      color: '#333333',
    },
    date: {
      fontSize: 9,
      color: '#666666',
    },
    bulletPoint: {
      fontSize: 9,
      color: '#333333',
      marginLeft: 15,
      marginBottom: 2,
      lineHeight: 1.4,
    },
    skillSection: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
    skillCategory: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      color: '#333333',
      marginRight: 5,
    },
    skillItems: {
      fontSize: 9,
      color: '#666666',
    },
  });

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.first_name} {resume.last_name}</Text>
        <Text style={styles.title}>{resume.target_role}</Text>
        <Text style={styles.contact}>
          {[resume.email, resume.phone_number, resume.location].filter(Boolean).join(' • ')}
        </Text>
      </View>

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <View>
          <Text style={styles.sectionHeading}>Skills</Text>
          {resume.skills.map((skill, index) => (
            <View key={index} style={styles.skillSection}>
              <Text style={styles.skillCategory}>{skill.category}:</Text>
              <Text style={styles.skillItems}>{skill.items.join(', ')}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Experience */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <View>
          <Text style={styles.sectionHeading}>Experience</Text>
          {resume.work_experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{exp.position}</Text>
              <Text style={styles.company}>{exp.company} • {exp.date}</Text>
              {exp.description && exp.description.map((bullet, bulletIndex) => (
                <Text key={bulletIndex} style={styles.bulletPoint}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <View>
          <Text style={styles.sectionHeading}>Projects</Text>
          {resume.projects.map((project, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{project.name}</Text>
              {project.date && <Text style={styles.date}>{project.date}</Text>}
              {project.description && project.description.map((bullet, bulletIndex) => (
                <Text key={bulletIndex} style={styles.bulletPoint}>• {bullet}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <View>
          <Text style={styles.sectionHeading}>Education</Text>
          {resume.education.map((edu, index) => (
            <View key={index} style={styles.experienceItem}>
              <Text style={styles.jobTitle}>{edu.degree} {edu.field}</Text>
              <Text style={styles.company}>{edu.school} • {edu.date}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
});
