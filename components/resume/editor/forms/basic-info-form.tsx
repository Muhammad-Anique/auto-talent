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
  Camera,
  Loader2,
  X,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeContext } from "../resume-editor-context";
import { memo, useCallback, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

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
        <Icon className="h-4 w-4 text-[#5b6949]" />
      </div>
      <Input
        type={type}
        value={value || ""}
        onChange={handleChange}
        className="pr-10 text-sm bg-white border border-zinc-200 h-10
          focus:border-[#5b6949] focus:ring-1 focus:ring-[#5b6949]
          hover:border-[#5b6949] transition-colors
          placeholder:text-zinc-400"
        placeholder={placeholder}
      />
      <div className="absolute -top-2 left-2 px-1 bg-white text-[9px] font-semibold text-[#5b6949] uppercase">
        {label}
      </div>
    </div>
  );
});

const DEFAULT_PIC = 'https://gxvrkmueqemyudmnonji.supabase.co/storage/v1/object/public/autotalent_images/profile_pic.png';

// Compact profile picture editor for resume
const ResumeProfilePic = memo(function ResumeProfilePic({ userId }: { userId: string }) {
  const { state, dispatch } = useResumeContext();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentPic = state.resume.profile_pic;
  const hasCustomPic = currentPic && currentPic !== DEFAULT_PIC;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 5MB.", variant: "destructive" });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile_pic.${fileExt}`;

      // Delete existing files
      const { data: existingFiles } = await supabase.storage
        .from('autotalent_images')
        .list(userId);
      if (existingFiles && existingFiles.length > 0) {
        await supabase.storage
          .from('autotalent_images')
          .remove(existingFiles.map((f) => `${userId}/${f.name}`));
      }

      // Upload
      const { error } = await supabase.storage
        .from('autotalent_images')
        .upload(fileName, file, { cacheControl: '3600', upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('autotalent_images')
        .getPublicUrl(fileName);

      // Update resume context
      dispatch({ type: "UPDATE_FIELD", field: "profile_pic", value: publicUrl });

      // Also update the user's profile and users records
      await Promise.all([
        supabase.from('users').update({ profile_pic: publicUrl }).eq('id', userId),
        supabase.from('profiles').update({ profile_pic: publicUrl }).eq('user_id', userId),
      ]);

      toast({ title: "Photo updated", description: "Profile picture applied to resume." });
    } catch (err) {
      console.error('Upload error:', err);
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    dispatch({ type: "UPDATE_FIELD", field: "profile_pic", value: undefined });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative group shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-[#5b6949] transition-colors bg-zinc-50">
          {hasCustomPic ? (
            <Image src={currentPic} alt="Profile" fill className="object-cover" unoptimized style={{ position: 'absolute' }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-zinc-300" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-0.5 -right-0.5 p-1 bg-[#5b6949] text-white rounded-full shadow hover:bg-[#4a573a] transition-colors disabled:opacity-50"
        >
          <Camera className="w-2.5 h-2.5" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-semibold text-[#5b6949] uppercase mb-1">Profile Photo</p>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-7 text-[11px] px-2.5 border-zinc-200 hover:border-[#5b6949]/30"
          >
            {isUploading ? "Uploading..." : hasCustomPic ? "Change" : "Upload"}
          </Button>
          {hasCustomPic && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-7 text-[11px] px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
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

    // Also copy profile picture
    if (profile.profile_pic) {
      dispatch({ type: "UPDATE_FIELD", field: "profile_pic", value: profile.profile_pic });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="relative bg-white border border-zinc-200 hover:border-[#5b6949] transition-colors">
        <CardContent className="p-3 sm:p-4">
          {profile && (
            <div className="mb-3 sm:mb-4">
              <Button
                onClick={handleFillFromProfile}
                className="w-full bg-[#5b6949] text-white text-sm hover:bg-[#5b6949]/90 transition-colors h-10"
              >
                <UserCircle2 className="mr-2 h-4 w-4" />
                Fill from Profile
              </Button>
            </div>
          )}

          {/* Profile Picture */}
          <div className="mb-3 sm:mb-4 p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <ResumeProfilePic userId={profile?.user_id || resume.user_id} />
          </div>

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
