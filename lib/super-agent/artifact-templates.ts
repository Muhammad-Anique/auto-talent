// Artifact template helpers for the Super Agent
// These provide base HTML structures the agent can reference

export const RESUME_TEMPLATE_INSTRUCTIONS = `
When creating a resume artifact, use this structure as a guide:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.3; color: #1a1a2e; }
    .resume-container { width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; background: white; padding: 18mm 20mm; }

    /* Use sidebar layouts (35/65 split) or single-column */
    /* Professional color palettes: navy #2b3a4e, teal #2a9d8f, burgundy #7B1A2C, slate #3b4856 */
    /* Always make it print-ready with @media print */
    @media print { @page { size: A4; margin: 0; } body { margin: 0; } .resume-container { height: 297mm; max-height: 297mm; overflow: hidden; } }
  </style>
</head>
<body>
  <div class="resume-container">
    <!-- Build the resume with proper HTML structure -->
  </div>
</body>
</html>

Key design principles:
- ALWAYS A4 size: 210mm x 297mm (794px x 1123px) — NEVER exceed this
- Content MUST fit within a single A4 page with no overflow and no large empty gaps
- Use compact spacing: tight line-height (1.2-1.3), small margins, efficient use of space
- Use flexbox for layout, not tables
- Profile photo: 90-120px circular with border-radius: 50%, object-fit: cover, subtle shadow
- ALWAYS include the user's profile_pic URL as an <img> tag if available
- Use inline SVG icons (14-16px, Lucide-style) next to phone, email, LinkedIn, GitHub, location, website
- Sidebar: 30-35% width with dark/accent background, white text
- Main content: 65-70% with light background
- Section headings: uppercase, letter-spacing, bottom border or accent bar
- Experience items: company/date header row, position, bullet points
- Skills: pill badges or categorized lists
- Print styles: ensure colors render with print-color-adjust: exact
- Be CREATIVE — vary the layout, colors, and fonts each time
`;

export const COVER_LETTER_TEMPLATE_INSTRUCTIONS = `
When creating a cover letter artifact:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; font-size: 11pt; line-height: 1.7; color: #2c3e50; }
    .letter-container { width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; padding: 20mm 25mm; background: white; }
    .header { margin-bottom: 30px; border-bottom: 2px solid #2a9d8f; padding-bottom: 20px; }
    .sender-name { font-size: 22pt; font-weight: 700; color: #1a1a2e; }
    .sender-info { font-size: 9pt; color: #6b7280; margin-top: 5px; }
    .date { margin: 20px 0; color: #6b7280; }
    .recipient { margin-bottom: 25px; }
    .body p { margin-bottom: 15px; text-align: justify; }
    .closing { margin-top: 30px; }
    .signature { margin-top: 40px; font-weight: 600; }
    @media print { .letter-container { padding: 0.75in; } }
  </style>
</head>
<body>
  <div class="letter-container">
    <!-- Header with sender info -->
    <!-- Date -->
    <!-- Recipient -->
    <!-- Body paragraphs -->
    <!-- Closing and signature -->
  </div>
</body>
</html>
`;

export const EMAIL_TEMPLATE_INSTRUCTIONS = `
When creating an email artifact, generate a SIMPLE PLAIN-TEXT style email.
NO fancy HTML email templates. NO dark headers. NO card containers. NO colored backgrounds.
It should look exactly like a real email typed in Gmail or Outlook — just clean text on white.

Use this structure:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #111; background: white; padding: 32px 40px; max-width: 680px; }
    .subject { font-size: 13pt; font-weight: 600; margin-bottom: 18px; color: #111; }
    .meta { font-size: 9.5pt; color: #555; margin-bottom: 20px; border-bottom: 1px solid #e5e5e5; padding-bottom: 14px; }
    .meta div { margin-bottom: 3px; }
    .body { font-size: 11pt; line-height: 1.7; color: #222; }
    .body p { margin-bottom: 14px; }
  </style>
</head>
<body>
  <div class="subject">Subject: [Email Subject Line]</div>
  <div class="meta">
    <div>From: [Full Name] &lt;[email]&gt;</div>
  </div>
  <div class="body">
    <!-- Plain paragraphs: salutation, body, closing, signature -->
  </div>
</body>
</html>

Key rules:
- NO colored backgrounds, NO card containers, NO dark headers, NO box-shadows
- Plain white background, plain black text — exactly like composing in Gmail/Outlook
- Subject line at the very top, then a From: meta line, then the email body
- Body: salutation paragraph, 2-3 short content paragraphs, polite closing, full name signature
- Keep it concise — under 200 words
`;

export type ArtifactType = 'resume' | 'cover_letter' | 'email' | 'document';

export interface Artifact {
  id: string;
  type: ArtifactType;
  title: string;
  html: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}
