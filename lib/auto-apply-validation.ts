// Auto-Apply Input Validation and Sanitization

import { z } from "zod";
import { AutoApplyErrorHandler, AutoApplyErrorCode } from "./auto-apply-errors";

// Base validation schemas
const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(1, "Email is required");
const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format");
const urlSchema = z
  .string()
  .url("Invalid URL format")
  .optional()
  .or(z.literal(""));
const requiredStringSchema = z.string().min(1, "This field is required");
const optionalStringSchema = z.string().optional();

// Personal Information Validation
export const personalInfoSchema = z.object({
  firstName: requiredStringSchema.min(
    2,
    "First name must be at least 2 characters"
  ),
  lastName: requiredStringSchema.min(
    2,
    "Last name must be at least 2 characters"
  ),
  phone: phoneSchema,
  email: emailSchema,
  address: requiredStringSchema.min(5, "Address must be at least 5 characters"),
  city: requiredStringSchema.min(2, "City must be at least 2 characters"),
  state: requiredStringSchema.min(2, "State must be at least 2 characters"),
  country: requiredStringSchema.min(2, "Country must be at least 2 characters"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  currentJobTitle: optionalStringSchema,
  currentCompany: optionalStringSchema,
  currentSalary: optionalStringSchema,
  desiredSalary: requiredStringSchema,
  noticePeriod: optionalStringSchema,
  workAuth: requiredStringSchema,
  educationLevel: requiredStringSchema,
  fieldOfStudy: optionalStringSchema,
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, "Graduation year must be 4 digits")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .min(1, "LinkedIn URL is required"),
  website: urlSchema,
  githubUrl: urlSchema,
});

// Skills Validation
export const skillGroupSchema = z.object({
  category: z.string().min(1, "Skill category is required"),
  items: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),
});

// Work Experience Validation
export const workExperienceSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  date: z.string().min(1, "Date range is required"),
  location: z.string().min(1, "Location is required"),
  description: z
    .array(z.string().min(1, "Description cannot be empty"))
    .min(1, "At least one description is required"),
  technologies: z.array(z.string().min(1, "Technology cannot be empty")),
});

// Education Validation
export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  school: z.string().min(1, "School is required"),
  date: z.string().min(1, "Date range is required"),
  gpa: z.number().min(0).max(4).optional(),
  location: z.string().min(1, "Location is required"),
  achievements: z.array(z.string().min(1, "Achievement cannot be empty")),
});

// Application Questions Validation
export const applicationQuestionsSchema = z.object({
  legallyAuthorized: z.enum(["Yes", "No"], {
    required_error: "Please select an option",
  }),
  requireSponsorship: z.enum(["Yes", "No"], {
    required_error: "Please select an option",
  }),
  currentLocation: optionalStringSchema,
  yearsExperience: optionalStringSchema,
  expectedSalary: optionalStringSchema,
  startDate: optionalStringSchema,
  interestReason: optionalStringSchema,
  keySkills: optionalStringSchema,
  disabilities: optionalStringSchema,
  gender: optionalStringSchema,
  race: optionalStringSchema,
  veteran: optionalStringSchema,
});

// Search Preferences Validation
export const searchPreferencesSchema = z.object({
  searchTerms: requiredStringSchema.min(
    3,
    "Search terms must be at least 3 characters"
  ),
  searchLocation: requiredStringSchema.min(
    2,
    "Search location must be at least 2 characters"
  ),
  experienceLevel: optionalStringSchema,
  salaryRange: optionalStringSchema,
  targetExperience: optionalStringSchema,
  preferredJobTypes: z
    .array(z.string())
    .min(1, "At least one job type must be selected"),
  industries: optionalStringSchema,
  blacklistedCompanies: optionalStringSchema,
  whitelistedCompanies: optionalStringSchema,
  skipKeywords: optionalStringSchema,
  prioritizeKeywords: optionalStringSchema,
  skipSecurityClearance: z.boolean(),
  followCompanies: z.boolean(),
  randomizeSearch: z.boolean(),
});

// Complete Form Validation
export const autoApplyFormSchema = z.object({
  // Personal Information
  ...personalInfoSchema.shape,

  // Skills and Experience
  skills: z
    .array(skillGroupSchema)
    .min(1, "At least one skill category is required"),
  workExperience: z
    .array(workExperienceSchema)
    .min(1, "At least one work experience is required"),
  education: z
    .array(educationSchema)
    .min(1, "At least one education entry is required"),
  projects: optionalStringSchema,
  certifications: optionalStringSchema,

  // Resume Selection
  selectedResumeId: optionalStringSchema,
  uploadedResume: z.any().optional(),

  // Application Questions
  ...applicationQuestionsSchema.shape,

  // Search Preferences
  ...searchPreferencesSchema.shape,

  // Additional Settings
  resumeReady: z.boolean(),
  useWebUI: z.boolean(),
});

