"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Send, Trash2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Resume } from "@/lib/types";
import { deleteResume } from "@/utils/actions/resumes/actions";

interface ApplicationKitCardProps {
  resume: Resume;
}

export function ApplicationKitCard({ resume }: ApplicationKitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteResume(resume.id);
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div className="relative group h-full">
      <Link href={`/dashboard/resumes/${resume.id}`} className="block h-full">
        <div
          className={cn(
            "h-full rounded-2xl overflow-hidden cursor-pointer",
            "bg-white border border-zinc-200",
            "hover:border-[#5b6949]/30 hover:shadow-lg hover:shadow-zinc-200/60",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-0.5",
          )}
        >
          {/* Green top strip */}
          <div className="h-1 bg-gradient-to-r from-[#5b6949] via-[#6d7d56] to-[#5b6949]/60" />

          <div className="p-5 flex flex-col h-[calc(100%-4px)]">
            {/* Title area */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-semibold text-zinc-900 group-hover:text-[#5b6949] transition-colors leading-snug line-clamp-2">
                  {resume.name}
                </h3>
                <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-50 group-hover:bg-[#5b6949] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              {resume.target_role && (
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{resume.target_role}</p>
              )}
            </div>

            {/* Three document sections */}
            <div className="space-y-2 flex-1">
              {[
                { icon: FileText, label: "Resume", accent: true },
                { icon: Mail, label: "Cover Letter", accent: false },
                { icon: Send, label: "Follow-up Email", accent: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200",
                    item.accent
                      ? "bg-[#5b6949]/[0.06]"
                      : "bg-zinc-50 group-hover:bg-zinc-100/70",
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                      item.accent
                        ? "bg-[#5b6949]/15"
                        : "bg-white border border-zinc-200",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-3.5 h-3.5",
                        item.accent ? "text-[#5b6949]" : "text-zinc-400",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      item.accent ? "text-[#5b6949]" : "text-zinc-500",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
              {resume.created_at && (
                <span className="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">
                  {timeAgo(resume.created_at)}
                </span>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-zinc-900">Delete Application Kit</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-500">
                      Are you sure you want to delete &quot;{resume.name}&quot;? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 text-white hover:bg-red-700 rounded-lg"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
