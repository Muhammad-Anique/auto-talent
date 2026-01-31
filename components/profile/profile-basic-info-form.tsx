'use client';

import { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, User } from "lucide-react";
import { ProfilePictureUpload } from "./profile-picture-upload";

interface ProfileBasicInfoFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
}

export function ProfileBasicInfoForm({ profile, onChange }: ProfileBasicInfoFormProps) {
  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
        <CardContent className="p-6">
          <ProfilePictureUpload
            currentImageUrl={profile.profile_pic || undefined}
            userId={profile.user_id}
            onUploadComplete={(url) => onChange('profile_pic', url)}
          />
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Name Row */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-[#5b6949]" />
                  </div>
                </div>
                <Input
                  value={profile.first_name || ''}
                  onChange={(e) => onChange('first_name', e.target.value)}
                  className="pr-12 text-lg font-semibold bg-white/50 border-zinc-200 rounded-lg
                    focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                    hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                    placeholder:text-zinc-400"
                  placeholder="First Name"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                  FIRST NAME
                </div>
              </div>
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                    <User className="h-4 w-4 text-[#5b6949]" />
                  </div>
                </div>
                <Input
                  value={profile.last_name || ''}
                  onChange={(e) => onChange('last_name', e.target.value)}
                  className="pr-12 text-lg font-semibold bg-white/50 border-zinc-200 rounded-lg
                    focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                    hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                    placeholder:text-zinc-400"
                  placeholder="Last Name"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                  LAST NAME
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                    <Mail className="h-4 w-4 text-[#5b6949]" />
                  </div>
                </div>
                <Input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="pr-12 bg-white/50 border-zinc-200 rounded-lg
                    focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                    hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                    placeholder:text-zinc-400"
                  placeholder="email@example.com"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                  EMAIL
                </div>
              </div>
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                    <Phone className="h-4 w-4 text-[#5b6949]" />
                  </div>
                </div>
                <Input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => onChange('phone_number', e.target.value)}
                  className="pr-12 bg-white/50 border-zinc-200 rounded-lg
                    focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                    hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                    placeholder:text-zinc-400"
                  placeholder="+1 (555) 000-0000"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                  PHONE
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                  <MapPin className="h-4 w-4 text-[#5b6949]" />
                </div>
              </div>
              <Input
                value={profile.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="pr-12 bg-white/50 border-zinc-200 rounded-lg
                  focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                  hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                  placeholder:text-zinc-400"
                placeholder="City, State, Country"
              />
              <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                LOCATION
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Website and LinkedIn */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                    <Globe className="h-4 w-4 text-[#5b6949]" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.website || ''}
                  onChange={(e) => onChange('website', e.target.value)}
                  className="pr-12 bg-white/50 border-zinc-200 rounded-lg
                    focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                    hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                    placeholder:text-zinc-400"
                  placeholder="https://your-website.com"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                  WEBSITE
                </div>
              </div>
              <div className="relative group flex-1">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                    <Linkedin className="h-4 w-4 text-[#5b6949]" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => onChange('linkedin_url', e.target.value)}
                  className="pr-12 bg-white/50 border-zinc-200 rounded-lg
                    focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                    hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                    placeholder:text-zinc-400"
                  placeholder="https://linkedin.com/in/username"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                  LINKEDIN
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="p-1.5 rounded-full bg-[#5b6949]/10 transition-transform duration-200 group-focus-within:scale-110">
                  <Github className="h-4 w-4 text-[#5b6949]" />
                </div>
              </div>
              <Input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => onChange('github_url', e.target.value)}
                className="pr-12 bg-white/50 border-zinc-200 rounded-lg
                  focus:border-[#5b6949] focus:ring-2 focus:ring-[#5b6949]/20
                  hover:border-[#5b6949]/30 hover:bg-white/60 transition-colors
                  placeholder:text-zinc-400"
                placeholder="https://github.com/username"
              />
              <div className="absolute -top-2.5 left-2 px-1 bg-white/80 text-[10px] font-medium text-[#5b6949]">
                GITHUB
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 