"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import {
  Home,
  FileText,
  FileSignature,
  Mail,
  Search,
  Bookmark,
  LogOut,
  Brain,
  Briefcase,
  BrainCircuitIcon,
  CreditCard,
  Rocket,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { useSidebarContext } from "@/context/SidebarContext";
import { useLocale } from "@/components/providers/locale-provider";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { expanded, pinned, setPinned, setHovered } = useSidebarContext();
  const { dir, t } = useLocale();
  const isRTL = dir === 'rtl';

  const handleNavigation = (href: string) => {
    if (pathname === href) return;
    setIsLoading(true);
    router.push(href);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    router.push("/signin");
  };

  const links: { nameKey: string; href: string; icon: React.ReactElement; badgeKey?: string }[] = [
    {
      nameKey: "dashboard.sidebar.jobHub",
      href: "/dashboard",
      icon: <Home className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.aiAgent",
      href: "/dashboard/agent",
      icon: <Brain className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.resumeBuilder",
      href: "/dashboard/resumes",
      icon: <FileText className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.coverLetter",
      href: "/dashboard/coverletter",
      icon: <FileSignature className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.emailToHR",
      href: "/dashboard/follow-up-email",
      icon: <Mail className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.jobInterviews",
      href: "/dashboard/interview-questions",
      icon: <Briefcase className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.searchJobs",
      href: "/dashboard/search-jobs",
      icon: <Search className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.savedJobs",
      href: "/dashboard/saved-jobs",
      icon: <Bookmark className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.smartApply",
      href: "/dashboard/smart-apply",
      icon: <Rocket className="w-6 h-6 mr-3" />,
      badgeKey: "dashboard.sidebar.soon",
    },
    {
      nameKey: "dashboard.sidebar.usage",
      href: "/dashboard/usage",
      icon: <BarChart3 className="w-6 h-6 mr-3" />,
    },
    {
      nameKey: "dashboard.sidebar.billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="w-6 h-6 mr-3" />,
    },
  ];

  return (
    <aside
      className={`h-screen bg-white shadow-lg flex flex-col p-3 transition-all duration-200 ease-in-out ${
        expanded ? "w-72" : "w-20"
      } ${isRTL ? "border-l border-l-gray-200" : "border-r border-r-gray-200"}`}
      style={{ colorScheme: "light" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex  mb-5 mt-2">
        <span className="inline-flex ml-2.5 size-9 rounded-full bg-[#5b6949] bg-opacity-10 overflow-hidden items-center justify-center">
          <BrainCircuitIcon className="text-[#ffffff] size-6" />
        </span>
      </div>
      <nav className="flex-1 gap-1 flex flex-col overflow-y-auto min-h-0">
        <ul className="flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                onClick={() => handleNavigation(link.href)}
                className={`flex flex-row items-center py-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  pathname === link.href
                    ? "bg-gray-100 text-[#5b6949]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center justify-center w-10 pl-4">
                  {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, {
                    className: "w-6 h-6 flex-shrink-0",
                  })}
                </span>
                <span
                  className={`ml-2 font-semibold transition-all duration-200 ease-in-out whitespace-nowrap flex items-center gap-2 ${
                    expanded
                      ? "max-w-xs opacity-100"
                      : "max-w-0 opacity-0 overflow-hidden"
                  }`}
                  style={{
                    transitionProperty: "max-width, opacity",
                    minWidth: 0,
                  }}
                >
                  {t(link.nameKey)}
                  {link.badgeKey && expanded && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#5b6949]/10 text-[#5b6949] border border-[#5b6949]/20">
                      {t(link.badgeKey)}
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className={`mt-8 flex items-center justify-center px-2 py-3 bg-[#5b6949] text-white rounded-md hover:bg-[#5b6949]/90 transition-all duration-200 ${expanded ? "w-full" : "w-12 mx-auto"}`}
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span
          className={`ml-2 font-semibold transition-all duration-200 ${
            expanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {t("dashboard.sidebar.logout")}
        </span>
      </button>
    </aside>
  );
}
