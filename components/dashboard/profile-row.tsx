'use client';

import { Profile } from "@/lib/types";
import { Briefcase, GraduationCap, Code, Pencil, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { locales, localeNames, localeFlags } from "@/i18n/config";

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  const { locale, setLocale, t } = useLocale();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const stats = [
    {
      icon: Briefcase,
      label: t("dashboard.profile.experience"),
      count: profile.work_experience.length,
    },
    {
      icon: GraduationCap,
      label: t("dashboard.profile.education"),
      count: profile.education.length,
    },
    {
      icon: Code,
      label: t("dashboard.profile.projects"),
      count: profile.projects.length,
    },
  ];

  return (
    <div className="relative bg-white border-b border-zinc-200">
      <div className="relative px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mx-auto">
          {/* Stats */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                  "bg-zinc-50 border border-zinc-200",
                  "transition-all duration-200 hover:border-[#5b6949]/30",
                  "shrink-0"
                )}
              >
                <div className="p-1 rounded-md bg-[#5b6949]/10">
                  <stat.icon className="h-3 w-3 text-[#5b6949]" />
                </div>
                <span className="text-sm whitespace-nowrap">
                  <span className="font-bold text-zinc-900">{stat.count}</span>
                  <span className="text-zinc-500 ml-1.5">{stat.label}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={cn(
                  "bg-white border-zinc-200 text-zinc-700",
                  "hover:bg-zinc-50 hover:border-zinc-300",
                  "transition-all duration-200",
                  "rounded-lg font-medium text-sm",
                )}
              >
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-base mr-1">{localeFlags[locale]}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", isLangOpen && "rotate-180")} />
              </Button>
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-zinc-200 py-1.5 w-40 z-50">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2.5",
                        locale === loc ? "bg-[#5b6949]/10 text-[#5b6949] font-medium" : "text-zinc-700"
                      )}
                    >
                      <span className="text-base">{localeFlags[loc]}</span>
                      <span>{localeNames[loc]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Edit Profile Button */}
            <Link href="/dashboard/profile">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "bg-white border-zinc-200 text-zinc-700",
                  "hover:bg-[#5b6949] hover:text-white hover:border-[#5b6949]",
                  "transition-all duration-200",
                  "rounded-lg font-medium text-sm",
                )}
              >
                <Pencil className="h-3.5 w-3.5 mr-2" />
                {t("dashboard.profile.editProfile")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
