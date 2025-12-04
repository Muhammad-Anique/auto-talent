"use client";

import { Profile, Resume } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  User,
  UserCircle2,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeContext } from "../resume-editor-context";
import { memo, useCallback } from "react";

interface BasicInfoFormProps {
  profile: Profile;
}

function areBasicInfoPropsEqual(
  prevProps: BasicInfoFormProps,
  nextProps: BasicInfoFormProps
) {
  return prevProps.profile.id === nextProps.profile.id;
}

// Create memoized field component
const BasicInfoField = memo(function BasicInfoField({
  field,
  value,
  label,
  icon: Icon,
  placeholder,
  type = "text",
}: {
  field: keyof Resume;
  value: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
}) {
  const { dispatch } = useResumeContext();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "UPDATE_FIELD", field, value: e.target.value });
    },
    [dispatch, field]
  );

  return (
    <div className="relative group">
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
        <div className="p-1 rounded-full bg-[#5b6949]/10 transition-transform duration-300 group-focus-within:scale-110">
          <Icon className="h-4 w-4 text-[#5b6949]" />
        </div>
      </div>
      <Input
        type={type}
        value={value || ""}
        onChange={handleChange}
        className="pr-10 text-sm bg-white border-zinc-200 rounded-lg h-9
          focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
          hover:border-[#5b6949]/60 hover:bg-zinc-50/80 transition-colors
          placeholder:text-zinc-400"
        placeholder={placeholder}
      />
      <div className="absolute -top-2 left-2 px-1 text-[9px] font-medium text-[#5b6949]">
        {label}
      </div>
    </div>
  );
});

export const BasicInfoForm = memo(function BasicInfoFormComponent({
  profile,
}: BasicInfoFormProps) {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;

  const updateField = (field: keyof typeof resume, value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const handleFillFromProfile = () => {
    if (!profile) return;

    // List of fields to copy from profile (fields that exist in both Profile and Resume)
    const fieldsToFill: (keyof Profile)[] = [
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "location",
      "website",
      "linkedin_url",
      "github_url",
    ];

    // Copy each field if it exists in the profile
    fieldsToFill.forEach((field) => {
      if (profile[field]) {
        // Type assertion: these fields exist in both Profile and Resume
        updateField(field as keyof Resume, profile[field] as string);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="relative group bg-gradient-to-r from-[#5b6949]/5 via-[#5b6949]/10 to-zinc-100/5 backdrop-blur-md border border-[#5b6949]/20 hover:border-[#5b6949]/40 hover:shadow-lg transition-all duration-300 shadow-sm">
        <CardContent className="p-3 sm:p-4">
          {profile && (
            <div className="mb-3 sm:mb-4">
              <Button
                onClick={handleFillFromProfile}
                className="w-full bg-gradient-to-r from-[#5b6949] to-[#5b6949]/80 text-white text-sm hover:from-[#5b6949]/90 hover:to-[#5b6949]/70 transition-all duration-500 shadow-md hover:shadow-lg hover:shadow-[#5b6949]/20 hover:-translate-y-0.5"
              >
                <UserCircle2 className="mr-2 h-4 w-4" />
                Fill from Profile
              </Button>
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <BasicInfoField
                field="first_name"
                value={resume.first_name}
                label="FIRST NAME"
                icon={User}
                placeholder="First Name"
              />
              <BasicInfoField
                field="last_name"
                value={resume.last_name}
                label="LAST NAME"
                icon={User}
                placeholder="Last Name"
              />
            </div>

            <BasicInfoField
              field="email"
              value={resume.email}
              label="EMAIL"
              icon={Mail}
              placeholder="email@example.com"
              type="email"
            />

            <BasicInfoField
              field="phone_number"
              value={resume.phone_number || ""}
              label="PHONE"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              type="tel"
            />

            <BasicInfoField
              field="location"
              value={resume.location || ""}
              label="LOCATION"
              icon={MapPin}
              placeholder="City, State, Country"
            />

            <div className="space-y-2 sm:space-y-3">
              <BasicInfoField
                field="website"
                value={resume.website || ""}
                label="WEBSITE"
                icon={Globe}
                placeholder="https://your-website.com"
                type="url"
              />

              <BasicInfoField
                field="linkedin_url"
                value={resume.linkedin_url || ""}
                label="LINKEDIN"
                icon={Linkedin}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />

              <BasicInfoField
                field="github_url"
                value={resume.github_url || ""}
                label="GITHUB"
                icon={Github}
                placeholder="https://github.com/username"
                type="url"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
},
areBasicInfoPropsEqual);
