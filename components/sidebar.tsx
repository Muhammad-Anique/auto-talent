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
  Pin,
  PinOff,
  BrainCircuitIcon,
  CreditCard,
  Settings,
} from "lucide-react";
import { useState } from "react";
import React from "react";
import { useSidebarContext } from "@/context/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLoading } = useLoading();
  const { expanded, pinned, setPinned, setHovered } = useSidebarContext();

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

  const links = [
    {
      name: "Job Hub",
      href: "/dashboard",
      icon: <Home className="w-6 h-6 mr-3" />,
    },
    {
      name: "Resume Builder",
      href: "/dashboard/resumes",
      icon: <FileText className="w-6 h-6 mr-3" />,
    },
    {
      name: "Cover Letter",
      href: "/dashboard/coverletter",
      icon: <FileSignature className="w-6 h-6 mr-3" />,
    },
    {
      name: "Email To HR",
      href: "/dashboard/follow-up-email",
      icon: <Mail className="w-6 h-6 mr-3" />,
    },
    {
      name: "Job Interviews",
      href: "/dashboard/interview-questions",
      icon: <Briefcase className="w-6 h-6 mr-3" />,
    },
    {
      name: "Search Jobs",
      href: "/dashboard/search-jobs",
      icon: <Search className="w-6 h-6 mr-3" />,
    },
    {
      name: "Saved Jobs",
      href: "/dashboard/saved-jobs",
      icon: <Bookmark className="w-6 h-6 mr-3" />,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="w-6 h-6 mr-3" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="w-6 h-6 mr-3" />,
    },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-r-gray-200 shadow-lg flex flex-col p-3 transition-all duration-200 ease-in-out ${
        expanded ? "w-72" : "w-20"
      }`}
      style={{ colorScheme: "light" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex  mb-5 mt-2">
        <span className="inline-flex ml-2.5 size-9 rounded-full bg-[#5b6949] bg-opacity-10 overflow-hidden items-center justify-center">
          <BrainCircuitIcon className="text-[#ffffff] size-6" />
        </span>
      </div>
      <nav className="flex-1 gap-1 flex flex-col">
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
                  {React.cloneElement(link.icon, {
                    className: "w-6 h-6 flex-shrink-0",
                  })}
                </span>
                <span
                  className={`ml-2 font-semibold transition-all duration-200 ease-in-out whitespace-nowrap ${
                    expanded
                      ? "max-w-xs opacity-100"
                      : "max-w-0 opacity-0 overflow-hidden"
                  }`}
                  style={{
                    transitionProperty: "max-width, opacity",
                    minWidth: 0,
                  }}
                >
                  {link.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className={`mt-8 flex items-center justify-center px-2 py-3 bg-[#5b6949] text-white rounded-md hover:bg-[#5b6949]/90 text-gray-800 transition-all duration-200 ${expanded ? "w-full" : "w-12 mx-auto"}`}
      >
        <LogOut className="w-5 h-5 mr-2" />
        <span
          className={`font-semibold transition-all duration-200 ${
            expanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          Logout
        </span>
      </button>
    </aside>
  );
}