export type AutoApplyFormData = z.infer<typeof autoApplyFormSchema>;

// Input Sanitization Functions
export class InputSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
      .substring(0, 1000); // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\(\)\s]/g, "").trim();
  }

  static sanitizeUrl(url: string): string {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      return "";
    }
  }

  static sanitizeTextArea(text: string): string {
    return text
      .trim()
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters except \t, \n, \r
      .substring(0, 5000); // Limit length
  }

  static sanitizeArray(items: string[]): string[] {
    return items
      .map((item) => this.sanitizeString(item))
      .filter((item) => item.length > 0);
  }
}

// Validation Helper Functions
export class ValidationHelper {
  static validateFormData(data: any): {
    success: boolean;
    errors: Record<string, string>;
    sanitizedData?: AutoApplyFormData;
  } {
    try {
      // First sanitize the data
      const sanitizedData = this.sanitizeFormData(data);

      // Then validate
      const result = autoApplyFormSchema.safeParse(sanitizedData);

      if (result.success) {
        return {
          success: true,
          errors: {},
          sanitizedData: result.data,
        };
      } else {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          const field = error.path.join(".");
          errors[field] = error.message;
        });

        return {
          success: false,
          errors,
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: { general: "Validation failed" },
      };
    }
  }

  static sanitizeFormData(data: any): any {
    return {
      ...data,
      firstName: InputSanitizer.sanitizeString(data.firstName || ""),
      lastName: InputSanitizer.sanitizeString(data.lastName || ""),
      phone: InputSanitizer.sanitizePhone(data.phone || ""),
      email: InputSanitizer.sanitizeEmail(data.email || ""),
      address: InputSanitizer.sanitizeString(data.address || ""),
      city: InputSanitizer.sanitizeString(data.city || ""),
      state: InputSanitizer.sanitizeString(data.state || ""),
      country: InputSanitizer.sanitizeString(data.country || ""),
      zipCode: InputSanitizer.sanitizeString(data.zipCode || ""),
      linkedinUrl: InputSanitizer.sanitizeUrl(data.linkedinUrl || ""),
      website: InputSanitizer.sanitizeUrl(data.website || ""),
      githubUrl: InputSanitizer.sanitizeUrl(data.githubUrl || ""),
      searchTerms: InputSanitizer.sanitizeString(data.searchTerms || ""),
      searchLocation: InputSanitizer.sanitizeString(data.searchLocation || ""),
      currentLocation: InputSanitizer.sanitizeString(
        data.currentLocation || ""
      ),
      projects: InputSanitizer.sanitizeTextArea(data.projects || ""),
      certifications: InputSanitizer.sanitizeTextArea(
        data.certifications || ""
      ),
      skills: (data.skills || []).map((skill: any) => ({
        category: InputSanitizer.sanitizeString(skill.category || ""),
        items: InputSanitizer.sanitizeArray(skill.items || []),
      })),
      workExperience: (data.workExperience || []).map((exp: any) => ({
        ...exp,
        position: InputSanitizer.sanitizeString(exp.position || ""),
        company: InputSanitizer.sanitizeString(exp.company || ""),
        location: InputSanitizer.sanitizeString(exp.location || ""),
        description: InputSanitizer.sanitizeArray(exp.description || []),
        technologies: InputSanitizer.sanitizeArray(exp.technologies || []),
      })),
      education: (data.education || []).map((edu: any) => ({
        ...edu,
        degree: InputSanitizer.sanitizeString(edu.degree || ""),
        field: InputSanitizer.sanitizeString(edu.field || ""),
        school: InputSanitizer.sanitizeString(edu.school || ""),
        location: InputSanitizer.sanitizeString(edu.location || ""),
        achievements: InputSanitizer.sanitizeArray(edu.achievements || []),
      })),
      preferredJobTypes: InputSanitizer.sanitizeArray(
        data.preferredJobTypes || []
      ),
    };
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateRequiredFields(
    data: any,
    requiredFields: string[]
  ): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    requiredFields.forEach((field) => {
      const value = data[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        missingFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }
}

// File Validation
export class FileValidator {
  static validateResumeFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "File must be a PDF, DOC, or DOCX file",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size must be less than 10MB",
      };
    }

    return { isValid: true };
  }
}
